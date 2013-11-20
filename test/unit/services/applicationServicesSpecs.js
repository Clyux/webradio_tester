'use strict';

/* jasmine specs for controllers go here */

describe('Application Services', function () {
  beforeEach(module('septWebRadioApp', 'mockedGetInitApplication'));

  var $httpBackend, $cookieStore, q, scope;

  beforeEach(inject(function ($rootScope, _$httpBackend_, _$cookieStore_, $q) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $cookieStore = _$cookieStore_;
    q = $q;
  }));

  function callDeferred(deferred, scope, resolve) {
    // Call the
    deferred.resolve(resolve);
    scope.$apply();
  }

  describe('applicationServices', function () {

    var applicationServices, soundCloudServices;

    beforeEach(inject(function (_applicationServices_, _soundCloudServices_) {
      applicationServices = _applicationServices_;
      soundCloudServices = _soundCloudServices_;
    }));

    it('should init the variables', inject(function () {
      expect(applicationServices.clientId).toBe('');
      expect(applicationServices.redirectUri).toBe('');

      var token = $cookieStore.get('SC_Token');
      expect(token).toBeUndefined();
    }));


    describe('getInitApplication', function () {
      beforeEach(inject(function (defaultInitJSON) {
        $httpBackend.whenGET('init_application').respond(defaultInitJSON);
      }));

      afterEach(function () {
        $cookieStore.remove('SC_Token');
        $cookieStore.remove('SC_User');
      });

      it('should init values with the values returned by the back-end', inject(function () {
        expect(applicationServices.clientId).toBe('');
        expect(applicationServices.redirectUri).toBe('');

        applicationServices.getInitApplication();

        // Call the back-end
        $httpBackend.flush();

        expect(applicationServices.clientId).toBe('fsfg613gdf54gf31gf1dgfdf');
        expect(applicationServices.redirectUri).toBe('http://localhost:3000/soundcloud/auth/callback');
      }));

      it('should init the Sound Cloud SDK with no token', inject(function () {
        spyOn(SC, 'initialize');

        expect(SC.initialize).not.toHaveBeenCalled();

        applicationServices.getInitApplication();

        expect(SC.initialize).not.toHaveBeenCalled();

        // Call the back-end
        $httpBackend.flush();

        expect(SC.initialize).toHaveBeenCalledWith({
          client_id: 'fsfg613gdf54gf31gf1dgfdf',
          redirect_uri: 'http://localhost:3000/soundcloud/auth/callback',
          access_token: undefined,
          scope: 'non-expiring'
        });
      }));

      it('should init the Sound Cloud SDK with some token', inject(function () {
        spyOn(SC, 'initialize');
        $cookieStore.put('SC_Token', 'myBeautifulToken');

        expect(SC.initialize).not.toHaveBeenCalled();

        applicationServices.getInitApplication();

        expect(SC.initialize).not.toHaveBeenCalled();

        // Call the back-end
        $httpBackend.flush();

        expect(SC.initialize).toHaveBeenCalledWith({
          client_id: 'fsfg613gdf54gf31gf1dgfdf',
          redirect_uri: 'http://localhost:3000/soundcloud/auth/callback',
          access_token: 'myBeautifulToken',
          scope: 'non-expiring'
        });
      }));

      it('should not call the me function', inject(function () {
        spyOn(soundCloudServices, 'me').andCallThrough();
        expect(soundCloudServices.me).not.toHaveBeenCalled();

        applicationServices.getInitApplication();

        expect(soundCloudServices.me).not.toHaveBeenCalled();

        // Call the back-end
        $httpBackend.flush();

        expect(soundCloudServices.me).not.toHaveBeenCalled();
      }));

      it('should call the me function', inject(function () {
        spyOn(soundCloudServices, 'me').andCallThrough();
        $cookieStore.put('SC_Token', 'myBeautifulToken');

        expect(soundCloudServices.me).not.toHaveBeenCalled();

        applicationServices.getInitApplication();

        expect(soundCloudServices.me).not.toHaveBeenCalled();

        // Call the back-end
        $httpBackend.flush();

        expect(soundCloudServices.me).toHaveBeenCalled();
      }));

      it('should return the user when the user is connected', inject(function () {
        var user = {user: 'User Name'};
        var meDefer;
        spyOn(soundCloudServices, 'me').andCallFake(function () {
          meDefer = q.defer();
          return meDefer.promise;
        });

        $cookieStore.put('SC_Token', 'myBeautifulToken');

        var promise = applicationServices.getInitApplication();

        // Call the back-end
        $httpBackend.flush();

        callDeferred(meDefer, scope, user);

        promise.then(function(result){
          expect(result).toBe(user);
        });
      }));

      it('should not be connected', inject(function () {
        expect(applicationServices.isConnected()).toBeFalsy();

        applicationServices.getInitApplication();

        // Call the back-end
        $httpBackend.flush();

        expect(applicationServices.isConnected()).toBeFalsy();
      }));

      it('should be connected', inject(function () {
        spyOn(SC, 'get').andCallFake(function () {
          soundCloudServices.soundCloudUser = {user: 'userName'};
        });
        $cookieStore.put('SC_Token', 'myBeautifulToken');

        expect(applicationServices.isConnected()).toBeFalsy();

        applicationServices.getInitApplication();

        expect(applicationServices.isConnected()).toBeFalsy();

        // Call the back-end
        $httpBackend.flush();

        expect(applicationServices.isConnected()).toBeTruthy();
      }));
    });

    describe('isConnected', function () {
      afterEach(function () {
        soundCloudServices.soundCloudUser = undefined;
      });

      it('should return false', inject(function () {
        soundCloudServices.soundCloudUser = undefined;
        expect(applicationServices.isConnected()).toBeFalsy();
      }));

      it('should return true', inject(function () {
        soundCloudServices.soundCloudUser = {user: 'UserName'};
        expect(applicationServices.isConnected()).toBeTruthy();
      }));
    });


    describe('getConnexionLabel', function () {
      afterEach(function () {
        soundCloudServices.soundCloudUser = undefined;
      });

      it('should return Log In', inject(function () {
        soundCloudServices.soundCloudUser = undefined;
        expect(applicationServices.getConnexionLabel()).toBe('Log In');
      }));

      it('should return Log Out', inject(function () {
        soundCloudServices.soundCloudUser = {user: 'UserName'};
        expect(applicationServices.getConnexionLabel()).toBe('Log Out');
      }));
    });


    describe('logInLogOut', function () {

      afterEach(function () {
        soundCloudServices.soundCloudUser = undefined;
      });

      it('should have call the logIn method', inject(function () {
        spyOn(soundCloudServices, 'logOut').andCallThrough();
        spyOn(soundCloudServices, 'logIn').andCallThrough();

        soundCloudServices.soundCloudUser = undefined;

        expect(soundCloudServices.logOut).not.toHaveBeenCalled();
        expect(soundCloudServices.logIn).not.toHaveBeenCalled();

        applicationServices.logInLogOut();

        expect(soundCloudServices.logOut).not.toHaveBeenCalled();
        expect(soundCloudServices.logIn).toHaveBeenCalled();
      }));

      it('should have call the logOut method', inject(function () {
        spyOn(soundCloudServices, 'logOut').andCallThrough();
        spyOn(soundCloudServices, 'logIn').andCallThrough();

        soundCloudServices.soundCloudUser = {user: 'UserName'};

        expect(soundCloudServices.logOut).not.toHaveBeenCalled();
        expect(soundCloudServices.logIn).not.toHaveBeenCalled();

        applicationServices.logInLogOut();

        expect(soundCloudServices.logOut).toHaveBeenCalled();
        expect(soundCloudServices.logIn).not.toHaveBeenCalled();
      }));


      it('should call the connexion label method when the user is connected', inject(function () {
        spyOn(applicationServices, 'getConnexionLabel').andCallThrough();
        var logOutDefer;

        spyOn(soundCloudServices, 'logOut').andCallFake(function () {
          logOutDefer = q.defer();
          return logOutDefer.promise;
        });

        soundCloudServices.soundCloudUser = {user: 'UserName'};

        expect(applicationServices.getConnexionLabel).not.toHaveBeenCalled();
        expect(soundCloudServices.logOut).not.toHaveBeenCalled();

        applicationServices.logInLogOut();

        expect(applicationServices.getConnexionLabel).not.toHaveBeenCalled();
        expect(soundCloudServices.logOut).toHaveBeenCalled();

        callDeferred(logOutDefer, scope);

        expect(applicationServices.getConnexionLabel).toHaveBeenCalled();
      }));

      it('should call the connexion label method when the user is not connected', inject(function () {
        spyOn(applicationServices, 'getConnexionLabel').andCallThrough();
        var logInDefer;

        spyOn(soundCloudServices, 'logIn').andCallFake(function () {
          logInDefer = q.defer();
          return logInDefer.promise;
        });

        soundCloudServices.soundCloudUser = undefined;

        expect(applicationServices.getConnexionLabel).not.toHaveBeenCalled();
        expect(soundCloudServices.logIn).not.toHaveBeenCalled();

        applicationServices.logInLogOut();

        expect(applicationServices.getConnexionLabel).not.toHaveBeenCalled();
        expect(soundCloudServices.logIn).toHaveBeenCalled();

        callDeferred(logInDefer, scope);

        expect(applicationServices.getConnexionLabel).toHaveBeenCalled();
      }));
    });
  });
});