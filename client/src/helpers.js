export function debounce(func, wait, immediate) {
   var timeout;
   return function () {
      var obj = this,
         args = arguments;

      var later = function () {
         timeout = null;
         if (!immediate) func.apply(obj, args);
      };
      var callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(obj, args);
   };
}

export function getFormattedDate(date, prefomattedDate = false, hideYear = false) {
   const MONTH_NAMES = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
   ];
   const day = date.getDate();
   const month = MONTH_NAMES[date.getMonth()];
   const year = date.getFullYear();
   const hours = date.getHours();
   let minutes = date.getMinutes();

   if (minutes < 10) {
      // Adding leading zero to minutes
      minutes = `0${minutes}`;
   }

   if (prefomattedDate) {
      // Today at 10:20
      // Yesterday at 10:20
      return `${prefomattedDate} at ${hours}:${minutes}`;
   }

   if (hideYear) {
      // 10. January at 10:20
      return `${day} ${month} at ${hours}:${minutes}`;
   }

   // 10. January 2017. at 10:20
   return `${day} ${month} ${year}. at ${hours}:${minutes}`;
}

// --- Main function
export function timeAgo(dateParam) {
   if (!dateParam) {
      return null;
   }

   const date = typeof dateParam === "object" ? dateParam : new Date(dateParam);
   const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
   const today = new Date();
   const yesterday = new Date(today - DAY_IN_MS);
   const seconds = Math.round((today - date) / 1000);
   const minutes = Math.round(seconds / 60);
   const isToday = today.toDateString() === date.toDateString();
   const isYesterday = yesterday.toDateString() === date.toDateString();
   const isThisYear = today.getFullYear() === date.getFullYear();

   if (seconds < 5) {
      return "now";
   } else if (seconds < 60) {
      return `${seconds} seconds ago`;
   } else if (seconds < 90) {
      return "about a minute ago";
   } else if (minutes < 60) {
      return `${minutes} minutes ago`;
   } else if (isToday) {
      return getFormattedDate(date, "Today"); // Today at 10:20
   } else if (isYesterday) {
      return getFormattedDate(date, "Yesterday"); // Yesterday at 10:20
   } else if (isThisYear) {
      return getFormattedDate(date, false, true); // 10. January at 10:20
   }

   return getFormattedDate(date); // 10. January 2017. at 10:20
}

export function getFirstElementByClassName(element, classname) {
   // look for direct parent
   if (element.classList.contains(classname)) {
      return element;
      // if no direct parent found look by classname
   } else if (!element.getElementsByClassName(classname).length == 0) {
      return element.getElementsByClassName(classname)[0];
      //if element have no parent throw error
   } else if (element.parentElement == null) {
      return null;
      // throw `error from helpers.getFirstElementByClassName: where was an error in finding target element – ${classname}`;
   }
   return getFirstElementByClassName(element.parentElement, classname);
}

export function getAttrOrNull(classlist, attr) {
   var current_element = document.querySelector(`.${classlist.shift()}`);

   classlist.forEach((classname) => {
      if (current_element) {
         current_element = current_element.querySelector(`.${classname}`);
      }
   });

   if (current_element) {
      var attribute = current_element.getAttribute(attr);
   }

   var return_value = attribute ? attribute : null;
   return return_value;
}

export function setAttrOrFalse(classlist, name, attr) {
   var current_element = document.querySelector(`.${classlist.shift()}`);

   classlist.forEach((classname) => {
      if (current_element) {
         current_element = current_element.querySelector(`.${classname}`);
      }
   });

   if (current_element) {
      current_element.setAttribute(name, attr);
   }

   var return_value = current_element ? true : false;
   return return_value;
}

// last element in array
export function last(array) {
   return array[array.length - 1];
}

//return absolute position of element
export var getPosition = function (element) {
   var top = 0,
      left = 0;
   do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
   } while (element);

   return {
      top: top,
      left: left,
   };
};

export var getPositions = function (element) {
   var top = 0,
      left = 0;
   var right = window.innerWidth - element.getBoundingClientRect().right;
   do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
   } while (element);

   return {
      top: top,
      left: left,
      right: right,
   };
};

export function addEvent(object, type, callback) {
   if (object == null || typeof object == "undefined") return;
   if (object.addEventListener) {
      object.addEventListener(type, callback, false);
   } else if (object.attachEvent) {
      object.attachEvent("on" + type, callback);
   } else {
      object["on" + type] = callback;
   }
}

export function throttle(func, limit) {
   let inThrottle;
   return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
         func.apply(context, args);
         inThrottle = true;
         setTimeout(() => (inThrottle = false), limit);
      }
   };
}

export function throttleLast(func, limit) {
   let lastFunc;
   let lastRan;
   return function () {
      const context = this;
      const args = arguments;
      if (!lastRan) {
         func.apply(context, args);
         lastRan = Date.now();
      } else {
         clearTimeout(lastFunc);
         lastFunc = setTimeout(function () {
            if (Date.now() - lastRan >= limit) {
               func.apply(context, args);
               lastRan = Date.now();
            }
         }, limit - (Date.now() - lastRan));
      }
   };
}

// ** FADE OUT FUNCTION **
export function fadeOut(el) {
   el.style.opacity = 1;
   (function fade() {
      if ((el.style.opacity -= 0.1) < 0) {
         el.style.display = "none";
      } else {
         requestAnimationFrame(fade);
      }
   })();
}

// ** FADE IN FUNCTION **
export function fadeIn(el, display) {
   el.style.opacity = 0;
   el.style.display = display || "block";
   (function fade() {
      var val = parseFloat(el.style.opacity);
      if (!((val += 0.1) > 1)) {
         el.style.opacity = val;
         requestAnimationFrame(fade);
      }
   })();
}
