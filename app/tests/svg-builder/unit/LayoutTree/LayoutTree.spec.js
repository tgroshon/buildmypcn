'use strict';

var should = require('should');
var spyquire = require('spyquire');
var pcnFixture = require('../../../../fixtures/pcn.json');
var LayoutNode = require('../../../../lib/svg-builder/LayoutTree/LayoutNode');
var constants = require('../../../../lib/svg-builder/constants');

var spies = spyquire('../../../../lib/svg-builder/LayoutTree/index')
  .with('./mutations/mutate-initial-layout').nick('mutInit')
  .with('./mutations/mutate-adjust-layout-for-relations').nick('mutAdjust')
  .with('../helpers', 'lookupRegion').nick('lookupRegion');

var LayoutTree = spies.exec();

describe('LayoutTree Specs', function() {
  var pcn;
  var step = {
    "id": "GUID_3456",
    "title": "travel to restaurant",
    "type": "process",
    "domain": {
      "id": "GUID_2345",
      "region": {
        "type": "independent",
        "with_domain": ""
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
      LayoutTree.length.should.eql(1);
		});

    it('stores domains', function() {
      var tree = new LayoutTree(pcn);
      tree.provider.should.eql(pcn.domains[0]);
      tree.consumer.should.eql(pcn.domains[1]);
    });

    it('allocates array of 7 region arrays', function() {
      var tree = new LayoutTree(pcn);
      tree.region.length.should.eql(7);
      tree.region.forEach(function(reg) {
        reg.should.be.an.Array;
      });
    });

    it('allocates empty nodeStore object if no steps', function() {
      var tree = new LayoutTree(pcn);
      tree.nodeStore.should.be.an.Object;
      tree.nodeStore.should.be.empty;
    });

    it('creates LayoutNodes and stores them for each step', function() {
      spies.at('lookupRegion').returns = 1;
      pcn.steps.push(step);
      var tree = new LayoutTree(pcn);
      var node = tree.region[1][0]; 
      node.should.be.instanceOf(LayoutNode);
      node.id.should.eql(step.id);
      spies.at('lookupRegion').called.should.be.true;
    });

    it('calls mutate functions', function() {
      var tree = new LayoutTree(pcn);
      spies.at('mutInit').called.should.be.true;
      spies.at('mutAdjust').called.should.be.true;
    });
  });

  describe('Prototype Function', function() {

    describe('addNode', function() {
      it('add row to node object', function() {
        var node = {id: 'fakeId', region: 1};
        var tree = new LayoutTree(pcn);
        tree.addNode(node);
        node.should.have.property('row', 0);
      });

      it('adds node to store and region array', function() {
        var node = {id: 'fakeId', region: 1};
        var tree = new LayoutTree(pcn);
        tree.addNode(node);
        tree.nodeStore[node.id].should.eql(node);
        tree.region[node.region][node.row].should.eql(node);
      });
    });

    describe('maxRows', function() {
      it('takes no arguments', function() {
        var tree = new LayoutTree(pcn);
        tree.maxRows.length.should.eql(0);
      });

      it('returns the length of the longest column', function() {
        spies.at('lookupRegion').returns = 3;
        pcn.steps.push(step);
        pcn.steps.push(step);
        pcn.steps.push(step);
        var tree = new LayoutTree(pcn);
        tree.region[1].push({});
        tree.maxRows().should.eql(3);
      });
    });

    describe('getBottomY', function() {
      it('gets bottom Y position', function() {
        var greatestY = 575;
        var tree = new LayoutTree(pcn);
        tree.nodeStore['fakeId1'] = {y: 10};
        tree.nodeStore['fakeId2'] = {y: greatestY};
        tree.getBottomY().should.eql(greatestY + constants.STEP_HEIGHT + constants.ROW_SPACE);
      });
    });
  });
})
