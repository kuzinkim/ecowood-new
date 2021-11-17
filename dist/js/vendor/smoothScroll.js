function initSmoothScrolling() {
  
  var duration = 800;

  var pageUrl = location.hash ?
    stripHash(location.href) :
    location.href;

  // delegatedLinkHijacking();
  directLinkHijacking();

  function delegatedLinkHijacking() {
    document.body.addEventListener('click', onClick, false);

    function onClick(e) {
      if (!isInPageLink(e.target))
        return;

      e.stopPropagation();
      e.preventDefault();

      jump(e.target.hash, {
        duration: duration,
        callback: function() {
          setFocus(e.target.hash);
        }
      });
    }
  }

  function directLinkHijacking() {
    [].slice.call(document.querySelectorAll('a'))
      .filter(isInPageLink)
      .forEach(function(a) {
        a.addEventListener('click', onClick, false);
      });

    function onClick(e) {
      e.stopPropagation();
      e.preventDefault();

      jump(e.target.hash, {
        duration: duration,
      });
    }

  }

  function isInPageLink(n) {
    return n.tagName.toLowerCase() === 'a' &&
      n.hash.length > 0 &&
      stripHash(n.href) === pageUrl;
  }

  function stripHash(url) {
    return url.slice(0, url.lastIndexOf('#'));
  }

  function setFocus(hash) {
    var element = document.getElementById(hash.substring(1));

    if (element) {
      if (!/^(?:a|select|input|button|textarea)$/i.test(element.tagName)) {
        element.tabIndex = -1;
      }

      element.focus();
    }
  }

}

function jump(target, options) {
  var
    start = window.pageYOffset,
    opt = {
      duration: options.duration,
      offset: options.offset || 0,
      callback: options.callback,
      easing: options.easing || easeInOutQuad
    },
    distance = typeof target === 'string' ?
    opt.offset + document.querySelector(target).getBoundingClientRect().top - 126 :
    target,
    duration = typeof opt.duration === 'function' ?
    opt.duration(distance) :
    opt.duration,
    timeStart, timeElapsed;

  requestAnimationFrame(function(time) {
    timeStart = time;
    loop(time);
  });

  function loop(time) {
    timeElapsed = time - timeStart;

    window.scrollTo(0, opt.easing(timeElapsed, start, distance, duration));

    if (timeElapsed < duration)
      requestAnimationFrame(loop)
    else
      end();
  }

  function end() {
    window.scrollTo(0, start + distance);

    if (typeof opt.callback === 'function')
      opt.callback();
  }

  function easeInOutQuad(t, b, c, d) {
    t /= d / 2
    if (t < 1) return c / 2 * t * t + b
    t--
    return -c / 2 * (t * (t - 2) - 1) + b
  }

}
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJ2ZW5kb3Ivc21vb3RoU2Nyb2xsLmpzIl0sInNvdXJjZXNDb250ZW50IjpbImZ1bmN0aW9uIGluaXRTbW9vdGhTY3JvbGxpbmcoKSB7XHJcbiAgXHJcbiAgdmFyIGR1cmF0aW9uID0gODAwO1xyXG5cclxuICB2YXIgcGFnZVVybCA9IGxvY2F0aW9uLmhhc2ggP1xyXG4gICAgc3RyaXBIYXNoKGxvY2F0aW9uLmhyZWYpIDpcclxuICAgIGxvY2F0aW9uLmhyZWY7XHJcblxyXG4gIC8vIGRlbGVnYXRlZExpbmtIaWphY2tpbmcoKTtcclxuICBkaXJlY3RMaW5rSGlqYWNraW5nKCk7XHJcblxyXG4gIGZ1bmN0aW9uIGRlbGVnYXRlZExpbmtIaWphY2tpbmcoKSB7XHJcbiAgICBkb2N1bWVudC5ib2R5LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgb25DbGljaywgZmFsc2UpO1xyXG5cclxuICAgIGZ1bmN0aW9uIG9uQ2xpY2soZSkge1xyXG4gICAgICBpZiAoIWlzSW5QYWdlTGluayhlLnRhcmdldCkpXHJcbiAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAganVtcChlLnRhcmdldC5oYXNoLCB7XHJcbiAgICAgICAgZHVyYXRpb246IGR1cmF0aW9uLFxyXG4gICAgICAgIGNhbGxiYWNrOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAgIHNldEZvY3VzKGUudGFyZ2V0Lmhhc2gpO1xyXG4gICAgICAgIH1cclxuICAgICAgfSk7XHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBkaXJlY3RMaW5rSGlqYWNraW5nKCkge1xyXG4gICAgW10uc2xpY2UuY2FsbChkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhJykpXHJcbiAgICAgIC5maWx0ZXIoaXNJblBhZ2VMaW5rKVxyXG4gICAgICAuZm9yRWFjaChmdW5jdGlvbihhKSB7XHJcbiAgICAgICAgYS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIG9uQ2xpY2ssIGZhbHNlKTtcclxuICAgICAgfSk7XHJcblxyXG4gICAgZnVuY3Rpb24gb25DbGljayhlKSB7XHJcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcclxuXHJcbiAgICAgIGp1bXAoZS50YXJnZXQuaGFzaCwge1xyXG4gICAgICAgIGR1cmF0aW9uOiBkdXJhdGlvbixcclxuICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gaXNJblBhZ2VMaW5rKG4pIHtcclxuICAgIHJldHVybiBuLnRhZ05hbWUudG9Mb3dlckNhc2UoKSA9PT0gJ2EnICYmXHJcbiAgICAgIG4uaGFzaC5sZW5ndGggPiAwICYmXHJcbiAgICAgIHN0cmlwSGFzaChuLmhyZWYpID09PSBwYWdlVXJsO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gc3RyaXBIYXNoKHVybCkge1xyXG4gICAgcmV0dXJuIHVybC5zbGljZSgwLCB1cmwubGFzdEluZGV4T2YoJyMnKSk7XHJcbiAgfVxyXG5cclxuICBmdW5jdGlvbiBzZXRGb2N1cyhoYXNoKSB7XHJcbiAgICB2YXIgZWxlbWVudCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGhhc2guc3Vic3RyaW5nKDEpKTtcclxuXHJcbiAgICBpZiAoZWxlbWVudCkge1xyXG4gICAgICBpZiAoIS9eKD86YXxzZWxlY3R8aW5wdXR8YnV0dG9ufHRleHRhcmVhKSQvaS50ZXN0KGVsZW1lbnQudGFnTmFtZSkpIHtcclxuICAgICAgICBlbGVtZW50LnRhYkluZGV4ID0gLTE7XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGVsZW1lbnQuZm9jdXMoKTtcclxuICAgIH1cclxuICB9XHJcblxyXG59XHJcblxyXG5mdW5jdGlvbiBqdW1wKHRhcmdldCwgb3B0aW9ucykge1xyXG4gIHZhclxyXG4gICAgc3RhcnQgPSB3aW5kb3cucGFnZVlPZmZzZXQsXHJcbiAgICBvcHQgPSB7XHJcbiAgICAgIGR1cmF0aW9uOiBvcHRpb25zLmR1cmF0aW9uLFxyXG4gICAgICBvZmZzZXQ6IG9wdGlvbnMub2Zmc2V0IHx8IDAsXHJcbiAgICAgIGNhbGxiYWNrOiBvcHRpb25zLmNhbGxiYWNrLFxyXG4gICAgICBlYXNpbmc6IG9wdGlvbnMuZWFzaW5nIHx8IGVhc2VJbk91dFF1YWRcclxuICAgIH0sXHJcbiAgICBkaXN0YW5jZSA9IHR5cGVvZiB0YXJnZXQgPT09ICdzdHJpbmcnID9cclxuICAgIG9wdC5vZmZzZXQgKyBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHRhcmdldCkuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCkudG9wIC0gMTI2IDpcclxuICAgIHRhcmdldCxcclxuICAgIGR1cmF0aW9uID0gdHlwZW9mIG9wdC5kdXJhdGlvbiA9PT0gJ2Z1bmN0aW9uJyA/XHJcbiAgICBvcHQuZHVyYXRpb24oZGlzdGFuY2UpIDpcclxuICAgIG9wdC5kdXJhdGlvbixcclxuICAgIHRpbWVTdGFydCwgdGltZUVsYXBzZWQ7XHJcblxyXG4gIHJlcXVlc3RBbmltYXRpb25GcmFtZShmdW5jdGlvbih0aW1lKSB7XHJcbiAgICB0aW1lU3RhcnQgPSB0aW1lO1xyXG4gICAgbG9vcCh0aW1lKTtcclxuICB9KTtcclxuXHJcbiAgZnVuY3Rpb24gbG9vcCh0aW1lKSB7XHJcbiAgICB0aW1lRWxhcHNlZCA9IHRpbWUgLSB0aW1lU3RhcnQ7XHJcblxyXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIG9wdC5lYXNpbmcodGltZUVsYXBzZWQsIHN0YXJ0LCBkaXN0YW5jZSwgZHVyYXRpb24pKTtcclxuXHJcbiAgICBpZiAodGltZUVsYXBzZWQgPCBkdXJhdGlvbilcclxuICAgICAgcmVxdWVzdEFuaW1hdGlvbkZyYW1lKGxvb3ApXHJcbiAgICBlbHNlXHJcbiAgICAgIGVuZCgpO1xyXG4gIH1cclxuXHJcbiAgZnVuY3Rpb24gZW5kKCkge1xyXG4gICAgd2luZG93LnNjcm9sbFRvKDAsIHN0YXJ0ICsgZGlzdGFuY2UpO1xyXG5cclxuICAgIGlmICh0eXBlb2Ygb3B0LmNhbGxiYWNrID09PSAnZnVuY3Rpb24nKVxyXG4gICAgICBvcHQuY2FsbGJhY2soKTtcclxuICB9XHJcblxyXG4gIGZ1bmN0aW9uIGVhc2VJbk91dFF1YWQodCwgYiwgYywgZCkge1xyXG4gICAgdCAvPSBkIC8gMlxyXG4gICAgaWYgKHQgPCAxKSByZXR1cm4gYyAvIDIgKiB0ICogdCArIGJcclxuICAgIHQtLVxyXG4gICAgcmV0dXJuIC1jIC8gMiAqICh0ICogKHQgLSAyKSAtIDEpICsgYlxyXG4gIH1cclxuXHJcbn0iXSwiZmlsZSI6InZlbmRvci9zbW9vdGhTY3JvbGwuanMifQ==
