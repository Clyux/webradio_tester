'use strict';

describe('Stage', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  function callDeferred(deferred, scope, resolve) {
    // Resolve the promise
    deferred.resolve(resolve);
    scope.$apply();
  }

  // The stage controller test
  describe('Controller', function () {

    var scope, soundcloudSearchMock, controller, q, autoCompleteSearchDeferred, soundcloudSearch;
    var isConnected, Playlists;

    beforeEach(function () {
      soundcloudSearchMock = {
        autoCompleteSearch: function () {
          autoCompleteSearchDeferred = q.defer();
          return autoCompleteSearchDeferred.promise;
        }
      };
    });

    // init controller for test
    beforeEach(inject(function ($controller, $rootScope, _soundcloudSearch_, $q, _Playlists_) {
      q = $q;
      Playlists = _Playlists_;
      soundcloudSearch = _soundcloudSearch_;
      var scopeController = $rootScope.$new();
      $controller('MainCtrl', {
        $scope: scopeController});

      $rootScope.initPageTitle = function (title) {
        scopeController.initPageTitle(title);
      };
      isConnected = false;
      $rootScope.userServices = {
        isConnected: function () {
          return isConnected;
        }
      };

      scope = $rootScope.$new();
    }));

    // The main controller test
    describe('Controller', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        spyOn(soundcloudSearchMock, 'autoCompleteSearch').andCallThrough();

        controller = $controller('StageCtrl', {
          $scope: scope, soundcloudSearch: soundcloudSearchMock});
      }));

      it('should init the default values', inject(function () {
        expect(scope.isSearching).toBeFalsy();
        expect(scope.searchedTerm).toBeUndefined();
        expect(scope.searchedItems).toMatch([]);
        expect(scope.playlists).toMatch([]);
        expect(scope.selectedPlaylistIds).toMatch([]);
        expect(scope.selectedItemIds).toMatch([]);
        expect(scope.isSingleDragAndDrop).toBeFalsy();
      }));


      it('should not call the search method', function () {
        expect(soundcloudSearchMock.autoCompleteSearch).not.toHaveBeenCalled();
        scope.searchedTerm = '';
        scope.search();
        expect(soundcloudSearchMock.autoCompleteSearch).not.toHaveBeenCalled();

        scope.searchedTerm = undefined;
        scope.search();
        expect(soundcloudSearchMock.autoCompleteSearch).not.toHaveBeenCalled();

        scope.searchedTerm = 'a';
        scope.search();
        expect(soundcloudSearchMock.autoCompleteSearch).not.toHaveBeenCalled();

        scope.searchedTerm = '_';
        scope.search();
        expect(soundcloudSearchMock.autoCompleteSearch).not.toHaveBeenCalled();

        expect(scope.isSearching).toBeFalsy();
        expect(scope.searchedItems).toMatch([]);
      });

      it('should call the search method', function () {
        expect(soundcloudSearchMock.autoCompleteSearch).not.toHaveBeenCalled();
        scope.searchedTerm = 'ab';
        scope.search();
        expect(soundcloudSearchMock.autoCompleteSearch).toHaveBeenCalled();
      });

      it('should init the variables when searching', function () {
        scope.searchedTerm = 'ab';
        scope.search();
        expect(scope.isSearching).toBeTruthy();
        expect(scope.searchedItems).toMatch([]);
      });

      it('should put inside the model the returned values', function () {
        scope.searchedTerm = 'ab';
        scope.search();
        var result = {obj1: 'obj 1', obj2: 'obj 2'};
        callDeferred(autoCompleteSearchDeferred, scope, result);
        expect(scope.searchedItems).toMatch(result);
      });

      it('should put to false isSearching', function () {
        scope.searchedTerm = 'ab';
        expect(scope.isSearching).toBeFalsy();
        scope.search();
        expect(scope.isSearching).toBeTruthy();
        callDeferred(autoCompleteSearchDeferred, scope);
        expect(scope.isSearching).toBeFalsy();
      });

      it('should init the title page', inject(function () {
        spyOn(scope, 'initPageTitle');
        expect(scope.initPageTitle).not.toHaveBeenCalled();
        scope.init();
        expect(scope.initPageTitle).toHaveBeenCalledWith('Stage');
      }));

      it('should not call the Playlists.query method when the user is not connected', inject(function () {
        spyOn(Playlists, 'query');
        expect(Playlists.query).not.toHaveBeenCalled();
        scope.init();
        expect(Playlists.query).not.toHaveBeenCalled();
      }));

      it('should call the Playlists.query method when the user is connected', inject(function () {
        spyOn(Playlists, 'query');
        expect(Playlists.query).not.toHaveBeenCalled();
        isConnected = true;
        scope.init();
        expect(Playlists.query).toHaveBeenCalled();
      }));

      it('should init the playlists array when the user is connected', inject(function () {
        var playlistsMock = [
          {playlist: 'Playlist 1'},
          {playlist: 'Playlist 2'}
        ];
        spyOn(Playlists, 'query').andCallFake(function (callback) {
          return callback(playlistsMock);
        });
        isConnected = true;
        scope.init();
        expect(scope.playlists).toBe(playlistsMock);
      }));


      it('should call the createOrUpdatePlaylist function with undefined', inject(function () {
        spyOn(controller, 'createOrUpdatePlaylist');
        expect(controller.createOrUpdatePlaylist).not.toHaveBeenCalled();
        scope.dropped();
        expect(controller.createOrUpdatePlaylist).toHaveBeenCalledWith(undefined);
      }));

      it('should call the createOrUpdatePlaylist function a copy of array', inject(function () {
        var arrayMock = ['1', '2', '3'];
        spyOn(controller, 'createOrUpdatePlaylist').andCallFake(function (items) {
          expect(items).not.toBe(arrayMock);
          expect(items).toEqual(arrayMock);
        });
        expect(controller.createOrUpdatePlaylist).not.toHaveBeenCalled();
        scope.dropped(arrayMock);
        expect(controller.createOrUpdatePlaylist).toHaveBeenCalledWith(arrayMock);
      }));
    });
  });
})
;

