var userMode = 'Contributor'; // default
var clickSequence = [];
var urls = [];
var navType = 'guided';

var elementsToClick = [];

// Stuff to do when the extension is installed/updated.
chrome.runtime.onInstalled.addListener((info) => {
  // open tab to choose user mode when chrome extension is installed
  if (info.reason === chrome.runtime.OnInstalledReason.INSTALL) {
    chrome.storage.sync.set({ userMode });
    chrome.storage.sync.set({ navType });
    chrome.tabs.create({
      url: 'extension-pages/options.html'
    });
  }

  chrome.storage.local.set({ clickSequence });

  // keep track of currently open tab urls
  chrome.tabs.query({
    currentWindow: true
  }, function(tabs) {
      for (var i = 0; i < tabs.length; i++) {
        urls[tabs[i].id] = tabs[i].url;
      }
  });
});

chrome.tabs.onRemoved.addListener(function(tabid, removed) {
  chrome.storage.sync.get("userMode", ({ userMode }) => {
    if(userMode == "Contributor"){
      console.log(tabid);
      console.log(urls);
      if (!urls[tabid].includes("chrome-extension://") && !urls[tabid].includes("chrome://")) {
        console.log("action tab closed");
        console.log(urls[tabid]);
        // ask contributor for previous action
        chrome.tabs.create({url:"extension-pages/action_collector.html"});
      } else {
        chrome.storage.local.set({ 'clickSequence' : [] }); // clear local clicksequence
      }
    }
  });
 });

  // keep track of urls of all tabs.
chrome.tabs.onUpdated.addListener(function(tabid, changeInfo, tab) {
  if (changeInfo.url) {
    console.log(changeInfo.url);
    urls[tabid] = changeInfo.url;
  }
});

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if (request.action == "background script get clicks") {
      elementsToClick = request.elements;

      chrome.windows.getCurrent(w => {
        chrome.tabs.query({active: true, windowId: w.id}, tabs => {
          const tabId = tabs[0].id;
          // for (let i in request.elements) {
              // chrome.storage.local.get('contentReady', function(contentReady) {
                // console.log(contentReady);
                // if (contentReady) {
                  if(elementsToClick.length > 0) {
                    console.log(elementsToClick);
                    chrome.tabs.sendMessage(tabId, {action: "content script click", element: elementsToClick[0]});
                    elementsToClick.splice(0,1);
                  }
                  
                // }
              // });
            
            

            // chrome.tabs.update(null, {
            //   url: request.elements[i].baseURI
            // }, function (tab) {
            //     chrome.tabs.onUpdated.addListener(function listener (id, info) {
            //         if (info.status === 'complete' && id === tabId) {
            //             console.log(request.elements[i]);
            //             chrome.tabs.onUpdated.removeListener(listener);
            //             chrome.tabs.sendMessage(tabId, {action: "content script click", element: request.elements[i]});
            //           }
            //     });
            // });

            ////////////
          //   console.log("in loop")
          //   chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {    
          //     console.log("updated")      
          //     if (changeInfo.status == 'complete') {   
          //        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
          //           console.log(request.elements[i]);
          //           chrome.tabs.sendMessage(tabs[0].id, {action: "content script click", element: request.elements[i]});  
          //        });
          //     }
          //  });
          ////////////
          // }
        });
      });
    }
  });

  chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.action == "send content script more") {
        if(elementsToClick.length > 0){
          console.log("got message and sending");
          chrome.tabs.onUpdated.addListener(function listener (id, info) {
           chrome.windows.getCurrent(w => {
              chrome.tabs.query({active: true, windowId: w.id}, tabs => {
                const tabId = tabs[0].id;
                if (info.status === 'complete' && tabId === id && tabs[0].url == elementsToClick[0].baseURI) {
                  console.log(elementsToClick);
                  console.log(elementsToClick[0]);
                  chrome.tabs.sendMessage(tabId, {action: "content script click", element: elementsToClick[0]});
                  elementsToClick.splice(0,1);
                }
            });
              
            });
          });
        }else{
          chrome.windows.getCurrent(w => {
            chrome.tabs.query({active: true, windowId: w.id}, tabs => {
              const tabId = tabs[0].id;
              chrome.tabs.sendMessage(tabId, {action: "end clicks"});

          });
            
          });
        }
        
      }
    });
  
function checkAndClick(element) {
  chrome.tabs.query({currentWindow: true, active: true},
    function (tabs) {
      if (tabs[0].url == element.baseURI) {
          console.log(tabs[0].url);
          chrome.tabs.sendMessage(
              tabs[0].id,
              {action: "content script click", element : element});
      } else {
          setTimeout(checkAndClick(element), 1000);
      }
    });

}