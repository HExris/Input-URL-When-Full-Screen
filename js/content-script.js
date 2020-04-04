// Add Ready Event
document.ready = function (callback) {
    if (document.addEventListener) {
        document.addEventListener('DOMContentLoaded', function () {
            document.removeEventListener('DOMContentLoaded', arguments.callee, false);
            callback();
        }, false)
    } else if (document.attachEvent) {
        document.attachEvent('onreadystatechange', function () {
            if (document.readyState == "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);
                callback();
            }
        })
    } else if (document.lastChild == document.body) {
        callback();
    }
}

// Loading
const createLoading = () => {
    let div = document.createElement('div')
    div.setAttribute('id', '__exris_loader_wrapper')
    div.innerHTML = `<div id="__exirs_loader" class="__exris_loader">
    <div class="__exris_loader-inner">
        <div class="__exris_loader-line-wrap">
            <div class="__exris_loader-line"></div>
        </div>
        <div class="__exris_loader-line-wrap">
            <div class="__exris_loader-line"></div>
        </div>
        <div class="__exris_loader-line-wrap">
            <div class="__exris_loader-line"></div>
        </div>
        <div class="__exris_loader-line-wrap">
            <div class="__exris_loader-line"></div>
        </div>
        <div class="__exris_loader-line-wrap">
            <div class="__exris_loader-line"></div>
        </div>
    </div>
    </div>`
    document.body.appendChild(div)
}

const removeLoading = () => {
    document.getElementById('__exirs_loader').style = `
    background: radial-gradient(rgba(0, 0, 0, .2), transparent);
    bottom: 0;
    left: 0;
    overflow: hidden;
    position: fixed;
    right: 0;
    top: 0;
    width: 100vw;
    height: 100vh;
    z-index: 99999;
    transition: all .3s;`
    $('#__exris_loader_wrapper').fadeOut()
}

// Remove filters
const removeFilter = () => {
    // Rewrite style of body
    $("body").addClass("not_gary_filter");
    // Insert global style
    let style = document.createElement('style');
    style.setAttribute("id", "__remove_filter");
    style.type = 'text/css';
    style.innerHTML = `
    body,
    html,
    div {
        filter: grayscale(0%) !important;
    }
    
    body>*,
    html>*,
    div>* {
        filter: grayscale(0%) !important;
    }`;
    document.body.appendChild(style)
}


const main = () => {
    // Add hack style when document ready
    document.ready(() => {
        createLoading()
        removeFilter()
        setTimeout(() => {
            removeLoading()
        }, 400)
    })
    // Keep rewirte style from loading css files
    window.onload = () => {
        removeFilter()
    }
}

main()