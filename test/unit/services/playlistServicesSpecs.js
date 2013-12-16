'use strict';

describe('Playlist Services', function () {
  beforeEach(module('septWebRadioApp'));

  var $cacheFactory, scope, Playlists, growl, $modal, playlistServices, cache;
  var $httpBackend;

  var playlistsMock = [
    {name: 'Playlist 1', _id: 1},
    {name: 'Playlist 2', _id: 2}
  ];

  beforeEach(inject(function ($rootScope, _Playlists_, _$cacheFactory_, _growl_, _$modal_, _playlistServices_, _$httpBackend_) {
    scope = $rootScope.$new();
    Playlists = _Playlists_;
    growl = _growl_;
    $cacheFactory = _$cacheFactory_;
    $modal = _$modal_;
    playlistServices = _playlistServices_;
    $httpBackend = _$httpBackend_;
    cache = $cacheFactory.get('playlistServices');
  }));

  afterEach(function () {
    cache.removeAll();
  });

  describe('Init', function () {

    it('should init the variables', inject(function () {
      expect(playlistServices.playlists).toBeUndefined();
      expect(playlistServices.cache).toBe(cache);
    }));

    it('should return the playlists set', inject(function () {
      playlistServices.playlists = playlistsMock;
      expect(playlistServices.getPlaylists()).toBe(playlistsMock);
    }));
  });

  describe('initPlaylists', function () {
    it('should get the playlists from the query', inject(function () {
      spyOn(Playlists, 'query').andCallFake(function (callback) {
        return callback(playlistsMock);
      });
      expect(playlistServices.playlists).toBeUndefined();
      expect(Playlists.query).not.toHaveBeenCalled();
      playlistServices.initPlaylists();
      expect(playlistServices.playlists).toBe(playlistsMock);
      expect(Playlists.query).toHaveBeenCalled();
    }));

    it('should set the playlists in cache', inject(function () {
      spyOn(Playlists, 'query').andCallFake(function (callback) {
        return callback(playlistsMock);
      });
      expect(cache.get('playlists')).toBeUndefined();
      playlistServices.initPlaylists();
      expect(cache.get('playlists')).toBe(playlistsMock);
    }));

    it('should set the playlists form the cache', inject(function () {
      // Set the cache
      cache.put('playlists', playlistsMock);
      expect(playlistServices.playlists).toBeUndefined();
      playlistServices.initPlaylists();
      expect(playlistServices.playlists).toBe(playlistsMock);
    }));

    it('should not call the query when the playlists are in cache', inject(function () {
      spyOn(Playlists, 'query');
      expect(Playlists.query).not.toHaveBeenCalled();
      // Set the cache
      cache.put('playlists', playlistsMock);
      playlistServices.initPlaylists();
      expect(Playlists.query).not.toHaveBeenCalled();
    }));
  });

  describe('createPlaylistItem and createPlaylistItems', function () {
    it('should return an empty array', inject(function () {
      var items = playlistServices.createPlaylistItems();
      expect(items).toEqual([]);
    }));

    it('should have as much items as the one provided', inject(function () {
      var itemIdsMock = ['1'];
      var items = playlistServices.createPlaylistItems(itemIdsMock);
      expect(items.length).toEqual(1);

      itemIdsMock = ['1', '2', '3', '4'];
      items = playlistServices.createPlaylistItems(itemIdsMock);
      expect(items.length).toEqual(4);
    }));

    it('should return the correct item', inject(function () {
      var item = playlistServices.createPlaylistItem('1');
      expect(item).toEqual({provider: 'soundcloud', musicId: '1'});

      item = playlistServices.createPlaylistItem('53652');
      expect(item).toEqual({provider: 'soundcloud', musicId: '53652'});
    }));
  });


  describe('findPlaylistById', function () {
    it('should return undefined', inject(function () {
      var playlist = playlistServices.findPlaylistById();
      expect(playlist).toBeUndefined();
    }));

    it('should return the correct playlist', inject(function () {
      playlistServices.playlists = playlistsMock;
      var playlist = playlistServices.findPlaylistById(1);
      expect(playlist).toEqual({name: 'Playlist 1', _id: 1});
    }));

    it('should return undefined when this id is not presents', inject(function () {
      playlistServices.playlists = playlistsMock;
      var playlist = playlistServices.findPlaylistById(52);
      expect(playlist).toBeUndefined();
    }));
  });


  describe('createOrUpdatePlaylist', function () {
    it('should call the createPlaylistModal when there is no playlistId specified', inject(function () {
      spyOn(playlistServices, 'createPlaylistModal');
      expect(playlistServices.createPlaylistModal).not.toHaveBeenCalled();
      var itemIds = ['1', '2', '3'];
      playlistServices.createOrUpdatePlaylist(undefined, itemIds);
      expect(playlistServices.createPlaylistModal).toHaveBeenCalledWith(itemIds);
    }));

    it('should call the addItemsToPlaylists when there is some playlistId and items specified', inject(function () {
      spyOn(playlistServices, 'addItemsToPlaylists');
      expect(playlistServices.addItemsToPlaylists).not.toHaveBeenCalled();
      var itemIds = ['1', '2', '3'];
      var playlistIds = ['4', '5', '6'];
      playlistServices.createOrUpdatePlaylist(playlistIds, itemIds);
      expect(playlistServices.addItemsToPlaylists).toHaveBeenCalledWith(playlistIds, itemIds);
    }));

    it('should call the createPlaylistModal when there is no items specified but some playlist', inject(function () {
      spyOn(playlistServices, 'createPlaylistModal');
      expect(playlistServices.createPlaylistModal).not.toHaveBeenCalled();
      var playlistIds = ['1', '2', '3'];
      playlistServices.createOrUpdatePlaylist(playlistIds, undefined);
      expect(playlistServices.createPlaylistModal).toHaveBeenCalledWith(undefined);
    }));
  });


  describe('createPlaylistWithItems', function () {
    it('should call the createPlaylistItems and call the create a new Playlist service', inject(function () {
      var itemIds = ['1', '2', '3'];
      var playlistName = 'playlist Name';
      var finalItems = playlistServices.createPlaylistItems(itemIds);
      var finalPlaylist = {name: playlistName, items: finalItems};
      var returnPlaylist = {_id: 51, name: playlistName, items: finalItems};
      var done = function (response) {
        expect(response).toMatch(returnPlaylist);
      };

      spyOn(playlistServices, 'createPlaylistItems').andCallThrough();
      $httpBackend.expectPOST('playlists', finalPlaylist)
        .respond(returnPlaylist);

      playlistServices.createPlaylistWithItems(playlistName, itemIds, done);
      expect(playlistServices.createPlaylistItems).toHaveBeenCalledWith(itemIds);

      $httpBackend.flush();
    }));

    it('should push the new playlist', inject(function () {
      playlistServices.playlists = [];
      var itemIds = ['1', '2', '3'];
      var playlistName = 'playlist Name';
      var finalItems = playlistServices.createPlaylistItems(itemIds);
      var finalPlaylist = {name: playlistName, items: finalItems};
      var returnPlaylist = {_id: 51, name: playlistName, items: finalItems};
      var done = function (response) {
        expect(response).toMatch(returnPlaylist);
      };

      spyOn(playlistServices.playlists, 'push').andCallThrough();
      $httpBackend.expectPOST('playlists', finalPlaylist)
        .respond(returnPlaylist);

      playlistServices.createPlaylistWithItems(playlistName, itemIds, done);
      expect(playlistServices.playlists.push).not.toHaveBeenCalled();
      expect(playlistServices.playlists.length).toBe(0);
      $httpBackend.flush();

      expect(playlistServices.playlists.push).toHaveBeenCalled();
      expect(playlistServices.playlists.length).toBe(1);
    }));

    it('should call the growl.addSuccessMessage', inject(function () {
      var itemIds = ['1', '2', '3'];
      var playlistName = 'playlist Name';
      var finalItems = playlistServices.createPlaylistItems(itemIds);
      var finalPlaylist = {name: playlistName, items: finalItems};
      var returnPlaylist = {_id: 51, name: playlistName, items: finalItems};
      var done = function (response) {
        expect(response).toMatch(returnPlaylist);
      };

      spyOn(growl, 'addSuccessMessage');
      $httpBackend.expectPOST('playlists', finalPlaylist)
        .respond(returnPlaylist);

      playlistServices.createPlaylistWithItems(playlistName, itemIds, done);
      expect(growl.addSuccessMessage).not.toHaveBeenCalled();
      $httpBackend.flush();

      expect(growl.addSuccessMessage).toHaveBeenCalledWith('Playlist successfully created!');
    }));
  });


  describe('addItemsToPlaylists', function () {
    it('should call the addItemsToPlaylist method', inject(function () {
      var playlistIds = [3, 4, 5];
      var itemIds = ['1', '2'];
      spyOn(playlistServices, 'addItemsToPlaylist');
      var items = playlistServices.addItemsToPlaylists(playlistIds, itemIds);
      expect(playlistServices.addItemsToPlaylist.calls.length).toEqual(3);
      expect(playlistServices.addItemsToPlaylist.calls[0].args).toEqual([3, itemIds]);
      expect(playlistServices.addItemsToPlaylist.calls[1].args).toEqual([4, itemIds]);
      expect(playlistServices.addItemsToPlaylist.calls[2].args).toEqual([5, itemIds]);
    }));
  });
});