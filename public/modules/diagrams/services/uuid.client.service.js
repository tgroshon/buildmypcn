'use strict';

angular.module('diagrams').factory('uuid', [
  function () {
    return {
      generate: function () {
        var time = new Date().getTime();
        var sixteen = 16;
        return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (match) {
          var remainder = (time + sixteen * Math.random()) % sixteen | 0;
          time = Math.floor(time / sixteen);
          return (match == "x" ? remainder : remainder & 7 | 8).toString(sixteen);
        });
      }
    }
  }
]);
