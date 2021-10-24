
document.addEventListener('click', function(e) {
    e = e || window.event;
    // Get clicked element
    var target = e.target || e.srcElement,
        text = target.textContent || target.innerText; 
    if (target.id == "submit") {
        var action = document.getElementById("action").value;
        chrome.storage.local.get('clickSequence', function(data) {
            var cs = data["clickSequence"];
            // store action and click sequence into database
            console.log(cs);
            console.log(action);
            console.log(cs[0].baseURI);
            document.getElementById("url").innerHTML = cs[0].baseURI;
            chrome.storage.local.set({ 'clickSequence' : [] }); // clear local clicksequence
        });
    }
}, false);

chrome.storage.local.get('clickSequence', function(data) {
    var cs = data["clickSequence"];
    document.getElementById("url").innerHTML = cs[0].baseURI;
});