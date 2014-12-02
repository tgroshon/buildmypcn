'use strict';

// Diagrams filters
angular.module('diagrams').filter('groupTitle', function() {
    return function(group) {
        return group.title || group.subtitle || 'Unknown group';
    };
});
