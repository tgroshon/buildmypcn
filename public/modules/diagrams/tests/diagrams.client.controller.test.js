'use strict';

(function() {
	// Diagrams Controller Spec
	describe('Diagrams Controller Tests', function() {
		// Initialize global variables
		var DiagramsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Diagrams controller.
			DiagramsController = $controller('DiagramsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Diagram object fetched from XHR', inject(function(Diagrams) {
			// Create sample Diagram using the Diagrams service
			var sampleDiagram = new Diagrams({
				name: 'New Diagram'
			});

			// Create a sample Diagrams array that includes the new Diagram
			var sampleDiagrams = [sampleDiagram];

			// Set GET response
			$httpBackend.expectGET('diagrams').respond(sampleDiagrams);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.diagrams).toEqualData(sampleDiagrams);
		}));

		it('$scope.findOne() should create an array with one Diagram object fetched from XHR using a diagramId URL parameter', inject(function(Diagrams) {
			// Define a sample Diagram object
			var sampleDiagram = new Diagrams({
				name: 'New Diagram'
			});

			// Set the URL parameter
			$stateParams.diagramId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/diagrams\/([0-9a-fA-F]{24})$/).respond(sampleDiagram);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.diagram).toEqualData(sampleDiagram);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Diagrams) {
			// Create a sample Diagram object
			var sampleDiagramPostData = new Diagrams({
				name: 'New Diagram'
			});

			// Create a sample Diagram response
			var sampleDiagramResponse = new Diagrams({
				_id: '525cf20451979dea2c000001',
				name: 'New Diagram'
			});

			// Fixture mock form input values
			scope.name = 'New Diagram';

			// Set POST response
			$httpBackend.expectPOST('diagrams', sampleDiagramPostData).respond(sampleDiagramResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Diagram was created
			expect($location.path()).toBe('/diagrams/' + sampleDiagramResponse._id);
		}));

		it('$scope.update() should update a valid Diagram', inject(function(Diagrams) {
			// Define a sample Diagram put data
			var sampleDiagramPutData = new Diagrams({
				_id: '525cf20451979dea2c000001',
				name: 'New Diagram'
			});

			// Mock Diagram in scope
			scope.diagram = sampleDiagramPutData;

			// Set PUT response
			$httpBackend.expectPUT(/diagrams\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/diagrams/' + sampleDiagramPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid diagramId and remove the Diagram from the scope', inject(function(Diagrams) {
			// Create new Diagram object
			var sampleDiagram = new Diagrams({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Diagrams array and include the Diagram
			scope.diagrams = [sampleDiagram];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/diagrams\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleDiagram);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.diagrams.length).toBe(0);
		}));
	});
}());