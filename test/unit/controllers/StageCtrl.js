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

    var scope, soundcloudSearchMock, controller, q, autoCompleteSearchDeferred, soundcloudSearch, page;

    beforeEach(function () {
      soundcloudSearchMock = {
        autoCompleteSearch: function () {
          autoCompleteSearchDeferred = q.defer();
          return autoCompleteSearchDeferred.promise;
        }
      };
    });

    // init controller for test
    beforeEach(inject(function ($rootScope, _soundcloudSearch_, $q, _Page_) {
      scope = $rootScope.$new();
      q = $q;
      page = _Page_;
      soundcloudSearch = _soundcloudSearch_;
    }));

    // The main controller test
    describe('Stage Controller test Init App', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        spyOn(soundcloudSearchMock, 'autoCompleteSearch').andCallThrough();
        spyOn(page, 'setTitle').andCallThrough();

        controller = $controller('StageCtrl', {
          $scope: scope, soundcloudSearch: soundcloudSearchMock});
      }));

      it('should init the default values', inject(function () {
        expect(scope.isSearching).toBeFalsy();
        expect(scope.searchedTerm).toBeUndefined();
        expect(scope.searchedItems).toMatch([]);
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

        var result = {obj1:'obj 1', obj2:'obj 2'};

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

      it('should set the correct title', inject(function () {
        expect(page.setTitle).toHaveBeenCalledWith('Stage');
        expect(page.title()).toBe('Sept Web Radio - Stage');
      }));
    });
  });
});

