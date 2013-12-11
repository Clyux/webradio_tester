'use strict';

describe('Delayed Input Directives', function () {
  beforeEach(module('septWebRadioApp'));

  var elm, scopeController, controller, $timeout, $compile;
  var defaultInputElement = '<input swr-delayed-input ng-model="searchedTerm" swr-delayed-input-callback="search()" />';
  var complexInputElement = '<input swr-delayed-input ng-model="searchedTerm" swr-delayed-input-delayed-time="700" swr-delayed-input-callback="search()" />';

  beforeEach(inject(function ($rootScope, _$compile_, $controller, $injector) {
    scopeController = $rootScope.$new();
    $timeout = $injector.get('$timeout');
    $compile = _$compile_;

    controller = $controller('StageCtrl', {
      $scope: scopeController});
  }));

  function changeInput(searchTerm) {
    scopeController.searchedTerm = searchTerm;
    scopeController.$apply();
  }

  function createNewElement(inputElement){
    elm = angular.element(inputElement);
    $compile(elm)(scopeController);
    changeInput('');
  }

  it('should have the default delayedTime set to 500', function () {
    createNewElement(defaultInputElement);

    spyOn(scopeController, 'search');

    expect(scopeController.search).not.toHaveBeenCalled();
    changeInput('abcd');

    $timeout.flush(100);
    expect(scopeController.search).not.toHaveBeenCalled();
    $timeout.flush(400);

    expect(scopeController.search).toHaveBeenCalled();
  });

  it('should have the delayedTime set to 700', function () {
    createNewElement(complexInputElement);
    spyOn(scopeController, 'search');

    expect(scopeController.search).not.toHaveBeenCalled();
    changeInput('abcd');

    $timeout.flush(350);

    expect(scopeController.search).not.toHaveBeenCalled();

    $timeout.flush(350);

    expect(scopeController.search).toHaveBeenCalled();
  });

  it('should cancel and start a new timer when the ngModel change', function () {
    createNewElement(complexInputElement);
    spyOn(scopeController, 'search');

    scopeController.searchedTerm = '';
    scopeController.$apply();

    expect(scopeController.search).not.toHaveBeenCalled();
    changeInput('abcd');

    $timeout.flush(350);

    // Change input with a different value
    changeInput('abcdefg');

    expect(scopeController.search).not.toHaveBeenCalled();

    $timeout.flush(350);

    expect(scopeController.search).not.toHaveBeenCalled();

    $timeout.flush(350);

    expect(scopeController.search).toHaveBeenCalled();
  });

  it('should not cancel the timer when the value is the same', function () {
    createNewElement(complexInputElement);
    spyOn(scopeController, 'search');

    scopeController.searchedTerm = '';
    scopeController.$apply();

    expect(scopeController.search).not.toHaveBeenCalled();
    changeInput('abcd');

    $timeout.flush(350);

    // Change input with a different value
    changeInput('abcd');

    expect(scopeController.search).not.toHaveBeenCalled();

    $timeout.flush(350);

    expect(scopeController.search).toHaveBeenCalled();
  });
});