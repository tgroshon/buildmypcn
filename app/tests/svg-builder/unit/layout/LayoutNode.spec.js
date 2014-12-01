'use strict';

var should = require('should');
var pcnFixture = require('../../../../fixtures/pcn.json');
var constants = require('../../../../lib/svg-builder/constants');
var LayoutNode = require('../../../../lib/svg-builder/layout/LayoutNode');

describe('LayoutNode', function() {

  var step;
  beforeEach(function() {
    step = {
      id: 'fakeId',
      title: 'Some Title',
      predecessors: ['Some preds'],
      type: 'process'
    };
  });

  describe('constructor', function() {
    
    it('takes two arguments', function() {
      LayoutNode.length.should.eql(2);
    });

    describe('From Step arg', function() {

      it('assigns step.id to id', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('id', step.id); 
      });

      it('assigns step.title to title', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('title', step.title); 
      });

      it('assigns step.type to type', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('type', step.type); 
      });

      it('assigns step.predecessors to predecessors', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('predecessors', step.predecessors); 
      });

      it('assigns step.predecessors to predecessors', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('predecessors', step.predecessors); 
      });
    });

    describe('From region arg', function() {

      it('assigns to region', function() {
        var region = 1;
        var node = new LayoutNode(step, region);
        node.should.have.property('region', region);
      });
    });

    describe('misc initial properties', function() {
      
      it('sets row to 0', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('row', 0);
      });

      it('sets x to null', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('x', null);
      });

      it('sets y to null', function() {
        var node = new LayoutNode(step, 1);
        node.should.have.property('y', null);
      });

    });
  });
});
