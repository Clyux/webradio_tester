'use strict';

describe('Sign', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  describe('Controller', function () {

    var scope, controller, page, $location;

    // Init controller
    beforeEach(inject(function ($rootScope, _Page_, _$location_) {
      scope = $rootScope.$new();
      page = _Page_;
      $location = _$location_;
    }));

    // The main controller test
    describe('Sign Controller Init', function () {

      var $$url;

      // init controller for test
      beforeEach(inject(function ($controller) {
        spyOn(page, 'setTitle').andCallThrough();

        controller = $controller('SignCtrl', {
          $scope: scope});

        $$url = jasmine.createSpy(scope.$location.$$url);
      }));

      it('should init variables with the correct values', inject(function () {
        expect(scope.user).toEqual({});
        expect(scope.logInUser).toEqual({});
        expect(scope.$location).toBe($location);
      }));
    });
  });
});

