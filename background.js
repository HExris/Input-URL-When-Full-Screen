// Copyright 2018 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

"use strict";

chrome.runtime.onInstalled.addListener(() => {
  console.log("Spolight is installed.");
  localStorage.setItem("__chrome_spolight", 0);
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [new chrome.declarativeContent.PageStateMatcher({})],
        actions: [new chrome.declarativeContent.ShowPageAction()]
      }
    ]);
  });
  chrome.commands.onCommand.addListener(function(command) {
    switch (command) {
      case "show_search_bar":
      console.log('show_search_bar')
        chrome.tabs.query(
          {
            active: true,
            currentWindow: true
          },
          function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, { code: `
                      function removeInput() {
                        document.body.removeChild(document.getElementById("__chrome_spolight"));
                      }
                      if (document.getElementById("__chrome_spolight")) {
                        removeInput();
                      } else {
                        let __spolight = document.createElement("div");
                        __spolight.setAttribute("id", "__chrome_spolight");
                        __spolight.style.width = "40%";
                        __spolight.style.minWidth = "310px";
                        __spolight.style.padding = "10px 15px";
                        __spolight.style.backgroundColor = "rgba(0, 0, 0, 0.75)";
                        __spolight.style.borderRadius = "10px";
                        __spolight.style.boxShadow = "0 8px 35px rgba(0,0,0,0.75)";
                        __spolight.style.boxSizing = "border-box";
                        __spolight.style.position = "fixed";
                        __spolight.style.left = "50%";
                        __spolight.style.top = "35%";
                        __spolight.style.transform = "translate3d(-50%,0%,0)";
                        __spolight.style.zIndex = 99999;

                        const iconUrl =
                          "data:image/png;base64,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";
                        let input = document.createElement("input");
                        input.style.flex = 1;
                        input.style.border = "none";
                        input.style.backgroundColor = "transparent";
                        input.style.color = "#ffffff";
                        input.style.marginLeft = "10px";
                        input.style.fontSize = "25px";
                        input.autofocus = true;
                        input.style.outline = "none";
                        input.setAttribute("id", "__chrome_spolight_input");
                        input.setAttribute("placeholder", "Input URL");
                        input.setAttribute('spellcheck',false)
                        input.setAttribute('autocomplete','off')

                        let img = document.createElement("img");
                        img.setAttribute("src", iconUrl);
                        img.style.width = "30px";
                        img.style.height = "30px";

                        let inputBox = document.createElement('div')
                        inputBox.style.display = "flex";
                        inputBox.style.alignItems = "center";
                        
                        inputBox.appendChild(img);
                        inputBox.appendChild(input);

                        let resultBox = document.createElement('div')
                        resultBox.style.marginTop = '5px'
                        resultBox.setAttribute('id','__chrome_spolight_result')

                        __spolight.appendChild(inputBox)
                        __spolight.appendChild(resultBox)

                        document.body.appendChild(__spolight);
                        


                        // Spolight Mounted


                        let colsIndex = 0
                        let historyList = []

                        const defaultcss = 'padding:4px 8px;border-radius:4px;margin:5px 0; display:block; color:#eee; text-decoration: none!important; font-size:20px; text-align:left;'
                        const activecss = 'padding:4px 8px;border-radius:4px;margin:5px 0; display:block; color:#eee; text-decoration: none!important; font-size:20px; text-align:left;background-color:#0567d6;'

                        function indexControler(flag){
                          let resItem = document.getElementsByClassName('__chrome_spolight_result_item')
                          let totalCount = resItem.length
                          if(flag === 2){
                            document.getElementById("__chrome_spolight_input").value = resItem[colsIndex].innerText
                          }else if(flag === 1 && colsIndex < totalCount-1){
                            colsIndex = ++colsIndex
                          }else if(flag === 0 && colsIndex > 0){
                            colsIndex = --colsIndex
                          }else if(flag === -1){
                            colsIndex = 0
                          }
                          for(let i = 0,len = totalCount;i < totalCount;i++){
                            if(colsIndex === i){
                              resItem[i].setAttribute('style',activecss)
                            }else{
                              resItem[i].setAttribute('style',defaultcss)
                            }
                          }
                        }

                        setTimeout(() => {
                          
                          document.getElementById("__chrome_spolight_input").focus();
                          document.getElementById("__chrome_spolight_input").addEventListener("keydown", function(e){
                            ListenerManager(e)
                          })
                          document.getElementById("__chrome_spolight_input").addEventListener("input", function(e){
                            inputListener(e)
                          })
                        }, 10);

                        function ListenerManager(e){
                          enterListener(e)
                          escapeListener(e)
                          directionListener(e)
                        }

                        function enterListener(e) {
                          if (e.code === "Enter") {
                            let url = document.getElementById(
                              "__chrome_spolight_input"
                            ).value
                            if(url.indexOf('http') === -1){
                              url = 'http://' + url
                            }
                            chrome.storage.sync.get(['urlList'], function(result) {
                              console.log('当前列表 ' + result.urlList);
                              let newList = result.urlList.length?result.urlList:[]
                              let flag = true
                              newList.forEach((item)=>{
                                if(item == url || url === 'http://' || (url.indexOf(':') === -1 && url.indexOf('.') === -1) ){
                                  flag = false
                                }
                              })
                              flag && newList.push(url)
                              chrome.storage.sync.set({urlList: newList}, function() {
                                chrome.storage.sync.get(['urlList'], function(result) {
                                  console.log('更新后的列表',result)
                                })
                                window.location = historyList.length ? historyList[colsIndex] : url
                                removeInput()
                              });
                            });
                          }
                        }

                        function escapeListener(e) {
                          if (e.code === "Escape") {
                            removeInput();
                          }
                        }
                        
                        function inputListener(e){
                          let resultList = document.getElementById('__chrome_spolight_result')
                          let value = e.target.value
                          if(value){
                            chrome.storage.sync.get(['urlList'],function(result){
                              let res = []
                              result.urlList.forEach(item => {
                                if(item.indexOf(value) !== -1){
                                  res.push(item)
                                }
                              })
                              let resultDOM = ''
                              res.forEach((item,index) => {
                                if(index === 0){
                                  resultDOM += '<a href='+item+'class="__chrome_spolight_result_item" class="__chrome_spolight_result_item" style="'+ activecss +'">'+item+'</a>'
                                }else{
                                  resultDOM += '<a href='+item+'class="__chrome_spolight_result_item" class="__chrome_spolight_result_item" style="'+ defaultcss +'">'+item+'</a>'
                                }
                              })
                              historyList = res
                              indexControler(-1)
                              resultList.innerHTML = resultDOM
                            })
                          }else{
                            resultList.innerHTML = ''
                          }
                        }
                        
                        function directionListener(e){
                          switch(e.which){
                            // ↑
                            case 38:
                            console.log('↑')
                            indexControler(0)
                            console.log(colsIndex)
                            break;
                            // ↓
                            case 40:
                            console.log('↓')
                            indexControler(1)
                            console.log(colsIndex)
                            break;
                            // ←
                            case 37:
                            console.log('←')
                            break;
                            // →
                            case 39:
                            indexControler(2)
                            console.log('→')
                            break;
                            // Tab
                            case 9:
                            e.preventDefault()
                            indexControler(2)
                            console.log('Tab')
                            break;
                          }
                        }
                      }

                  ` });
          }
        );
        break;
    }
  });
});
