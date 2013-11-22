'use strict';

describe('Sound Cloud Search Services', function () {
  beforeEach(module('septWebRadioApp'));

  var $httpBackend, $cookieStore, q, scope;
  var soundcloudSearch;

  beforeEach(inject(function ($rootScope, _$httpBackend_, _$cookieStore_, $q, _soundcloudSearch_) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $cookieStore = _$cookieStore_;
    q = $q;
    soundcloudSearch = _soundcloudSearch_;
  }));

  function callDeferred(deferred, scope, resolve) {
    // Resolve the promise
    deferred.resolve(resolve);
    scope.$apply();
  }

  describe('soundCloudSearch', function () {


    it('should init the variables', inject(function () {
      expect(soundcloudSearch.searching).toBeFalsy();
      expect(soundcloudSearch.deferred).toBeUndefined();
    }));

    it('should call SC.get method', inject(function () {
      spyOn(SC, 'get').andCallThrough();
      expect(SC.get).not.toHaveBeenCalled();

      var request = 'abcde';
      soundcloudSearch.autoCompleteSearch(request);

      expect(SC.get).toHaveBeenCalledWith('/tracks', { q: request }, soundcloudSearch.resolveGetTracks);
    }));

    it('should set searching to true', inject(function () {
      spyOn(SC, 'get');

      expect(soundcloudSearch.searching).toBeFalsy();

      soundcloudSearch.autoCompleteSearch();

      expect(soundcloudSearch.searching).toBeTruthy();
    }));

    it('should set searching to false', inject(function () {
      var getDefer;

      spyOn(SC, 'get').andCallFake(function () {
        getDefer = q.defer();
        return getDefer.promise;
      });

      expect(soundcloudSearch.searching).toBeFalsy();

      var promise = soundcloudSearch.autoCompleteSearch();

      expect(soundcloudSearch.searching).toBeTruthy();

      callDeferred(getDefer, scope);

      promise.then(function (result) {
        expect(soundcloudSearch.searching).toBeFalsy();
      });
    }));

    it('should reject the promise', inject(function () {
      var defer = q.defer();

      spyOn(SC, 'get');
      spyOn(q, 'defer').andReturn(
        defer
      );

      expect(soundcloudSearch.searching).toBeFalsy();

      // First call
      var promise1 = soundcloudSearch.autoCompleteSearch();
      expect(soundcloudSearch.searching).toBeTruthy();

      var deferred = soundcloudSearch.deferred;
      spyOn(deferred, 'reject');
      expect(deferred.reject).not.toHaveBeenCalled();

      // Second call
      var promise2 = soundcloudSearch.autoCompleteSearch();
      expect(deferred.reject).toHaveBeenCalled();
    }));


    it('should set searching to false', inject(function () {
      spyOn(SC, 'get').andCallFake(function (meth, params, callBack) {
        callBack();
      });

      expect(soundcloudSearch.searching).toBeFalsy();

      var promise1 = soundcloudSearch.autoCompleteSearch('abcd');

      expect(soundcloudSearch.searching).toBeFalsy();
    }));
  });


  describe('resolveGetTracks', function () {
    it('should set searching to false', inject(function () {
      var promise1 = soundcloudSearch.autoCompleteSearch('abcd');

      soundcloudSearch.searching = true;
      expect(soundcloudSearch.searching).toBeTruthy();

      spyOn(soundcloudSearch.deferred, 'resolve');

      soundcloudSearch.resolveGetTracks();

      expect(soundcloudSearch.searching).toBeFalsy();
    }));
  });

});