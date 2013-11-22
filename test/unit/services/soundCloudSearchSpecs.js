'use strict';

describe('Sound Cloud Search Services', function () {
  beforeEach(module('septWebRadioApp'));

  var $httpBackend, $cookieStore, q, scope;

  beforeEach(inject(function ($rootScope, _$httpBackend_, _$cookieStore_, $q) {
    scope = $rootScope.$new();
    $httpBackend = _$httpBackend_;
    $cookieStore = _$cookieStore_;
    q = $q;
  }));

  function callDeferred(deferred, scope, resolve) {
    // Resolve the promise
    deferred.resolve(resolve);
    scope.$apply();
  }

  describe('soundCloudSearch', function () {

    var soundcloudSearch;

    beforeEach(inject(function (_soundcloudSearch_) {
      soundcloudSearch = _soundcloudSearch_;
    }));

    it('should init the variables', inject(function () {
      expect(soundcloudSearch.searching).toBeFalsy();
      expect(soundcloudSearch.deferred).toBeUndefined();
    }));

    it('should call SC.get method', inject(function () {
      spyOn(SC, 'get').andCallThrough();
      expect(SC.get).not.toHaveBeenCalled();

      soundcloudSearch.autoCompleteSearch();

      expect(SC.get).toHaveBeenCalled();
    }));

    it('should set searching to true', inject(function () {
      spyOn(SC, 'get');

      expect(soundcloudSearch.searching).toBeFalsy();

      soundcloudSearch.autoCompleteSearch();

      expect(soundcloudSearch.searching).toBeTruthy();
    }));

    it('should set searching to false', inject(function () {
      var meDefer;

      spyOn(SC, 'get').andCallFake(function () {
        meDefer = q.defer();
        return meDefer.promise;
      });

      expect(soundcloudSearch.searching).toBeFalsy();

      var promise = soundcloudSearch.autoCompleteSearch();

      expect(soundcloudSearch.searching).toBeTruthy();

      callDeferred(meDefer, scope);

      promise.then(function(result){
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
  });
});