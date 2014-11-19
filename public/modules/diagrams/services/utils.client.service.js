'use strict';

angular.module('diagrams').factory('utils', [
  function () {
    return {
      createElement: function(name, attrs) {
        var element = document.createElementNS('http://www.w3.org/2000/svg', name);

        if (!attrs) return element;

        Object.keys(attrs).forEach(function (key) {
          element.setAttributeNS(null, key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase(), attrs[key].toString());
        });
        return element;
      },

      shallowClone: function(arr) {
        return arr.slice(0);
      },

      find: function(arr, cond) {
        if (!Array.isArray(arr))
          throw new Error('First argument must be an array');

        if (typeof cond !== 'function')
          throw new Error('Second argument must be a function');

        for (var i = 0; i < arr.length; i++) {
          if (cond(arr[i])) return arr[i];
        }

        return null;
      },

      findAndRemove: function(arr, cond) {
        if (!Array.isArray(arr))
          throw new Error('First argument must be an array');

        if (typeof cond !== 'function')
          throw new Error('Second argument must be a function');

        for (var i = 0; i < arr.length; i++) {
          if (cond(arr[i])) return arr.splice(i, 1).pop();
        }

        return null;
      }
    };
  }
]);
