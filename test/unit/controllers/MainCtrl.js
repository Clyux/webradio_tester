'use strict';

/* jasmine specs for controllers go here */

describe('Main', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  function callDeferred(deferred, scope, resolve) {
    // Call the
    deferred.resolve(resolve);
    scope.$apply();
  }

  // The main controller test
  describe('Controller', function () {

    var scope, applicationServicesMock, controller, q, initAppDeferred, isConnected, applicationServices;
    var logInDeferred;

    beforeEach(function () {
      applicationServicesMock = {
        getInitApplication: function () {
          initAppDeferred = q.defer();
          return initAppDeferred.promise;
        },
        getConnexionLabel: function () {
          if (isConnected) {
            return 'Log Out';
          } else {
            return 'Log In';
          }
        },
        logInLogOut: function () {
          logInDeferred = q.defer();
          return logInDeferred.promise;
        }
      };
    });

    // init controller for test
    beforeEach(inject(function ($rootScope, _applicationServices_, $q) {
      scope = $rootScope.$new();
      q = $q;
      applicationServices = _applicationServices_;
    }));

    afterEach(function () {
      isConnected = false;
    });

    it('should have the button login set to undefined', inject(function () {
      expect(scope.connexionButtonLabel).toBeUndefined();
    }));

    // The main controller test
    describe('Main Controller test Init App', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        spyOn(applicationServicesMock, 'getInitApplication').andCallThrough();

        controller = $controller('MainCtrl', {
          $scope: scope, applicationServices: applicationServicesMock});
      }));


      it('should Init the app and set the label to Log In when the user is not connected', function () {
        expect(scope.connexionButtonLabel).toBeUndefined();
        expect(applicationServicesMock.getInitApplication).toHaveBeenCalled();
        expect(applicationServicesMock.getInitApplication.calls.length).toEqual(1);

        callDeferred(initAppDeferred, scope);

        expect(scope.connexionButtonLabel).toBe('Log In');
        expect(applicationServicesMock.getInitApplication.calls.length).toEqual(1);
      });

      it('should Init the app and set the label to Log Out when the user is connected', function () {
        expect(scope.connexionButtonLabel).toBeUndefined();
        expect(applicationServicesMock.getInitApplication).toHaveBeenCalled();
        expect(applicationServicesMock.getInitApplication.calls.length).toEqual(1);

        isConnected = true;

        callDeferred(initAppDeferred, scope);

        expect(scope.connexionButtonLabel).toBe('Log Out');
        expect(applicationServicesMock.getInitApplication.calls.length).toEqual(1);
      });


      it('should set the user to undefined when the user is not connected', function () {
        expect(scope.user).toBeUndefined();

        callDeferred(initAppDeferred, scope);

        expect(scope.user).toBeUndefined();
      });

      it('should set the user to an object when the user is connected', function () {
        expect(scope.user).toBeUndefined();

        isConnected = true;
        var userData = {user:'user name'};

        callDeferred(initAppDeferred, scope, userData);

        expect(scope.user).toBe(userData);
      });
    });


    // The main controller test
    describe('Main Controller test logInLogOut', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        spyOn(applicationServicesMock, 'logInLogOut').andCallThrough();

        controller = $controller('MainCtrl', {
          $scope: scope, applicationServices: applicationServicesMock});
      }));


      it('should set the correct label when call logInLogOutClick', function () {
        spyOn(scope, 'logInLogOutClick').andCallThrough();
        expect(scope.logInLogOutClick).not.toHaveBeenCalled();
        expect(scope.connexionButtonLabel).toBeUndefined();

        scope.logInLogOutClick();

        expect(scope.connexionButtonLabel).toBeUndefined();

        callDeferred(logInDeferred, scope, 'Log In');

        expect(scope.logInLogOutClick).toHaveBeenCalled();
        expect(scope.connexionButtonLabel).toBe('Log In');
      });

      it('should call the correct log in function when call logInLogOut', function () {
        expect(applicationServicesMock.logInLogOut).not.toHaveBeenCalled();

        scope.logInLogOutClick();

        expect(applicationServicesMock.logInLogOut).toHaveBeenCalled();

        callDeferred(logInDeferred, scope, 'Log In');

        expect(scope.connexionButtonLabel).toBe('Log In');
      });
    });
  });
});

