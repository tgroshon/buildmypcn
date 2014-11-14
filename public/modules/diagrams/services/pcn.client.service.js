'use strict';

angular.module('diagrams').factory('PCN', ['uuid',
	function (uuid) {
		return {
      initPCN: function (title, description, author) {
        return {
          'metadata': {
            'title': title,
            'description': description,
            'author': author
          },
          'domains':[],
          'steps':[]
	};
      },

      initStep: function (domain, title, type, relatedDomain) {
        // type = 'independent' | 'surrogate' | 'direct'
        if (!domain) throw new Error('Bad caller: required domain');

        var step = {
          'id': uuid.generate(),
          'title': title,
          'type': 'process',
          'emphasized': false,
          'value_specific': 0,
          'value_generic': 0,
          'predecessors': [],
          'domain': {
            'id': domain.id,
            'region': {
              'type': type,
            },
          },
          'problems': []
		};

        if (relatedDomain)
          step.domain.region.with_domain = relatedDomain.id;

        return step;
      },

      initDomain: function (title, subtitle) {
        return {
          'id': uuid.generate(),
          'title': title,
          'subtitle': subtitle
		};
      }
    };
  }
]);
