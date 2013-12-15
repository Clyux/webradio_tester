'use strict';

describe('user Services', function () {
  beforeEach(module('septWebRadioApp', 'mockedUserServices'));

  var $httpBackend, scope, $window, $location, growl, userServices;
  var userMock = {_id: '12', user: 'User', username: 'User name'};

  beforeEach(inject(function ($rootScope, _$httpBackend_, _$window_, _$location_, _growl_, _userServices_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $window = _$window_;
    $location = _$location_;
    growl = _growl_;
    userServices = _userServices_;
  }));

  function callDeferred(deferred, scope, resolve) {
    // Resolve the promise
    deferred.resolve(resolve);
    scope.$apply();
  }

  describe('init', function () {
    it('should init the user', inject(function () {
      expect(userServices.user).toBeUndefined();
    }));

    it('should init the user with the window one', inject(function () {

      $window.windowsUser = JSON.stringify(userMock);
      userServices.init();
      expect(userServices.user).toEqual(userMock);
    }));

    it('should init the user with undefined when there is an exception', inject(function () {
      $window.windowsUser = '<error></error>';
      userServices.init();
      expect(userServices.user).toBeUndefined();
    }));

    it('should init the user with undefined when the user is null', inject(function () {
      $window.windowsUser = 'null';
      userServices.init();
      expect(userServices.user).toBeUndefined();
    }));
  });


  describe('getUser', function () {
    it('should return the user', inject(function () {
      userServices.user = userMock;
      var user = userServices.getUser();
      expect(user).toBe(userMock);
    }));
  });


  describe('isConnected', function () {
    it('should return true', inject(function () {
      userServices.user = userMock;
      var isConnected = userServices.isConnected();
      expect(isConnected).toBeTruthy();
    }));

    it('should return false', inject(function () {
      userServices.user = undefined;
      var isConnected = userServices.isConnected();
      expect(isConnected).toBeFalsy();
    }));
  });


  describe('getName', function () {
    it('should return the user name', inject(function () {
      userServices.user = userMock;
      var name = userServices.getName();
      expect(name).toBe('User name');
    }));

    it('should return an empty string', inject(function () {
      userServices.user = undefined;
      var name = userServices.getName();
      expect(name).toBe('');
    }));
  });


  describe('signUp', function () {

    function createMockService(user, response){
      $httpBackend
        .expectPOST('/users', user)
        .respond(200, response);
    }

    it('should set the user, the path and call growl', inject(function () {
      spyOn(growl, 'addSuccessMessage');
      spyOn($location, 'path');
      createMockService(userMock, {user: userMock});
      userServices.signUp(userMock);
      $httpBackend.flush();

      expect(userServices.user).toEqual(userMock);
      expect($location.path).toHaveBeenCalledWith('/stage');
      expect(growl.addSuccessMessage).toHaveBeenCalledWith('Account successfully created!');
    }));

    it('should set the user to undefined and call growl when there is an error', inject(function () {
      spyOn(growl, 'addErrorMessage');
      createMockService(userMock, {error: {errorCode: 11000}});
      userServices.signUp(userMock);
      $httpBackend.flush();

      expect(userServices.user).toBeUndefined();
      expect(growl.addErrorMessage).toHaveBeenCalledWith('The username or email is not available!');
    }));

    it('should set the user to undefined and call growl with an other error appears', inject(function () {
      spyOn(growl, 'addErrorMessage');
      createMockService(userMock, {error: {errorCode: 11001}});
      userServices.signUp(userMock);
      $httpBackend.flush();

      expect(userServices.user).toBeUndefined();
      expect(growl.addErrorMessage).toHaveBeenCalledWith('Error when Sign Up!');
    }));
  });


  describe('logIn', function () {

    function createMockService(user, response){
      $httpBackend
        .expectPOST('/users/session', user)
        .respond(200, response);
    }

    it('should set the user, the path and call growl', inject(function () {
      spyOn(growl, 'addSuccessMessage');
      spyOn($location, 'path');
      createMockService(userMock, {user: userMock});
      userServices.logIn(userMock);
      $httpBackend.flush();

      expect(userServices.user).toEqual(userMock);
      expect($location.path).toHaveBeenCalledWith('/stage');
      expect(growl.addSuccessMessage).toHaveBeenCalledWith('Successfully connected!');
    }));

    it('should set the user to undefined and call growl when there is an error', inject(function () {
      spyOn(growl, 'addErrorMessage');
      createMockService(userMock, {error: {message: 'Bim'}});
      userServices.logIn(userMock);
      $httpBackend.flush();

      expect(userServices.user).toBeUndefined();
      expect(growl.addErrorMessage).toHaveBeenCalledWith('Error when connecting: Bim');
    }));
  });


  describe('logOut', function () {

    function createMockService(response){
      $httpBackend
        .expectGET('/signout')
        .respond(200, response);
    }

    it('should set the user to undefined and call growl', inject(function () {
      spyOn(growl, 'addSuccessMessage');
      spyOn($location, 'path');
      createMockService(userMock, {user: userMock});
      userServices.logOut();
      $httpBackend.flush();

      expect(userServices.user).toBeUndefined();
      expect(growl.addSuccessMessage).toHaveBeenCalledWith('Successfully disconnected!');
    }));
  });
});