'use strict';

describe('Index', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  describe('Controller', function () {

    var scope, controller, playlistServices;

    // Init controller
    beforeEach(inject(function ($rootScope, $controller, _playlistServices_) {
      var scopeController = $rootScope.$new();
      $controller('MainCtrl', {
        $scope: scopeController});

      $rootScope.initPageTitle = function (title) {
        scopeController.initPageTitle(title);
      };

      scope = $rootScope.$new();
      playlistServices = _playlistServices_;
    }));

    // The main controller test
    describe('Index Controller Init', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        controller = $controller('IndexCtrl', {
          $scope: scope});
      }));

      it('should init the title page', inject(function () {
        spyOn(scope, 'initPageTitle');
        expect(scope.initPageTitle).not.toHaveBeenCalled();
        scope.init();
        expect(scope.initPageTitle).toHaveBeenCalledWith();
      }));

      it('should call the getFeaturedPlaylists method', inject(function () {
        spyOn(playlistServices, 'getFeaturedPlaylists');
        expect(playlistServices.getFeaturedPlaylists).not.toHaveBeenCalled();
        scope.init();
        expect(playlistServices.getFeaturedPlaylists).toHaveBeenCalledWith();
      }));
    });
  });
});

