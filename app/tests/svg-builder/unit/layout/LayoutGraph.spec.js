/* jshint expr: true */
'use strict';

var should = require('should');
var spyquire = require('spyquire');
var LayoutNode = require('../../../../lib/svg-builder/layout/LayoutNode');
var constants = require('../../../../lib/svg-builder/constants');

var spies = spyquire('../../../../lib/svg-builder/layout/LayoutGraph')
  .with('./mutations/mutate-initial-layout').nick('mutInit')
  .with('./mutations/mutate-adjust-layout-for-relations').nick('mutAdjust')
  .with('./lookup-region').nick('lookupRegion');

var LayoutGraph = spies.exec();

describe('LayoutGraph Specs', function() {
  var pcn;
  var step = {
    'id': 'GUID_3456',
    'title': 'travel to restaurant',
    'type': 'process',
    'domain': {
      'id': 'GUID_2345',
      'region': {
        'type': 'independent',
        'with_domain': ''
      }
    }
  };

  beforeEach(function() { 
    pcn = {
      domains:[
        {title: 'Provider'},
        {title: 'Consumer'}
      ],
      steps: []
    };
  });

  describe('Constructor', function() {

		it('takes one argument', function() {
      LayoutGraph.length.should.eql(1);
		});

    it('stores domains', function() {
      var graph = new LayoutGraph(pcn);
      graph.provider.should.eql(pcn.domains[0]);
      graph.consumer.should.eql(pcn.domains[1]);
    });

    it('allocates array of 7 region arrays', function() {
      var graph = new LayoutGraph(pcn);
      graph.region.length.should.eql(7);
      graph.region.forEach(function(reg) {
        reg.should.be.an.Array;
      });
    });

    it('allocates empty nodeStore object if no steps', function() {
      var graph = new LayoutGraph(pcn);
      graph.nodeStore.should.be.an.Object;
      graph.nodeStore.should.be.empty;
    });

    it('creates LayoutNodes and stores them for each step', function() {
      spies.at('lookupRegion').returns = 1;
      pcn.steps.push(step);
      var graph = new LayoutGraph(pcn);
      var node = graph.region[1][0]; 
      node.should.be.instanceOf(LayoutNode);
      node.id.should.eql(step.id);
      spies.at('lookupRegion').called.should.be.true;
    });

    it('calls mutate functions', function() {
      var graph = new LayoutGraph(pcn);
      spies.at('mutInit').called.should.be.true;
      spies.at('mutAdjust').called.should.be.true;
    });
  });

  describe('Prototype Function', function() {

    describe('addNode', function() {
      it('add row to node object', function() {
        var node = {id: 'fakeId', region: 1};
        var graph = new LayoutGraph(pcn);
        graph.addNode(node);
        node.should.have.property('row', 0);
      });

      it('adds node to store and region array', function() {
        var node = {id: 'fakeId', region: 1};
        var graph = new LayoutGraph(pcn);
        graph.addNode(node);
        graph.nodeStore[node.id].should.eql(node);
        graph.region[node.region][node.row].should.eql(node);
      });
    });

    describe('maxRows', function() {
      it('takes no arguments', function() {
        var graph = new LayoutGraph(pcn);
        graph.maxRows.length.should.eql(0);
      });

      it('returns the length of the longest column', function() {
        spies.at('lookupRegion').returns = 3;
        pcn.steps.push(step);
        pcn.steps.push(step);
        pcn.steps.push(step);
        var graph = new LayoutGraph(pcn);
        graph.region[1].push({});
        graph.maxRows().should.eql(3);
      });
    });

    describe('getBottomY', function() {
      it('gets bottom Y position', function() {
        var greatestY = 575;
        var graph = new LayoutGraph(pcn);
        graph.nodeStore.fakeId1 = {y: 10};
        graph.nodeStore.fakeId2 = {y: greatestY};
        graph.getBottomY().should.eql(greatestY + constants.STEP_HEIGHT + constants.ROW_SPACE);
      });
    });
  });
});
