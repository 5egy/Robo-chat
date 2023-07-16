import "./style.css";
import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chat_container = document.getElementById("chat_container");

let loadInterval;

function loader(element) {
  element.textContent = "";
  loadInterval = setInterval(() => {
    element.textContent += ".";

    if (element.textContent === "....") {
      element.textContent = "";
    }
  }, 300);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
      // let angle = chat_container.getBoundingClientRect()
      // window.scrollTo(0, angle.height)
    } else {
      // form.classList.remove("hide")
      clearInterval(interval);
    }
  }, 20);
}

function generateId() {
  const time = Date.now();
  const random = Math.random();
  const decimalString = random.toString(16);

  return `id-${time}-${decimalString}`;
}

function chatStripe(ai, value, id) {
  return `<div class="text-wrap" id= ${ai ? "ai" : ""}>
<div class="chat">

<div class="profile">
<img src="${ai ? bot : user}" alt="profile svg"/>
</div>

<p class="message" id=${id}>
${value}
</p>
</div>
</div>`;
}

async function handleSubmit(e) {
  e.preventDefault();

  const data = new FormData(form);

  //User Typed
  chat_container.innerHTML += chatStripe(false, data.get("prompt"));
  // let angle = chat_container.getBoundingClientRect()
  // window.scrollTo(0, angle.height)

  form.reset();
  // form.classList.add("hide")

  const id = generateId();

  // Bot Replies
  chat_container.innerHTML += chatStripe(true, " ", id);
  chat_container.scrollTop = chat_container.scrollHeight;

  const message = document.getElementById(id);
  loader(message);

    const response = await fetch("https://robocht.onrender.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: data.get("prompt"),
      }),
    });

    clearInterval(loadInterval);
    message.innerHTML = "";

    if (response.ok) {
      const data = await response.json();
      const parsedData = data.bot.trim();
      typeText(message, parsedData);
    } else {
      const err = await response.text();
      message.innerHTML = err;
    }
}

form.addEventListener("submit", handleSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
});
