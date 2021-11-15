/*! nouislider - 10.0.0 - 2017-05-28 14:52:49 */
!function(t){"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?module.exports=t():window.noUiSlider=t()}((function(){"use strict";function t(t){t.preventDefault()}function e(t){return"number"==typeof t&&!isNaN(t)&&isFinite(t)}function r(t,e,r){r>0&&(o(t,e),setTimeout((function(){s(t,e)}),r))}function n(t){return Array.isArray(t)?t:[t]}function i(t){var e=(t=String(t)).split(".");return e.length>1?e[1].length:0}function o(t,e){t.classList?t.classList.add(e):t.className+=" "+e}function s(t,e){t.classList?t.classList.remove(e):t.className=t.className.replace(new RegExp("(^|\\b)"+e.split(" ").join("|")+"(\\b|$)","gi")," ")}function a(t){var e=void 0!==window.pageXOffset,r="CSS1Compat"===(t.compatMode||"");return{x:e?window.pageXOffset:r?t.documentElement.scrollLeft:t.body.scrollLeft,y:e?window.pageYOffset:r?t.documentElement.scrollTop:t.body.scrollTop}}function l(t,e){return 100/(e-t)}function u(t,e){return 100*e/(t[1]-t[0])}function c(t,e){for(var r=1;t>=e[r];)r+=1;return r}function p(t,e,r){if(r>=t.slice(-1)[0])return 100;var n,i,o,s,a=c(r,t);return n=t[a-1],i=t[a],o=e[a-1],s=e[a],o+function(t,e){return u(t,t[0]<0?e+Math.abs(t[0]):e-t[0])}([n,i],r)/l(o,s)}function f(t,e,r,n){if(100===n)return n;var i,o,s=c(n,t);return r?n-(i=t[s-1])>((o=t[s])-i)/2?o:i:e[s-1]?t[s-1]+function(t,e){return Math.round(t/e)*e}(n-t[s-1],e[s-1]):n}function d(t,r,n){var i;if("number"==typeof r&&(r=[r]),"[object Array]"!==Object.prototype.toString.call(r))throw new Error("noUiSlider ("+D+"): 'range' contains invalid value.");if(!e(i="min"===t?0:"max"===t?100:parseFloat(t))||!e(r[0]))throw new Error("noUiSlider ("+D+"): 'range' value isn't numeric.");n.xPct.push(i),n.xVal.push(r[0]),i?n.xSteps.push(!isNaN(r[1])&&r[1]):isNaN(r[1])||(n.xSteps[0]=r[1]),n.xHighestCompleteStep.push(0)}function h(t,e,r){if(!e)return!0;r.xSteps[t]=u([r.xVal[t],r.xVal[t+1]],e)/l(r.xPct[t],r.xPct[t+1]);var n=(r.xVal[t+1]-r.xVal[t])/r.xNumSteps[t],i=Math.ceil(Number(n.toFixed(3))-1),o=r.xVal[t]+r.xNumSteps[t]*i;r.xHighestCompleteStep[t]=o}function m(t,e,r){this.xPct=[],this.xVal=[],this.xSteps=[r||!1],this.xNumSteps=[!1],this.xHighestCompleteStep=[],this.snap=e;var n,i=[];for(n in t)t.hasOwnProperty(n)&&i.push([t[n],n]);for(i.sort(i.length&&"object"==typeof i[0][0]?function(t,e){return t[0][0]-e[0][0]}:function(t,e){return t[0]-e[0]}),n=0;n<i.length;n++)d(i[n][1],i[n][0],this);for(this.xNumSteps=this.xSteps.slice(0),n=0;n<this.xNumSteps.length;n++)h(n,this.xNumSteps[n],this)}function g(t){if(function(t){return"object"==typeof t&&"function"==typeof t.to&&"function"==typeof t.from}(t))return!0;throw new Error("noUiSlider ("+D+"): 'format' requires 'to' and 'from' methods.")}function v(t,r){if(!e(r))throw new Error("noUiSlider ("+D+"): 'step' is not numeric.");t.singleStep=r}function b(t,e){if("object"!=typeof e||Array.isArray(e))throw new Error("noUiSlider ("+D+"): 'range' is not an object.");if(void 0===e.min||void 0===e.max)throw new Error("noUiSlider ("+D+"): Missing 'min' or 'max' in 'range'.");if(e.min===e.max)throw new Error("noUiSlider ("+D+"): 'range' 'min' and 'max' cannot be equal.");t.spectrum=new m(e,t.snap,t.singleStep)}function S(t,e){if(e=n(e),!Array.isArray(e)||!e.length)throw new Error("noUiSlider ("+D+"): 'start' option is incorrect.");t.handles=e.length,t.start=e}function w(t,e){if(t.snap=e,"boolean"!=typeof e)throw new Error("noUiSlider ("+D+"): 'snap' option must be a boolean.")}function x(t,e){if(t.animate=e,"boolean"!=typeof e)throw new Error("noUiSlider ("+D+"): 'animate' option must be a boolean.")}function y(t,e){if(t.animationDuration=e,"number"!=typeof e)throw new Error("noUiSlider ("+D+"): 'animationDuration' option must be a number.")}function E(t,e){var r,n=[!1];if("lower"===e?e=[!0,!1]:"upper"===e&&(e=[!1,!0]),!0===e||!1===e){for(r=1;r<t.handles;r++)n.push(e);n.push(!1)}else{if(!Array.isArray(e)||!e.length||e.length!==t.handles+1)throw new Error("noUiSlider ("+D+"): 'connect' option doesn't match handle count.");n=e}t.connect=n}function C(t,e){switch(e){case"horizontal":t.ort=0;break;case"vertical":t.ort=1;break;default:throw new Error("noUiSlider ("+D+"): 'orientation' option is invalid.")}}function N(t,r){if(!e(r))throw new Error("noUiSlider ("+D+"): 'margin' option must be numeric.");if(0!==r&&(t.margin=t.spectrum.getMargin(r),!t.margin))throw new Error("noUiSlider ("+D+"): 'margin' option is only supported on linear sliders.")}function U(t,r){if(!e(r))throw new Error("noUiSlider ("+D+"): 'limit' option must be numeric.");if(t.limit=t.spectrum.getMargin(r),!t.limit||t.handles<2)throw new Error("noUiSlider ("+D+"): 'limit' option is only supported on linear sliders with 2 or more handles.")}function P(t,r){if(!e(r))throw new Error("noUiSlider ("+D+"): 'padding' option must be numeric.");if(0!==r){if(t.padding=t.spectrum.getMargin(r),!t.padding)throw new Error("noUiSlider ("+D+"): 'padding' option is only supported on linear sliders.");if(t.padding<0)throw new Error("noUiSlider ("+D+"): 'padding' option must be a positive number.");if(t.padding>=50)throw new Error("noUiSlider ("+D+"): 'padding' option must be less than half the range.")}}function A(t,e){switch(e){case"ltr":t.dir=0;break;case"rtl":t.dir=1;break;default:throw new Error("noUiSlider ("+D+"): 'direction' option was not recognized.")}}function M(t,e){if("string"!=typeof e)throw new Error("noUiSlider ("+D+"): 'behaviour' must be a string containing options.");var r=e.indexOf("tap")>=0,n=e.indexOf("drag")>=0,i=e.indexOf("fixed")>=0,o=e.indexOf("snap")>=0,s=e.indexOf("hover")>=0;if(i){if(2!==t.handles)throw new Error("noUiSlider ("+D+"): 'fixed' behaviour must be used with 2 handles");N(t,t.start[1]-t.start[0])}t.events={tap:r||o,drag:n,fixed:i,snap:o,hover:s}}function O(t,e){if(!1!==e)if(!0===e){t.tooltips=[];for(var r=0;r<t.handles;r++)t.tooltips.push(!0)}else{if(t.tooltips=n(e),t.tooltips.length!==t.handles)throw new Error("noUiSlider ("+D+"): must pass a formatter for all handles.");t.tooltips.forEach((function(t){if("boolean"!=typeof t&&("object"!=typeof t||"function"!=typeof t.to))throw new Error("noUiSlider ("+D+"): 'tooltips' must be passed a formatter or 'false'.")}))}}function k(t,e){t.ariaFormat=e,g(e)}function V(t,e){t.format=e,g(e)}function F(t,e){if(void 0!==e&&"string"!=typeof e&&!1!==e)throw new Error("noUiSlider ("+D+"): 'cssPrefix' must be a string or `false`.");t.cssPrefix=e}function L(t,e){if(void 0!==e&&"object"!=typeof e)throw new Error("noUiSlider ("+D+"): 'cssClasses' must be an object.");if("string"==typeof t.cssPrefix)for(var r in t.cssClasses={},e)e.hasOwnProperty(r)&&(t.cssClasses[r]=t.cssPrefix+e[r]);else t.cssClasses=e}function z(t,e){if(!0!==e&&!1!==e)throw new Error("noUiSlider ("+D+"): 'useRequestAnimationFrame' option should be true (default) or false.");t.useRequestAnimationFrame=e}function j(t){var e={margin:0,limit:0,padding:0,animate:!0,animationDuration:300,ariaFormat:q,format:q},r={step:{r:!1,t:v},start:{r:!0,t:S},connect:{r:!0,t:E},direction:{r:!0,t:A},snap:{r:!1,t:w},animate:{r:!1,t:x},animationDuration:{r:!1,t:y},range:{r:!0,t:b},orientation:{r:!1,t:C},margin:{r:!1,t:N},limit:{r:!1,t:U},padding:{r:!1,t:P},behaviour:{r:!0,t:M},ariaFormat:{r:!1,t:k},format:{r:!1,t:V},tooltips:{r:!1,t:O},cssPrefix:{r:!1,t:F},cssClasses:{r:!1,t:L},useRequestAnimationFrame:{r:!1,t:z}},n={connect:!1,direction:"ltr",behaviour:"tap",orientation:"horizontal",cssPrefix:"noUi-",cssClasses:{target:"target",base:"base",origin:"origin",handle:"handle",handleLower:"handle-lower",handleUpper:"handle-upper",horizontal:"horizontal",vertical:"vertical",background:"background",connect:"connect",ltr:"ltr",rtl:"rtl",draggable:"draggable",drag:"state-drag",tap:"state-tap",active:"active",tooltip:"tooltip",pips:"pips",pipsHorizontal:"pips-horizontal",pipsVertical:"pips-vertical",marker:"marker",markerHorizontal:"marker-horizontal",markerVertical:"marker-vertical",markerNormal:"marker-normal",markerLarge:"marker-large",markerSub:"marker-sub",value:"value",valueHorizontal:"value-horizontal",valueVertical:"value-vertical",valueNormal:"value-normal",valueLarge:"value-large",valueSub:"value-sub"},useRequestAnimationFrame:!0};t.format&&!t.ariaFormat&&(t.ariaFormat=t.format),Object.keys(r).forEach((function(i){if(void 0===t[i]&&void 0===n[i]){if(r[i].r)throw new Error("noUiSlider ("+D+"): '"+i+"' is required.");return!0}r[i].t(e,void 0===t[i]?n[i]:t[i])})),e.pips=t.pips;var i=[["left","top"],["right","bottom"]];return e.style=i[e.dir][e.ort],e.styleOposite=i[e.dir?0:1][e.ort],e}function H(e,i,l){function u(t,e){var r=tt.createElement("div");return e&&o(r,e),t.appendChild(r),r}function c(t,e){var r=u(t,i.cssClasses.origin),n=u(r,i.cssClasses.handle);return n.setAttribute("data-handle",e),n.setAttribute("tabindex","0"),n.setAttribute("role","slider"),n.setAttribute("aria-orientation",i.ort?"vertical":"horizontal"),0===e?o(n,i.cssClasses.handleLower):e===i.handles-1&&o(n,i.cssClasses.handleUpper),r}function p(t,e){return!!e&&u(t,i.cssClasses.connect)}function f(t,e){return!!i.tooltips[e]&&u(t.firstChild,i.cssClasses.tooltip)}function d(t,e,r){function n(t,e){return(t+e).toFixed(7)/1}var i={},o=J.xVal[0],s=J.xVal[J.xVal.length-1],a=!1,l=!1,u=0;return(r=function(t){return t.filter((function(t){return!this[t]&&(this[t]=!0)}),{})}(r.slice().sort((function(t,e){return t-e}))))[0]!==o&&(r.unshift(o),a=!0),r[r.length-1]!==s&&(r.push(s),l=!0),r.forEach((function(o,s){var c,p,f,d,h,m,g,v,b,S=o,w=r[s+1];if("steps"===e&&(c=J.xNumSteps[s]),c||(c=w-S),!1!==S&&void 0!==w)for(c=Math.max(c,1e-7),p=S;w>=p;p=n(p,c)){for(g=(h=(d=J.toStepping(p))-u)/t,b=h/(v=Math.round(g)),f=1;v>=f;f+=1)i[(u+f*b).toFixed(5)]=["x",0];m=r.indexOf(p)>-1?1:"steps"===e?2:0,!s&&a&&(m=0),p===w&&l||(i[d.toFixed(5)]=[p,m]),u=d}})),i}function h(t,e,r){function n(t,e){var r=e===i.cssClasses.value,n=r?l:c;return e+" "+(r?p:f)[i.ort]+" "+n[t]}function s(t,o){o[1]=o[1]&&e?e(o[0],o[1]):o[1];var s=u(a,!1);s.className=n(o[1],i.cssClasses.marker),s.style[i.style]=t+"%",o[1]&&((s=u(a,!1)).className=n(o[1],i.cssClasses.value),s.style[i.style]=t+"%",s.innerText=r.to(o[0]))}var a=tt.createElement("div"),l=[i.cssClasses.valueNormal,i.cssClasses.valueLarge,i.cssClasses.valueSub],c=[i.cssClasses.markerNormal,i.cssClasses.markerLarge,i.cssClasses.markerSub],p=[i.cssClasses.valueHorizontal,i.cssClasses.valueVertical],f=[i.cssClasses.markerHorizontal,i.cssClasses.markerVertical];return o(a,i.cssClasses.pips),o(a,0===i.ort?i.cssClasses.pipsHorizontal:i.cssClasses.pipsVertical),Object.keys(t).forEach((function(e){s(e,t[e])})),a}function m(){X&&(function(t){t.parentElement.removeChild(t)}(X),X=null)}function g(t){m();var e=t.mode,r=t.density||1,n=t.filter||!1,i=function(t,e,r){if("range"===t||"steps"===t)return J.xVal;if("count"===t){if(!e)throw new Error("noUiSlider ("+D+"): 'values' required for mode 'count'.");var n,i=100/(e-1),o=0;for(e=[];(n=o++*i)<=100;)e.push(n);t="positions"}return"positions"===t?e.map((function(t){return J.fromStepping(r?J.getStep(t):t)})):"values"===t?r?e.map((function(t){return J.fromStepping(J.getStep(J.toStepping(t)))})):e:void 0}(e,t.values||!1,t.stepped||!1),o=d(r,e,i),s=t.format||{to:Math.round};return X=_.appendChild(h(o,n,s))}function v(){var t=q.getBoundingClientRect(),e="offset"+["Width","Height"][i.ort];return 0===i.ort?t.width||q[e]:t.height||q[e]}function b(t,e,r,n){var o=function(e){return!_.hasAttribute("disabled")&&(!function(t,e){return t.classList?t.classList.contains(e):new RegExp("\\b"+e+"\\b").test(t.className)}(_,i.cssClasses.tap)&&(!!(e=function(t,e){var r,n,i=0===t.type.indexOf("touch"),o=0===t.type.indexOf("mouse"),s=0===t.type.indexOf("pointer");if(0===t.type.indexOf("MSPointer")&&(s=!0),i){if(t.touches.length>1)return!1;r=t.changedTouches[0].pageX,n=t.changedTouches[0].pageY}return e=e||a(tt),(o||s)&&(r=t.clientX+e.x,n=t.clientY+e.y),t.pageOffset=e,t.points=[r,n],t.cursor=o||s,t}(e,n.pageOffset))&&(!(t===Y.start&&void 0!==e.buttons&&e.buttons>1)&&((!n.hover||!e.buttons)&&(I||e.preventDefault(),e.calcPoint=e.points[i.ort],void r(e,n))))))},s=[];return t.split(" ").forEach((function(t){e.addEventListener(t,o,!!I&&{passive:!0}),s.push([t,o])})),s}function S(t){var e=100*(t-function(t,e){var r=t.getBoundingClientRect(),n=t.ownerDocument,i=n.documentElement,o=a(n);return/webkit.*Chrome.*Mobile/i.test(navigator.userAgent)&&(o.x=0),e?r.top+o.y-i.clientTop:r.left+o.x-i.clientLeft}(q,i.ort))/v();return i.dir?100-e:e}function w(t,e,r,n){var i=r.slice(),o=[!t,t],s=[t,!t];n=n.slice(),t&&n.reverse(),n.length>1?n.forEach((function(t,r){var n=A(i,t,i[t]+e,o[r],s[r],!1);!1===n?e=0:(e=n-i[t],i[t]=n)})):o=s=[!0];var a=!1;n.forEach((function(t,n){a=k(t,r[t]+e,o[n],s[n])||a})),a&&n.forEach((function(t){x("update",t),x("slide",t)}))}function x(t,e,r){Object.keys(Q).forEach((function(n){var o=n.split(".")[0];t===o&&Q[n].forEach((function(t){t.call(B,K.map(i.format.to),e,K.slice(),r||!1,W.slice())}))}))}function y(t,e){"mouseout"===t.type&&"HTML"===t.target.nodeName&&null===t.relatedTarget&&C(t,e)}function E(t,e){if(-1===navigator.appVersion.indexOf("MSIE 9")&&0===t.buttons&&0!==e.buttonsProperty)return C(t,e);var r=(i.dir?-1:1)*(t.calcPoint-e.startCalcPoint);w(r>0,100*r/e.baseSize,e.locations,e.handleNumbers)}function C(e,r){G&&(s(G,i.cssClasses.active),G=!1),e.cursor&&(rt.style.cursor="",rt.removeEventListener("selectstart",t)),Z.forEach((function(t){et.removeEventListener(t[0],t[1])})),s(_,i.cssClasses.drag),O(),r.handleNumbers.forEach((function(t){x("change",t),x("set",t),x("end",t)}))}function N(e,r){if(1===r.handleNumbers.length){var n=T[r.handleNumbers[0]];if(n.hasAttribute("disabled"))return!1;o(G=n.children[0],i.cssClasses.active)}e.stopPropagation();var s=b(Y.move,et,E,{startCalcPoint:e.calcPoint,baseSize:v(),pageOffset:e.pageOffset,handleNumbers:r.handleNumbers,buttonsProperty:e.buttons,locations:W.slice()}),a=b(Y.end,et,C,{handleNumbers:r.handleNumbers}),l=b("mouseout",et,y,{handleNumbers:r.handleNumbers});Z=s.concat(a,l),e.cursor&&(rt.style.cursor=getComputedStyle(e.target).cursor,T.length>1&&o(_,i.cssClasses.drag),rt.addEventListener("selectstart",t,!1)),r.handleNumbers.forEach((function(t){x("start",t)}))}function U(t){t.stopPropagation();var e=S(t.calcPoint),n=function(t){var e=100,r=!1;return T.forEach((function(n,i){if(!n.hasAttribute("disabled")){var o=Math.abs(W[i]-t);e>o&&(r=i,e=o)}})),r}(e);return!1!==n&&(i.events.snap||r(_,i.cssClasses.tap,i.animationDuration),k(n,e,!0,!0),O(),x("slide",n,!0),x("update",n,!0),x("change",n,!0),x("set",n,!0),void(i.events.snap&&N(t,{handleNumbers:[n]})))}function P(t){var e=S(t.calcPoint),r=J.getStep(e),n=J.fromStepping(r);Object.keys(Q).forEach((function(t){"hover"===t.split(".")[0]&&Q[t].forEach((function(t){t.call(B,n)}))}))}function A(t,e,r,n,o,s){return T.length>1&&(n&&e>0&&(r=Math.max(r,t[e-1]+i.margin)),o&&e<T.length-1&&(r=Math.min(r,t[e+1]-i.margin))),T.length>1&&i.limit&&(n&&e>0&&(r=Math.min(r,t[e-1]+i.limit)),o&&e<T.length-1&&(r=Math.max(r,t[e+1]-i.limit))),i.padding&&(0===e&&(r=Math.max(r,i.padding)),e===T.length-1&&(r=Math.min(r,100-i.padding))),!((r=function(t){return Math.max(Math.min(t,100),0)}(r=J.getStep(r)))===t[e]&&!s)&&r}function M(t){return t+"%"}function O(){$.forEach((function(t){var e=W[t]>50?-1:1,r=3+(T.length+e*t);T[t].childNodes[0].style.zIndex=r}))}function k(t,e,r,n){return!1!==(e=A(W,t,e,r,n,!1))&&(function(t,e){W[t]=e,K[t]=J.fromStepping(e);var r=function(){T[t].style[i.style]=M(e),V(t),V(t+1)};window.requestAnimationFrame&&i.useRequestAnimationFrame?window.requestAnimationFrame(r):r()}(t,e),!0)}function V(t){if(R[t]){var e=0,r=100;0!==t&&(e=W[t-1]),t!==R.length-1&&(r=W[t]),R[t].style[i.style]=M(e),R[t].style[i.styleOposite]=M(100-r)}}function F(t,e){null!==t&&!1!==t&&("number"==typeof t&&(t=String(t)),!1===(t=i.format.from(t))||isNaN(t)||k(e,J.toStepping(t),!1,!1))}function L(t,e){var o=n(t),s=void 0===W[0];e=void 0===e||!!e,o.forEach(F),i.animate&&!s&&r(_,i.cssClasses.tap,i.animationDuration),$.forEach((function(t){k(t,W[t],!0,!1)})),O(),$.forEach((function(t){x("update",t),null!==o[t]&&e&&x("set",t)}))}function z(){var t=K.map(i.format.to);return 1===t.length?t[0]:t}function H(t,e){Q[t]=Q[t]||[],Q[t].push(e),"update"===t.split(".")[0]&&T.forEach((function(t,e){x("update",e)}))}var q,T,R,B,X,Y=window.navigator.pointerEnabled?{start:"pointerdown",move:"pointermove",end:"pointerup"}:window.navigator.msPointerEnabled?{start:"MSPointerDown",move:"MSPointerMove",end:"MSPointerUp"}:{start:"mousedown touchstart",move:"mousemove touchmove",end:"mouseup touchend"},I=window.CSS&&CSS.supports&&CSS.supports("touch-action","none")&&function(){var t=!1;try{var e=Object.defineProperty({},"passive",{get:function(){t=!0}});window.addEventListener("test",null,e)}catch(t){}return t}(),_=e,W=[],$=[],G=!1,J=i.spectrum,K=[],Q={},Z=null,tt=e.ownerDocument,et=tt.documentElement,rt=tt.body;if(_.noUiSlider)throw new Error("noUiSlider ("+D+"): Slider was already initialized.");return function(t){o(t,i.cssClasses.target),0===i.dir?o(t,i.cssClasses.ltr):o(t,i.cssClasses.rtl),0===i.ort?o(t,i.cssClasses.horizontal):o(t,i.cssClasses.vertical),q=u(t,i.cssClasses.base)}(_),function(t,e){T=[],(R=[]).push(p(e,t[0]));for(var r=0;r<i.handles;r++)T.push(c(e,r)),$[r]=r,R.push(p(e,t[r+1]))}(i.connect,q),B={destroy:function(){for(var t in i.cssClasses)i.cssClasses.hasOwnProperty(t)&&s(_,i.cssClasses[t]);for(;_.firstChild;)_.removeChild(_.firstChild);delete _.noUiSlider},steps:function(){return W.map((function(t,e){var r=J.getNearbySteps(t),n=K[e],i=r.thisStep.step,o=null;!1!==i&&n+i>r.stepAfter.startValue&&(i=r.stepAfter.startValue-n),o=n>r.thisStep.startValue?r.thisStep.step:!1!==r.stepBefore.step&&n-r.stepBefore.highestStep,100===t?i=null:0===t&&(o=null);var s=J.countStepDecimals();return null!==i&&!1!==i&&(i=Number(i.toFixed(s))),null!==o&&!1!==o&&(o=Number(o.toFixed(s))),[o,i]}))},on:H,off:function(t){var e=t&&t.split(".")[0],r=e&&t.substring(e.length);Object.keys(Q).forEach((function(t){var n=t.split(".")[0],i=t.substring(n.length);e&&e!==n||r&&r!==i||delete Q[t]}))},get:z,set:L,reset:function(t){L(i.start,t)},__moveHandles:function(t,e,r){w(t,e,W,r)},options:l,updateOptions:function(t,e){var r=z(),n=["margin","limit","padding","range","animate","snap","step","format"];n.forEach((function(e){void 0!==t[e]&&(l[e]=t[e])}));var o=j(l);n.forEach((function(e){void 0!==t[e]&&(i[e]=o[e])})),J=o.spectrum,i.margin=o.margin,i.limit=o.limit,i.padding=o.padding,i.pips&&g(i.pips),W=[],L(t.start||r,e)},target:_,removePips:m,pips:g},function(t){t.fixed||T.forEach((function(t,e){b(Y.start,t.children[0],N,{handleNumbers:[e]})})),t.tap&&b(Y.start,q,U,{}),t.hover&&b(Y.move,q,P,{hover:!0}),t.drag&&R.forEach((function(e,r){if(!1!==e&&0!==r&&r!==R.length-1){var n=T[r-1],s=T[r],a=[e];o(e,i.cssClasses.draggable),t.fixed&&(a.push(n.children[0]),a.push(s.children[0])),a.forEach((function(t){b(Y.start,t,N,{handles:[n,s],handleNumbers:[r-1,r]})}))}}))}(i.events),L(i.start),i.pips&&g(i.pips),i.tooltips&&function(){var t=T.map(f);H("update",(function(e,r,n){if(t[r]){var o=e[r];!0!==i.tooltips[r]&&(o=i.tooltips[r].to(n[r])),t[r].innerHTML=o}}))}(),H("update",(function(t,e,r,n,o){$.forEach((function(t){var e=T[t],n=A(W,t,0,!0,!0,!0),s=A(W,t,100,!0,!0,!0),a=o[t],l=i.ariaFormat.to(r[t]);e.children[0].setAttribute("aria-valuemin",n.toFixed(1)),e.children[0].setAttribute("aria-valuemax",s.toFixed(1)),e.children[0].setAttribute("aria-valuenow",a.toFixed(1)),e.children[0].setAttribute("aria-valuetext",l)}))})),B}var D="10.0.0";m.prototype.getMargin=function(t){var e=this.xNumSteps[0];if(e&&t/e%1!=0)throw new Error("noUiSlider ("+D+"): 'limit', 'margin' and 'padding' must be divisible by step.");return 2===this.xPct.length&&u(this.xVal,t)},m.prototype.toStepping=function(t){return p(this.xVal,this.xPct,t)},m.prototype.fromStepping=function(t){return function(t,e,r){if(r>=100)return t.slice(-1)[0];var n,i=c(r,e);return function(t,e){return e*(t[1]-t[0])/100+t[0]}([t[i-1],t[i]],(r-(n=e[i-1]))*l(n,e[i]))}(this.xVal,this.xPct,t)},m.prototype.getStep=function(t){return f(this.xPct,this.xSteps,this.snap,t)},m.prototype.getNearbySteps=function(t){var e=c(t,this.xPct);return{stepBefore:{startValue:this.xVal[e-2],step:this.xNumSteps[e-2],highestStep:this.xHighestCompleteStep[e-2]},thisStep:{startValue:this.xVal[e-1],step:this.xNumSteps[e-1],highestStep:this.xHighestCompleteStep[e-1]},stepAfter:{startValue:this.xVal[e-0],step:this.xNumSteps[e-0],highestStep:this.xHighestCompleteStep[e-0]}}},m.prototype.countStepDecimals=function(){var t=this.xNumSteps.map(i);return Math.max.apply(null,t)},m.prototype.convert=function(t){return this.getStep(this.toStepping(t))};var q={to:function(t){return void 0!==t&&t.toFixed(2)},from:Number};return{version:D,create:function(t,e){if(!t||!t.nodeName)throw new Error("noUiSlider ("+D+"): create requires a single element, got: "+t);var r=H(t,j(e),e);return t.noUiSlider=r,r}}}));