'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('septWebRadioApp', 'mockedGetInitApplication'));

  function callDeferred(deferred, scope){
    // Call the
    deferred.resolve();
    scope.$apply();
  }

  // The main controller test
  describe('Main Controller', function () {

    var scope, applicationServicesMock, controller, q, deferred;

    beforeEach(function() {
      applicationServicesMock = {
        getInitApplication: function() {
          deferred = q.defer();
          return deferred.promise;
        }
      };
    });

    // init controller for test
    beforeEach(inject(function($controller, $rootScope, applicationServices, $q){
      scope = $rootScope.$new();
      q = $q;

      spyOn(applicationServicesMock, 'getInitApplication').andCallThrough();

      controller = $controller('MainCtrl', {
        $scope: scope, applicationServices: applicationServicesMock});
    }));

    it('should have the button login set to undefined', inject(function () {
      expect(scope.connexionButtonLabel).toBe(undefined);
    }));

    it('should ', function() {
      expect(scope.connexionButtonLabel).toBe(undefined);
      expect(applicationServicesMock.getInitApplication).toHaveBeenCalled();
      expect(applicationServicesMock.getInitApplication.calls.length).toEqual(1);

      callDeferred(deferred, scope);

      expect(scope.connexionButtonLabel).toBe('Log In');
    });
  });
});