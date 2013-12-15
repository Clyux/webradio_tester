'use strict';

describe('Main', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  function callDeferred(deferred, scope, resolve) {
    // Resolve the promise
    deferred.resolve(resolve);
    scope.$apply();
  }

  // The main controller test
  describe('Controller', function () {

    var scope, applicationServicesMock, controller, q, initAppDeferred, isConnected, applicationServices;
    var logInDeferred, page, userServices, $location, $rootScope;

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
    beforeEach(inject(function (_$rootScope_, _applicationServices_, $q, _Page_, _userServices_, _$location_) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      page = _Page_;
      userServices = _userServices_;
      $location = _$location_;
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
    describe('Main Controller Init App', function () {

      var userMock;

      // init controller for test
      beforeEach(inject(function ($controller) {
        spyOn(applicationServicesMock, 'getInitApplication').andCallThrough();

        userMock = {user: 'test'};
        spyOn(userServices, 'getUser').andCallFake(function () {
          return userMock;
        });

        controller = $controller('MainCtrl', {
          $scope: scope, applicationServices: applicationServicesMock});
      }));


      it('should init variables with the correct values', inject(function () {
        expect(scope.Page).toBe(page);
        expect(scope.userServices).toBe(userServices);
        expect(scope.user).toBe(userMock);
      }));

      it('should Init the app and set the label to Log In when the user is not connected', function () {
        expect(scope.connexionButtonLabel).toBeUndefined();
        expect(applicationServicesMock.getInitApplication).not.toHaveBeenCalled();

        scope.init();

        callDeferred(initAppDeferred, scope);

        expect(scope.connexionButtonLabel).toBe('Log In');
        expect(applicationServicesMock.getInitApplication.calls.length).toEqual(1);
      });

      it('should Init the app and set the label to Log Out when the user is connected', function () {
        expect(scope.connexionButtonLabel).toBeUndefined();
        expect(applicationServicesMock.getInitApplication).not.toHaveBeenCalled();

        isConnected = true;

        scope.init();

        callDeferred(initAppDeferred, scope);

        expect(scope.connexionButtonLabel).toBe('Log Out');
        expect(applicationServicesMock.getInitApplication.calls.length).toEqual(1);
      });

      it('should init the userServices', function () {
        spyOn(userServices, 'init');
        scope.init();
        expect(userServices.init.calls.length).toEqual(1);
        expect(userServices.init).toHaveBeenCalled();
      });
    });


    // The main controller
    describe('Main Controller logInLogOut', function () {

      // Init controller for test
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


    // The main controller test
    describe('Main Controller Scope Functions', function () {

      var userMock;

      // init controller for test
      beforeEach(inject(function ($controller) {
        controller = $controller('MainCtrl', {
          $scope: scope, applicationServices: applicationServicesMock});
      }));

      it('should call the location.path with the index page', function () {
        spyOn($location, 'path');
        expect($location.path).not.toHaveBeenCalled();
        scope.go();
        expect($location.path.calls.length).toEqual(1);
        expect($location.path).toHaveBeenCalled();
      });

      it('should call the location.path page provided', function () {
        spyOn($location, 'path');
        expect($location.path).not.toHaveBeenCalled();
        var path = '/login';
        scope.go(path);
        expect($location.path.calls.length).toEqual(1);
        expect($location.path).toHaveBeenCalledWith(path);
      });

      it('should set the correct location path', function () {
        $location.path('/new/path');
        $rootScope.$apply();
        expect($location.path()).toBe('/new/path');

        var path = '/login';
        scope.go(path);

        expect($location.path()).toBe(path);
      });

      it('should call the userServices logOut method', function () {
        spyOn(userServices, 'logOut');
        expect(userServices.logOut).not.toHaveBeenCalled();
        scope.logOutClick();
        expect(userServices.logOut.calls.length).toEqual(1);
        expect(userServices.logOut).toHaveBeenCalled();
      });
    });
  });
});

