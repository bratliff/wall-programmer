// JavaScript Document

$(function(){
  if(window.Touch) {
    touch_detect.auto_detected();
  } else {
    document.ontouchstart = touch_detect.surface;
  }
}); // End loaded jQuery
var touch_detect = {
  auto_detected: function(event){
    /* add everything you want to do onLoad here (eg. activating hover controls) */
    alert('this was auto detected');
    activateTouchArea();
  },
  surface: function(event){
    /* add everything you want to do ontouchstart here (eg. drag & drop) - you can fire this in both places */
    alert('this was detected by touching');
    activateTouchArea();
  }
}; // touch_detect
function activateTouchArea(){
  /* make sure our screen doesn't scroll when we move the "touchable area" */
  var element = document.getElementById('element_id');
  element.addEventListener("touchstart", touchStart, false);
}
function touchStart(event) {
  /* modularize preventing the default behavior so we can use it again */
  event.preventDefault();
}