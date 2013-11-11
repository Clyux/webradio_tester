'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('septWebRadioApp', 'mockedGetInitApplication'));


  // The main controller test
  describe('Main Controller', function () {

    var scope, mainCtrl, $httpBackend;

    beforeEach(inject(function (_$httpBackend_, $rootScope, $controller, defaultInitJSON) {
      $httpBackend = _$httpBackend_;

      scope = $rootScope.$new();
      mainCtrl = $controller('MainCtrl', {$scope: scope});
    }));

    it('should have the button login set to Log In', inject(function () {
      expect(scope.connexionButtonLabel).toBe('Log In');
    }));


    it('should init all session variables to null', inject(function () {
      expect(scope.deezerSession).toBeUndefined();
      expect(scope.deezerUser).toBeUndefined();
    }));


    it('should init all the string variables to empty', inject(function () {
      expect(scope.appId).toBe('');
      expect(scope.channelUrl).toBe('');
    }));


    /* Test the method DZ.init of the deezer API */
    describe('Main Controller DZ init', function () {

      beforeEach(inject(function (defaultInitJSON) {
        $httpBackend.whenGET('init_application').respond(defaultInitJSON);

        // Just Spy the init method
        spyOn(DZ, 'init');
      }));


      it('should set appId and channel Url', inject(function () {
        expect(scope.appId).toBe('');
        expect(scope.channelUrl).toBe('');

        // Call the back-end
        $httpBackend.flush();

        expect(scope.appId).toBe('123456');
        expect(scope.channelUrl).toBe('http://localhost/deezer/get_channel');
      }));


      it('should call DZ.init', inject(function () {
        expect(DZ.init).not.toHaveBeenCalled();

        // Call the back-end
        $httpBackend.flush();

        expect(DZ.init).toHaveBeenCalledWith({
          appId: '123456',
          channelUrl: 'http://localhost/deezer/get_channel'
        });
      }));


      /* Test the method DZ.getLoginStatus of the deezer API for a non connected user */
      describe('Main Controller DZ getLoginStatus Not Connected', function () {

        beforeEach(inject(function (defaultDeezerJSONs) {
          // Fake the call of the method getLoginStatus
          spyOn(DZ, 'getLoginStatus').andCallFake(function() {
            return defaultDeezerJSONs.notConnectedUserJSON;
          });
        }));


        it('should set the sessions to undefined when the user is not connected', inject(function () {
          expect(scope.deezerSession).toBeUndefined();
          expect(scope.deezerUser).toBeUndefined();

          // Call the back-end
          $httpBackend.flush();

          expect(scope.deezerSession).toBeUndefined();
          expect(scope.deezerUser).toBeUndefined();
        }));


        it('should call the getLoginStatus method', inject(function () {
          expect(DZ.getLoginStatus).not.toHaveBeenCalled();

          // Call the back-end
          $httpBackend.flush();

          expect(DZ.getLoginStatus).toHaveBeenCalled();
        }));
      });
    });
  });
});