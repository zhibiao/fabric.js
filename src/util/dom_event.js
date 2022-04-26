(function () {
  // since ie11 can use addEventListener but they do not support options, i need to check
  var couldUseAttachEvent = !!fabric.document.createElement('div').attachEvent,
      touchEvents = ['touchstart', 'touchmove', 'touchend'];
  /**
   * Adds an event listener to an element
   * @function
   * @memberOf fabric.util
   * @param {HTMLElement} element
   * @param {String} eventName
   * @param {Function} handler
   */
  fabric.util.addListener = function(element, eventName, handler, options) {
    function _handler(event){
      
      if (fabric.util.isTouchEvent(event)) {
        var _event = new CustomEvent(event.type);

        for (var key in event) {
          _event[key] = event[key];
        }

        if (event.type == "touchstart" || event.type == "touchmove" /*|| event.type == "touchend"*/) {
          var _touches = [],
          _changedTouches = [];

          for (var n = 0; n < event.touches.length; n++) {
            if (event.touches[n].target == event.target) {
              _touches.push(event.touches[n]);
            }
          }

          for (var m = 0; m < event.changedTouches.length; m++) {
            if (event.changedTouches[m].target == event.target) {
              _changedTouches.push(event.changedTouches[m]);
            }
          }

          _event.touches = _touches;
          _event.changedTouches = _changedTouches;
      }

      handler.call(this, _event);

      }else{
        handler.call(this, event);
      }

    }
    
    element && element.addEventListener(eventName, _handler, couldUseAttachEvent ? false : options);
  };

  /**
   * Removes an event listener from an element
   * @function
   * @memberOf fabric.util
   * @param {HTMLElement} element
   * @param {String} eventName
   * @param {Function} handler
   */
  fabric.util.removeListener = function(element, eventName, handler, options) {
    element && element.removeEventListener(eventName, handler, couldUseAttachEvent ? false : options);
  };

  function getTouchInfo(event) {
    var touchProp = event.changedTouches;
    if (touchProp && touchProp[0]) {
      return touchProp[0];
    }
    return event;
  }

  fabric.util.getPointer = function(event) {
    var element = event.target,
        scroll = fabric.util.getScrollLeftTop(element),
        _evt = getTouchInfo(event);
    return {
      x: _evt.clientX + scroll.left,
      y: _evt.clientY + scroll.top
    };
  };

  fabric.util.isTouchEvent = function(event) {
    return touchEvents.indexOf(event.type) > -1 || event.pointerType === 'touch';
  };
})();
