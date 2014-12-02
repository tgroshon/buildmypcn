'use strict';

// Diagrams filters
angular.module('diagrams').filter('domainTitle', function() {
    return function(domain) {
        return domain.title || domain.subtitle || 'Unknown domain';
    };
});
