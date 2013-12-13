'use strict';

describe('Sign', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  describe('Controller', function () {

    var scope, controller, $location, $locationMock;
    var $$urlMock, userServices;

    // Init controller
    beforeEach(inject(function ($controller, $rootScope, _$location_, _userServices_) {
      var scopeController = $rootScope.$new();
      $controller('MainCtrl', {
        $scope: scopeController});

      $rootScope.initPageTitle = function (title) {
        scopeController.initPageTitle(title);
      };

      scope = $rootScope.$new();
      $location = _$location_;
      userServices = _userServices_;
    }));

    beforeEach(inject(function () {
      $locationMock = {
        $$url: $$urlMock
      };
    }));

    // The main controller test
    describe('Sign Controller Init', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        controller = $controller('SignCtrl', {
          $scope: scope, $location: $locationMock});
      }));

      it('should init variables with the correct values', inject(function () {
        expect(scope.user).toEqual({});
        expect(scope.logInUser).toEqual({});
        expect(scope.$location).toBe($locationMock);
      }));

      it('should Mock the location URL variable', inject(function () {
        expect(scope.$location.$$url).toEqual($locationMock.$$url);
        $locationMock.$$url = '/login';
        expect(scope.$location.$$url).toEqual($locationMock.$$url);
      }));

      it('should init the title page with Sign Up', inject(function () {
        $locationMock.$$url = '/signup';
        expect(scope.$location.$$url).toEqual($locationMock.$$url);
        spyOn(scope, 'initPageTitle');
        expect(scope.initPageTitle).not.toHaveBeenCalled();
        scope.init();
        expect(scope.initPageTitle).toHaveBeenCalledWith('Sign Up');
      }));

      it('should init the title page with Log In', inject(function () {
        $locationMock.$$url = '/login';
        expect(scope.$location.$$url).toEqual($locationMock.$$url);
        spyOn(scope, 'initPageTitle');
        expect(scope.initPageTitle).not.toHaveBeenCalled();
        scope.init();
        expect(scope.initPageTitle).toHaveBeenCalledWith('Log In');
      }));

      it('should init the title page with an empty string', inject(function () {
        $locationMock.$$url = '/';
        expect(scope.$location.$$url).toEqual($locationMock.$$url);
        spyOn(scope, 'initPageTitle');
        expect(scope.initPageTitle).not.toHaveBeenCalled();
        scope.init();
        expect(scope.initPageTitle).toHaveBeenCalledWith();
      }));

      it('should not call the signup method with an undefined form', inject(function () {
        spyOn(userServices, 'signUp');
        expect(userServices.signUp).not.toHaveBeenCalled();
        scope.createUser();
        expect(userServices.signUp).not.toHaveBeenCalled();
      }));

      it('should not call the signup method with an false $valid form', inject(function () {
        spyOn(userServices, 'signUp');
        expect(userServices.signUp).not.toHaveBeenCalled();
        var userForm = {$valid: false};
        scope.createUser(userForm);
        expect(userServices.signUp).not.toHaveBeenCalled();
      }));

      it('should call the signup method the user', inject(function () {
        spyOn(userServices, 'signUp');
        expect(userServices.signUp).not.toHaveBeenCalled();
        var userMock = {user: 'User name'};
        scope.user = userMock;
        var userForm = {$valid: true};
        scope.createUser(userForm);
        expect(userServices.signUp).toHaveBeenCalledWith(userMock);
      }));


      it('should not call the logIn method with an undefined form', inject(function () {
        spyOn(userServices, 'logIn');
        expect(userServices.logIn).not.toHaveBeenCalled();
        scope.logInUserAction();
        expect(userServices.logIn).not.toHaveBeenCalled();
      }));

      it('should not call the logIn method with an false $valid form', inject(function () {
        spyOn(userServices, 'logIn');
        expect(userServices.logIn).not.toHaveBeenCalled();
        var userForm = {$valid: false};
        scope.logInUserAction(userForm);
        expect(userServices.logIn).not.toHaveBeenCalled();
      }));

      it('should call the logIn method the user', inject(function () {
        spyOn(userServices, 'logIn');
        expect(userServices.logIn).not.toHaveBeenCalled();
        var userMock = {user: 'User name'};
        scope.logInUser = userMock;
        var userForm = {$valid: true};
        scope.logInUserAction(userForm);
        expect(userServices.logIn).toHaveBeenCalledWith(userMock);
      }));
    });
  });
});

