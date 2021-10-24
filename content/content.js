document.addEventListener('click', function(e) {
    chrome.storage.sync.get("userMode", ({ userMode }) => {
        if(userMode == "Contributor"){
            trackClick(e);
        }
    });


}, false);

function trackClick(e) {
    console.log("click");
    e = e || window.event;
    // Get clicked element
    var target = e.target || e.srcElement,
        text = target.textContent || target.innerText; 
    console.log([target]);
    // save relevant data (cannot save entire object with functions in storage)
    var elementData = {
        'tagName' : target.tagName, // = INPUT
        'innerHTML' : target.innerHTML,
        'id': target.id,
        'baseURI' : target.baseURI,
        'x': getOffset(target).left,
        'y': getOffset(target).top
    }
    // update clickSequence in local storage
    chrome.storage.local.get('clickSequence', function(data) {
        var cs = data["clickSequence"];
        cs.push(elementData);
        console.log(cs);
        chrome.storage.local.set({'clickSequence' : cs}, function() {
            console.log('Settings saved');
            // check if added properly
            chrome.storage.local.get('clickSequence', function(data) {
                console.log(data["clickSequence"]);
            });
        });
    });
}

function getOffset(el) {
    const rect = el.getBoundingClientRect();
    return {
      left: rect.left + window.scrollX,
      top: rect.top + window.scrollY
    };
  }

// chrome.runtime.onMessage.addListener(
//     function(request, sender, sendResponse) {
//       console.log(sender.tab ?
//                   "from a content script:" + sender.tab.url :
//                   "from the extension");
//       if (request.action == "content script click"){
//         var yourElement = null;
//         //find your element
//         if (request.element.id != "") {
//             yourElement = document.getElementById(request.element.id);
//         } else {
//             yourElement = getElementByInnerHTML(request.element.tagName, request.element.innerHTML);
//         }
//         if (yourElement != null) {
//             yourElement.click();
//         }
//         console.log("click executed");
//       }
//     }
//   );
window.onload = function() {
    console.log(window.location.href);
    chrome.runtime.onMessage.addListener(
        function(request, sender, sendResponse) {
          if (request.action == "content script click") {
              console.log(request.element);
            if (request.element.id != "") {
                yourElement = document.getElementById(request.element.id);
                //fire off click event on that element
            } else {
                yourElement = getElementByInnerHTML(request.element.tagName, request.element.innerHTML);
            }
            if (yourElement != null) {
                chrome.storage.sync.get("navType", ({navType}) => {
                    if (navType == "guided") {
                      //
                      renderBubble(request.element.x, request.element.y, "Click Here");
                      console.log(yourElement);
                        yourElement.addEventListener("click", () => {
                            chrome.runtime.sendMessage({action: "send content script more"});
                        });

                    } else {
                        yourElement.click();
                        console.log("clicked");
                        chrome.runtime.sendMessage({action: "send content script more"});

                    }
                    
                });
            }
    
            // if (request.element.tagName.toLowerCase() == "input") {
    
            // }
            // sendResponse({ result: request.element });
          }
          return true; 
        });
  };
  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "end clicks") {

        tooltip.style.visibility = 'hidden';
      }
    });

function getElementByInnerHTML (tag, innerHTML) {
    var elements = document.getElementsByTagName(tag.toLowerCase());
    for(var i=0; i<elements.length; i++){
        if(elements[i].innerHTML == innerHTML){
            return elements[i];
        }
    }
}

var tooltip = document.createElement('div');
tooltip.setAttribute('class', 'selection_bubble');
document.body.appendChild(tooltip);


function renderBubble(x, y, message) {
    console.log(' render bubble');
    tooltip.innerHTML = "<div class='arrow-up'></div><br><p>"+message+"</p>";
    tooltip.style.top = y + 6 + 'px';
    tooltip.style.left = x + 'px';
    tooltip.style.visibility = 'visible';
}