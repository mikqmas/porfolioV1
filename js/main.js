var contentDiv = document.getElementById("content"),
pageDiv = document.getElementById("page"),
containerDiv = document.getElementById("container"),
samContainerDiv = document.getElementById("sam-container"),
samDiv = document.getElementById("sam"),
samSprite = document.getElementById("sam-sprite"),
instructions = document.getElementById('instructions'),
loading = document.getElementById('loading'),
layerHorizontalArray = new Array,
layerHorizontalSpeedArray = new Array,
pageVerticalPosition = 0,
deltaPageVerticalPosition = 0,
previousPageVerticalPosition = 0,
isRunning = true,
running,
standing,
timeout,
count = 0,
first = 0,
keys = {37: 1, 38: 1, 39: 1, 40: 1};

disableScroll();

function preventDefault(e) {
  e = e || window.event;
  if (e.preventDefault)
      e.preventDefault();
  e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
    if (keys[e.keyCode]) {
        preventDefault(e);
        return false;
    }
}

function disableScroll() {
  if (window.addEventListener) // older FF
      window.addEventListener('DOMMouseScroll', preventDefault, false);
  window.onwheel = preventDefault; // modern standard
  window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
  window.ontouchmove  = preventDefault; // mobile
  document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
    if (window.removeEventListener)
        window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.onmousewheel = document.onmousewheel = null;
    window.onwheel = null;
    window.ontouchmove = null;
    document.onkeydown = null;
}

function setLayerSpeed() {
    for (; layerHorizontalSpeedArray.length > 0; ){
      layerHorizontalSpeedArray.pop();
    }
    for (var e = 0; e < layerHorizontalArray.length; e++) {
        var t = (layerHorizontalArray[e].offsetWidth - containerDiv.offsetWidth) / (layerHorizontalArray[layerHorizontalArray.length - 1].offsetWidth - containerDiv.offsetWidth);
        layerHorizontalSpeedArray.push(t)
    }
}

function setPageHeight() {
    pageDiv.style.height = document.getElementById('layer-horizontal-3').offsetWidth - 1000 + "px"
}

window.onload = function() {
  document.getElementById("scroll").style.display = "block";
  document.getElementById("loading").style.display = "none";
  enableScroll();
  setPageHeight();
  storeDivs();
  setLayerSpeed();
  runTheseFunctionsAfterScrollOrSwipe();
  checkStatus();
};

window.onscroll = function(e) {
  if(first === 2) {
    instructions.parentElement.removeChild(instructions);
  }
  first += 1;
  runTheseFunctionsAfterScrollOrSwipe();
};

window.onkeyup = function(e) {
  if(e.key === "KeyUp" || e.key === "KeyDown") {
    checkStatus();
  }
};

window.onresize = function(e) {
  setPageHeight();
  storeDivs();
  setLayerSpeed();
  runTheseFunctionsAfterScrollOrSwipe();
};

function checkStatus(){
  var checking = setInterval(function(){
    detectPageVerticalPosition();
    if(Math.abs(deltaPageVerticalPosition) < 5) {
      isRunning = false;
      cancelAnimationFrame(running);
      clearTimeout(timeout);
      standingAni();
      clearInterval(checking);
    }
  },500);
}


function runTheseFunctionsAfterScrollOrSwipe() {
  detectPageVerticalPosition();
  orientSam();
  moveLayers();
  if(isRunning === false && Math.abs(deltaPageVerticalPosition) > 5){
    isRunning = true;
    cancelAnimationFrame(standing);
    clearTimeout(timeout);
    runningAni();
    checkStatus();
  }
}

function detectPageVerticalPosition(){
  previousPageVerticalPosition = pageVerticalPosition;
  pageVerticalPosition = window.scrollY;
  deltaPageVerticalPosition = pageVerticalPosition - previousPageVerticalPosition;
}

function moveLayers() {
  for (var e = 0; e < layerHorizontalArray.length; e++) {
    layerHorizontalArray[e].style.left = -1 * layerHorizontalSpeedArray[e] * pageVerticalPosition + "px";
  }
}

function storeDivs() {
    for (var e = document.getElementsByTagName("div"), t = 0; t < e.length; t++){
      "layer-horizontal" == e[t].getAttribute("class") && layerHorizontalArray.push(e[t])
    }
}

function orientSam() {
    deltaPageVerticalPosition > 0 && (samSprite.style.top = "0px"),
    0 > deltaPageVerticalPosition && (samSprite.style.top = "-200px")
}


function standingAni() {
  timeout = setTimeout(function(){
    if(count < 8 || count > 11) { count = 8;}
    samSprite.style.left = (count * -175) + "px";
    count += 1;
    standing = requestAnimationFrame(standingAni);
  },(1000/5));
}

function runningAni() {
  timeout = setTimeout(function(){
    if(count > 7) { count = 0; }
    samSprite.style.left = (count * -175) + "px";
    count += 1;
    running = requestAnimationFrame(runningAni);
  },(1000/9));
}
