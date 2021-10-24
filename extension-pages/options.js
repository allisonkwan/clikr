let page = document.getElementById("buttonDiv");
let selectedClassName = "current";
const presetOptions = ["Contributor", "User"];

function handleButtonClick(event) {
  let current = event.target.parentElement.querySelector(
    `.${selectedClassName}`
  );
  if (current && current !== event.target) {
    current.classList.remove(selectedClassName);
  }

  let option = event.target.dataset.option;
  event.target.classList.add(selectedClassName);
  chrome.storage.sync.set({"userMode" : option});
}

function constructOptions(options) {
  chrome.storage.sync.get("userMode", (data) => {
    let currentOption = data.userMode;

    for (let option of options) {
      let button = document.createElement("button");
      button.dataset.option = option;
      button.appendChild(document.createTextNode(option));

      if (option === currentOption) {
        button.classList.add(selectedClassName);
      }

      button.addEventListener("click", handleButtonClick);
      page.appendChild(button);
    }
  });
}

constructOptions(presetOptions);
