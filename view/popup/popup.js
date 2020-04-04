let changeColor = document.getElementById("changeColor");

chrome.storage.sync.get("color", function(data) {
  changeColor.style.backgroundColor = data.color;
  changeColor.setAttribute("value", data.color);
});

changeColor.onclick = function(e) {
  let wave = document.getElementsByClassName("waves-ripple")[0];
  let x = e.offsetX;
  let y = e.offsetY;
  wave.style.left = x + "px";
  wave.style.top = y + "px";
  wave.setAttribute("class", "waves-ripple active");
  setTimeout(() => {
    wave.style.opacity = 0;
    window.close();
  }, 750);
  
  // browser toast
  chrome.tabs.query(
    {
      active: true,
      currentWindow: true
    },
    function(tabs) {
      chrome.tabs.executeScript(tabs[0].id, {
        code: `
            chrome.storage.sync.set({urlList: []}, function() {
                let Fragment = document.createDocumentFragment();
                let Toast = document.createElement("div");
                Toast.setAttribute("id", "__chrome_spolight_toast");
                Toast.style.width = "180px";
                Toast.style.height = "180px";
                Toast.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
                Toast.style.borderRadius = "20px";
                Toast.style.boxShadow = "0 8px 35px rgba(0,0,0,0.85)";
                Toast.style.boxSizing = "border-box";
                Toast.style.position = "fixed";
                Toast.style.left = "50%";
                Toast.style.top = "50vh";
                Toast.style.zIndex = 9999999;
                Toast.style.transform = "translate3d(-50%,-50%,0)";
                Toast.style.display = "flex";
                Toast.style.alignItems = "center";
                Toast.style.flexDirection = "column";
                Toast.style.justifyContent = "center";
                Toast.style.transition = "0.3s all";
                Toast.style.opacity = "1";
                
                const icon_url = 'data:image/png;base64,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'
                let Icon = document.createElement("img");
                Icon.style.width = "100px";
                Icon.setAttribute("id", "__chrome_spolight_icon");
                Icon.setAttribute("src", icon_url);

                let ToastText = document.createElement("div");
                ToastText.innerText = 'Clean up'
                ToastText.style.color = '#ffffff';
                ToastText.style.marginTop = '20px';
                ToastText.style.fontSize = '20px';
                Toast.appendChild(Icon)
                Toast.appendChild(ToastText)
                Fragment.appendChild(Toast)
                document.body.appendChild(Fragment)
                
                setTimeout(()=>{
                    let windowToast = document.getElementById("__chrome_spolight_toast");
                    windowToast.style.transform = 'translate3d(-50%,-50%,0) scale(0.1)'
                    windowToast.style.opacity = '0.2'
                },900)

                setTimeout(()=>{
                    document.body.removeChild(document.getElementById("__chrome_spolight_toast"));
                },1200)
            });`
      });
    }
  );
};

changeColor.onmouseleave = function() {
  window.close();
};
