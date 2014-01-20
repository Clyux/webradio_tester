'use strict';

describe('Playlists', function () {
  beforeEach(module('septWebRadioApp'));

  function callDeferred(deferred, scope, resolve) {
    // Resolve the promise
    deferred.resolve(resolve);
    scope.$apply();
  }

  // The playlists controller test
  describe('Controller', function () {

    var scope, controller, q, $timeout;
    var userServices, $rootScope, $routeParams, playlistServices, soundCloudServices;

    var playlistsMock = [
      {id: 1},
      {id: 2},
      {id: 3}
    ];

    // init controller for test
    beforeEach(inject(function (_$rootScope_, _$routeParams_, _playlistServices_, $q, _userServices_, _soundCloudServices_, $injector) {
      $rootScope = _$rootScope_;
      scope = $rootScope.$new();
      $routeParams = _$routeParams_;
      playlistServices = _playlistServices_;
      userServices = _userServices_;
      soundCloudServices = _soundCloudServices_;
      q = $q;
      $timeout = $injector.get('$timeout');
    }));

    beforeEach(inject(function ($controller) {
      controller = $controller('PlaylistsCtrl', {
        $scope: scope});
    }));


    // The init method
    describe('init', function () {
      // init controller for test
      beforeEach(inject(function () {
        $rootScope.initPageTitle = function (title) {
          scopeController.initPageTitle(title);
        };
        spyOn(scope, 'initPageTitle');
      }));


      it('should init variables with the correct values', inject(function () {
        expect(scope.playlistServices).toBe(playlistServices);
        expect(scope.playlists).toEqual([]);
        expect(scope.userId).toBeUndefined();
        expect(scope.isSameUser).toBe(false);
        expect(scope.selectedPlaylistId).toBeUndefined();
        expect(scope.playlistItems).toEqual([]);
      }));

      it('should init the app with the routeParams user Id', function () {
        $routeParams.userId = 123;
        scope.init();
        expect(scope.userId).toBe(123);
      });

      it('should init the page title', function () {
        expect(scope.initPageTitle).not.toHaveBeenCalled();
        scope.init();
        expect(scope.initPageTitle).toHaveBeenCalledWith('Playlists');
      });

      it('should call the getUserPlaylists method with the user Id', function () {
        spyOn(scope.playlistServices, 'getUserPlaylists');
        $routeParams.userId = 123;
        expect(scope.playlistServices.getUserPlaylists).not.toHaveBeenCalled();
        scope.init();
        expect(scope.playlistServices.getUserPlaylists.mostRecentCall.args[0]).toEqual(123);
      });

      it('should call the getUserPlaylists method and set the playlists', function () {
        spyOn(scope.playlistServices, 'getUserPlaylists').andCallFake(function (userId, done) {
          done(playlistsMock);
        });
        $routeParams.userId = 123;
        expect(scope.playlists).toEqual([]);
        scope.init();
        expect(scope.playlists).toBe(playlistsMock);
      });

      it('should call the getUserPlaylists method and set the playlists', function () {
        spyOn(scope.playlistServices, 'getUserPlaylists').andCallFake(function (userId, done) {
          done(playlistsMock);
        });
        $routeParams.userId = 123;
        expect(scope.playlists).toEqual([]);
        scope.init();
        expect(scope.playlists).toBe(playlistsMock);
      });

      it('should call the selectPlaylist method when there is a $routeParams.playlistId', function () {
        spyOn(scope.playlistServices, 'getUserPlaylists').andCallFake(function (userId, done) {
          done(playlistsMock);
        });
        spyOn(scope, 'selectPlaylist').andCallThrough();

        var routeParamPlaylist = 'a0212fdfsd42fd';

        expect(scope.selectPlaylist).not.toHaveBeenCalled();
        $routeParams.userId = 123;
        $routeParams.playlistId = routeParamPlaylist;
        expect(scope.selectedPlaylistId).toBeUndefined();
        scope.init();
        expect(scope.selectPlaylist).toHaveBeenCalledWith(routeParamPlaylist);
        expect(scope.selectedPlaylistId).toBe(routeParamPlaylist);
      });
    });


    // The selectPlaylist method
    describe('selectPlaylist', function () {
      it('should return if the two playlist ids are the sane', inject(function () {
        spyOn(playlistServices, 'getTrackIds');
        scope.selectedPlaylistId = 12;
        scope.selectPlaylist(12);
        expect(playlistServices.getTrackIds).not.toHaveBeenCalled();
      }));

      it('should set the isLoading to false and call the getTracksId and set the selectedPlaylistId', inject(function () {
        spyOn(playlistServices, 'getTrackIds').andReturn(undefined);
        scope.selectedPlaylistId = 1;
        expect(scope.isLoading).toBeFalsy();
        scope.selectPlaylist(2);
        expect(scope.isLoading).toBeFalsy();
        expect(scope.selectedPlaylistId).toBe(2);
        expect(playlistServices.getTrackIds).toHaveBeenCalled();
      }));


      it('should set the isLoading to true and call the getTracks, timeout methods', inject(function () {
        spyOn(playlistServices, 'getTrackIds').andReturn([123, 456]);
        var mergePosition = [{pos: 1}, {pos: 2}, {pos: 3}];
        spyOn(playlistServices, 'mergeItemPositions').andReturn(mergePosition);
        var getTracksDeferred;
        spyOn(soundCloudServices, 'getTracks').andCallFake(function () {
          getTracksDeferred = q.defer();
          return getTracksDeferred.promise;
        });
        scope.selectedPlaylistId = 1;
        expect(scope.isLoading).toBeFalsy();
        scope.selectPlaylist(2);
        expect(scope.isLoading).toBeTruthy();
        expect(soundCloudServices.getTracks).toHaveBeenCalled();
        expect(playlistServices.mergeItemPositions).not.toHaveBeenCalled();

        callDeferred(getTracksDeferred, scope, playlistsMock);
        expect(playlistServices.mergeItemPositions).not.toHaveBeenCalled();
        $timeout.flush(200);

        expect(scope.isLoading).toBeFalsy();
        expect(scope.playlistItems).toBe(mergePosition);
        expect(playlistServices.mergeItemPositions).toHaveBeenCalledWith(2, playlistsMock);
      }));
    });


    // The moveItem method
    describe('moveItem', function () {
      it('should call the updateMusicPositions with the correct values', inject(function () {
        spyOn(scope.playlistServices, 'updateMusicPositions');
        scope.moveItem(1, 2);
        expect(scope.playlistServices.updateMusicPositions).toHaveBeenCalledWith(scope.selectedPlaylistId, 1, 2);
      }));

      it('should call the updateMusicPositions with the scope playlist Id value', inject(function () {
        spyOn(scope.playlistServices, 'updateMusicPositions');
        scope.selectedPlaylistId = 12;
        scope.moveItem(3, 4);
        expect(scope.playlistServices.updateMusicPositions).toHaveBeenCalledWith(12, 3, 4);
      }));
    });
  });
});

