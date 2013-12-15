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
    var isConnected, playlistServices, utilities, rootScope;

    beforeEach(function () {
      soundcloudSearchMock = {
        autoCompleteSearch: function () {
          autoCompleteSearchDeferred = q.defer();
          return autoCompleteSearchDeferred.promise;
        }
      };
    });

    // init controller for test
    beforeEach(inject(function ($controller, $rootScope, _soundcloudSearch_, $q, _Playlists_, _playlistServices_, _utilities_) {
      rootScope = $rootScope;
      q = $q;
      playlistServices = _playlistServices_;
      soundcloudSearch = _soundcloudSearch_;
      utilities = _utilities_;
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
        controller = $controller('StageCtrl', {
          $scope: scope});
      }));


      describe('Search', function () {
        it('should init the default values', inject(function () {
          expect(scope.isSearching).toBeFalsy();
          expect(scope.searchedTerm).toBeUndefined();
          expect(scope.searchedItems).toMatch([]);
          expect(scope.playlistServices).toBe(playlistServices);
          expect(scope.selectedPlaylistIds).toMatch([]);
          expect(scope.selectedItemIds).toMatch([]);
          expect(scope.isSingleDragAndDrop).toBeFalsy();
        }));

        it('should init the title page', inject(function () {
          spyOn(scope, 'initPageTitle');
          expect(scope.initPageTitle).not.toHaveBeenCalled();
          scope.init();
          expect(scope.initPageTitle).toHaveBeenCalledWith('Stage');
        }));

        it('should not call the Playlists.query method when the user is not connected', inject(function () {
          spyOn(scope.playlistServices, 'initPlaylists');
          expect(scope.playlistServices.initPlaylists).not.toHaveBeenCalled();
          scope.init();
          expect(scope.playlistServices.initPlaylists).not.toHaveBeenCalled();
        }));

        it('should call the Playlists.query method when the user is connected', inject(function () {
          spyOn(scope.playlistServices, 'initPlaylists');
          expect(scope.playlistServices.initPlaylists).not.toHaveBeenCalled();
          isConnected = true;
          scope.init();
          expect(scope.playlistServices.initPlaylists).toHaveBeenCalled();
        }));
      });


      describe('Search', function () {
        beforeEach(inject(function ($controller) {
          spyOn(soundcloudSearchMock, 'autoCompleteSearch').andCallThrough();
          controller = $controller('StageCtrl', {
            $scope: scope, soundcloudSearch: soundcloudSearchMock});
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
      });


      describe('dropped', function () {
        it('should call the createOrUpdatePlaylist function with the correct scope var', inject(function () {
          spyOn(playlistServices, 'createOrUpdatePlaylist');
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.dropped();
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith(scope.selectedPlaylistIds, undefined);
        }));

        it('should call the createOrUpdatePlaylist function with itemsIds undefined', inject(function () {
          spyOn(playlistServices, 'createOrUpdatePlaylist');
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.dropped();
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith([], undefined);
        }));

        it('should call the createOrUpdatePlaylist with itemsIds an array copied', inject(function () {
          var arrayMock = ['1', '2', '3'];
          spyOn(playlistServices, 'createOrUpdatePlaylist').andCallFake(function (playlistIds, items) {
            expect(items).not.toBe(arrayMock);
            expect(items).toEqual(arrayMock);
          });
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.dropped(arrayMock);
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith([], arrayMock);
        }));

        it('should call the createOrUpdatePlaylist with selectedPlaylistIds', inject(function () {
          var arrayMock = ['1', '2', '3'];
          spyOn(playlistServices, 'createOrUpdatePlaylist').andCallFake(function (playlistIds) {
            expect(playlistIds).toBe(arrayMock);
          });
          scope.selectedPlaylistIds = arrayMock;
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.dropped();
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith(arrayMock, undefined);
        }));

        it('should call the createOrUpdatePlaylist with selectedPlaylistIds and the items', inject(function () {
          var playlistMock = ['1', '2', '3'];
          var itemsMock = ['4', '5'];
          spyOn(playlistServices, 'createOrUpdatePlaylist').andCallFake(function (playlistIds, itemIds) {
            expect(playlistIds).toBe(playlistMock);
            expect(itemIds).not.toBe(itemsMock);
            expect(itemIds).toEqual(itemsMock);
          });
          scope.selectedPlaylistIds = playlistMock;
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.dropped(itemsMock);
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith(playlistMock, itemsMock);
        }));
      });


      describe('clickOnCreateButton', function () {
        it('should call the createOrUpdatePlaylist function with the default scope var', inject(function () {
          spyOn(playlistServices, 'createOrUpdatePlaylist');
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.clickOnCreateButton();
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith([], []);
        }));

        it('should call the createOrUpdatePlaylist function with the correct scope var', inject(function () {
          spyOn(playlistServices, 'createOrUpdatePlaylist');
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.clickOnCreateButton();
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith(scope.selectedPlaylistIds, scope.selectedItemIds);
        }));

        it('should call the createOrUpdatePlaylist function with the correct scope var initialized', inject(function () {
          spyOn(playlistServices, 'createOrUpdatePlaylist');
          var playlistMock = ['1', '2', '3'];
          var itemsMock = ['4', '5'];

          scope.selectedPlaylistIds = playlistMock;
          scope.selectedItemIds = itemsMock;
          expect(playlistServices.createOrUpdatePlaylist).not.toHaveBeenCalled();
          scope.clickOnCreateButton();
          expect(playlistServices.createOrUpdatePlaylist).toHaveBeenCalledWith(playlistMock, itemsMock);
        }));
      });


      describe('getButtonLabel', function () {
        it('should return create a new playlist by default', inject(function () {
          scope.selectedPlaylistIds = undefined;
          scope.selectedItemIds = undefined;
          var label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist');

          scope.selectedPlaylistIds = [];
          scope.selectedItemIds = [];
          label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist');
        }));

        it('should return create a new playlist when there is no itmes selected', inject(function () {
          scope.selectedPlaylistIds = ['1'];
          scope.selectedItemIds = undefined;
          var label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist');

          scope.selectedItemIds = [];
          label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist');
        }));

        it('should return Add + when there is one playlist selected and one item', inject(function () {
          scope.selectedPlaylistIds = ['5'];
          scope.selectedItemIds = ['6'];
          var label = scope.getButtonLabel();
          expect(label).toBe('Add 1 item to 1 playlist');
        }));

        it('should return Add + when there is more than one playlist selected and one item', inject(function () {
          scope.selectedPlaylistIds = ['5', '8', '9'];
          scope.selectedItemIds = ['6'];
          var label = scope.getButtonLabel();
          expect(label).toBe('Add 1 item to 3 playlists');
        }));

        it('should return Add + when there is one playlist selected and more than one item', inject(function () {
          scope.selectedPlaylistIds = ['4'];
          scope.selectedItemIds = ['5', '8', '9'];
          var label = scope.getButtonLabel();
          expect(label).toBe('Add 3 items to 1 playlist');
        }));

        it('should return Add + when there is more than one playlist selected and more than one item', inject(function () {
          scope.selectedPlaylistIds = ['6', '7'];
          scope.selectedItemIds = ['5', '8', '9', '123'];
          var label = scope.getButtonLabel();
          expect(label).toBe('Add 4 items to 2 playlists');
        }));

        it('should return Create a new playlist with + when there is no playlist selected and one item', inject(function () {
          scope.selectedPlaylistIds = undefined;
          scope.selectedItemIds = ['5'];
          var label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist with 1 item');

          scope.selectedPlaylistIds = [];
          label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist with 1 item');
        }));

        it('should return Create a new playlist with + when there is no playlist selected and more than one item', inject(function () {
          scope.selectedPlaylistIds = undefined;
          scope.selectedItemIds = ['5', '6', '123'];
          var label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist with 3 items');

          scope.selectedPlaylistIds = [];
          label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist with 3 items');
        }));

        it('should return Create a new playlist with 1 item when isSingleDragAndDrop is true', inject(function () {
          scope.selectedPlaylistIds = undefined;
          scope.selectedItemIds = ['5', '6', '123'];
          scope.isSingleDragAndDrop = true;
          var label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist with 1 item');

          scope.selectedPlaylistIds = [];
          label = scope.getButtonLabel();
          expect(label).toBe('Create a new playlist with 1 item');
        }));

        it('should return Add 1 item + when isSingleDragAndDrop is true', inject(function () {
          scope.selectedPlaylistIds = ['6', '7'];
          scope.selectedItemIds = ['5', '8', '9', '123'];
          scope.isSingleDragAndDrop = true;
          var label = scope.getButtonLabel();
          expect(label).toBe('Add 1 item to 2 playlists');
        }));
      });


      describe('togglePlaylist', function () {
        it('should add one item to selectedPlaylistIds', inject(function () {
          expect(scope.selectedPlaylistIds).toEqual([]);
          scope.togglePlaylist('12');
          expect(scope.selectedPlaylistIds).toEqual(['12']);
        }));

        it('should remove the item to selectedPlaylistIds', inject(function () {
          scope.selectedPlaylistIds = ['1', '2'];
          expect(scope.selectedPlaylistIds).toEqual(['1', '2']);
          scope.togglePlaylist('2');
          expect(scope.selectedPlaylistIds).toEqual(['1']);
        }));

        it('should not remove but add the item to selectedPlaylistIds', inject(function () {
          scope.selectedPlaylistIds = ['1', '2'];
          expect(scope.selectedPlaylistIds).toEqual(['1', '2']);
          scope.togglePlaylist('3');
          expect(scope.selectedPlaylistIds).toEqual(['1', '2', '3']);
        }));
      });


      describe('toggleSelectItem', function () {
        it('should add one item to selectedItemIds', inject(function () {
          expect(scope.selectedItemIds).toEqual([]);
          scope.toggleSelectItem('12');
          expect(scope.selectedItemIds).toEqual(['12']);
        }));

        it('should remove the item to selectedItemIds', inject(function () {
          scope.selectedItemIds = ['1', '2'];
          expect(scope.selectedItemIds).toEqual(['1', '2']);
          scope.toggleSelectItem('2');
          expect(scope.selectedItemIds).toEqual(['1']);
        }));

        it('should not remove but add the item to selectedItemIds', inject(function () {
          scope.selectedItemIds = ['1', '2'];
          expect(scope.selectedItemIds).toEqual(['1', '2']);
          scope.toggleSelectItem('3');
          expect(scope.selectedItemIds).toEqual(['1', '2', '3']);
        }));
      });


      describe('listen events', function () {
        it('should set isSingleDragAndDrop to true', inject(function () {
          expect(scope.isSingleDragAndDrop).toBeFalsy();
          rootScope.$emit('SWR-DRAG-START-NUMBER', 1);
          expect(scope.isSingleDragAndDrop).toBeTruthy();
        }));

        it('should set isSingleDragAndDrop to false when there is more than one items', inject(function () {
          expect(scope.isSingleDragAndDrop).toBeFalsy();
          rootScope.$emit('SWR-DRAG-START-NUMBER', 2);
          expect(scope.isSingleDragAndDrop).toBeFalsy();

          rootScope.$emit('SWR-DRAG-START-NUMBER', 12);
          expect(scope.isSingleDragAndDrop).toBeFalsy();
        }));

        it('should set isSingleDragAndDrop to false for the end event', inject(function () {
          expect(scope.isSingleDragAndDrop).toBeFalsy();
          rootScope.$emit('SWR-DRAG-START-NUMBER', 1);
          expect(scope.isSingleDragAndDrop).toBeTruthy();

          rootScope.$emit('SWR-DRAG-END-NUMBER');
          expect(scope.isSingleDragAndDrop).toBeFalsy();
        }));
      });
    });
  });
});

