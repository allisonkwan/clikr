chrome.storage.sync.get("userMode", ({ userMode }) => {
  if(userMode == "Contributor"){
    document.getElementById("text").innerHTML = "You are in contributor mode. Go to options to change to user mode.";
    document.getElementById("buttons").style.display = "none";
    document.getElementById("radiodiv").style.display = "none";

  } else {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      console.log(tabs);
      var url = tabs[0].url;
      console.log(url);
      // use url to get list of actions from database.
      var actions = ["test1", "test2", "test3"];
      // we can also get click sequence for all actions in a global var here...

      if (actions.length > 0) {
        constructOptions(actions);
        document.getElementById("text").innerHTML = "Click the button to start click sequence."
        document.getElementById("buttons").style.display = "block";
        document.getElementById("radiodiv").style.display = "block";
        chrome.storage.sync.get("navType", ({navType}) => {
            if (navType == "guided") {
              document.getElementById('guided').checked = true;
            } else {
              document.getElementById('auto').checked = true;
            }
        });

      } else {
        document.getElementById("text").innerHTML = "Data insufficient for actions on this page."
      }
    });
    // button.addEventListener("click", async () => {
    //   let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    //   chrome.scripting.executeScript({
    //     target: { tabId: tab.id },
    //     function: processClicks,
    //   });
    // });
  }
});

document.getElementById('guided').addEventListener("click", radioSelect); 
document.getElementById('auto').addEventListener("click", radioSelect); 


function radioSelect(event) {
  console.log(event.target);
  if (event.target.checked) {
    chrome.storage.sync.set({'navType' : event.target.value});
    console.log(event.target.value);
  }
}

function constructOptions(options) {
  chrome.storage.sync.get("userMode", (data) => {
    let currentOption = data.userMode;

    for (let option of options) {
      let button = document.createElement("button");
      button.dataset.option = option;
      button.appendChild(document.createTextNode(option));

      button.addEventListener("click", processClicks);
      document.getElementById("buttons").appendChild(button);
    }
  });
}

function processClicks(event) {
  let action = event.target.dataset.option;
  event.target.classList.add("selected");
  console.log("Process clicks");
  console.log(action);
  // execute click sequence for action.
  // for testing
  clickSequence = [
    {
        "baseURI": "https://en.wikipedia.org/wiki/Main_Page",
        "id": "",
        "innerHTML": "Livyatan melvillei",
        "tagName": "A",
        "x": 377.984375,
        "y": 256.609375
    },
    {
        "baseURI": "https://en.wikipedia.org/wiki/Livyatan",
        "id": "",
        "innerHTML": "sperm whale",
        "tagName": "A",
        "x": 177,
        "y": 209.640625
    },
    {
        "baseURI": "https://en.wikipedia.org/wiki/Physeteroidea",
        "id": "",
        "innerHTML": "toothed whale",
        "tagName": "A",
        "x": 289.84375,
        "y": 661.59375
    },
    {
        "baseURI": "https://en.wikipedia.org/wiki/Toothed_whale",
        "id": "",
        "innerHTML": "parvorder",
        "tagName": "A",
        "x": 404.1875,
        "y": 202.640625
    },
    {
        "baseURI": "https://en.wikipedia.org/wiki/Order_(biology)#Hierarchy_of_ranks",
        "id": "",
        "innerHTML": "Primatomorpha",
        "tagName": "A",
        "x": 479.46875,
        "y": 1513.109375
    },
    {
        "baseURI": "https://en.wikipedia.org/wiki/Primatomorpha",
        "id": "",
        "innerHTML": "The <b>Primatomorpha</b> are a <a href=\"/wiki/Mirorder\" class=\"mw-redirect\" title=\"Mirorder\">mirorder</a> of <a href=\"/wiki/Mammal\" title=\"Mammal\">mammals</a> containing two extant <a href=\"/wiki/Order_(biology)\" title=\"Order (biology)\">orders</a>:  the <a href=\"/wiki/Dermoptera\" class=\"mw-redirect\" title=\"Dermoptera\">Dermoptera</a> or colugos and the <a href=\"/wiki/Primate\" title=\"Primate\">Primates</a> (<a href=\"/wiki/Plesiadapiformes\" title=\"Plesiadapiformes\">Plesiadapiformes</a>, <a href=\"/wiki/Strepsirrhini\" title=\"Strepsirrhini\">Strepsirrhini</a>, <a href=\"/wiki/Haplorhini\" title=\"Haplorhini\">Haplorhini</a>).\n",
        "tagName": "P",
        "x": 177,
        "y": 177.640625
    }
];
chrome.runtime.sendMessage({action: "background script get clicks", elements : clickSequence});

  // chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //   chrome.tabs.sendMessage(
  //     tabs[0].id, 
  //     {action: "execute clicks", sequence: clickSequence});
  // });
}
