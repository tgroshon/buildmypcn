'use strict';

angular.module('diagrams').factory('PCN', ['uuid',
	function (uuid) {
		return {
      CONSTANTS: {
        'PREDECESSOR_TYPES': {
          NORMAL: 'normal_relationship',
          LOOSE: 'loose_temporal_relationship'
        },
        'CONNECTOR': {
          INDEPENDENT: '',
          SURROGATE: '',
          'DIRECT_LEADING': 'direct_leading',
          'DIRECT_SHARED': 'direct_shared'
        }
      },

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

      initPredecessor: function (id, type, title) {
        return {
          "id": id,
          "type": type,
          "title": title 
        }
      },

      initStepDomain: function (owner, type, related) {
        if (!owner) owner = {};
        if (!related) related = {};

        return {
          id: owner.id,
          region: {
            type: type,
            'with_domain': related.id 
          }
        }
      },

      initDomain: function (title, subtitle) {
        return {
          'id': uuid.generate(),
          'title': title,
          'subtitle': subtitle
        }
      }
    };
  }
]);
