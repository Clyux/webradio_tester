'use strict';

describe('Input Directives', function () {
  beforeEach(module('septWebRadioApp'));

  var $timeout, $rootScope, $compile;

  beforeEach(inject(function ($injector, _$rootScope_, _$compile_) {
    $timeout = $injector.get('$timeout');
    $rootScope = _$rootScope_;
    $compile = _$compile_;
  }));

  describe('Delayed Input Directives', function () {
    var defaultInputElement = '<input swr-delayed-input ng-model="searchedTerm" swr-delayed-input-callback="search()" />';
    var complexInputElement = '<input swr-delayed-input ng-model="searchedTerm" swr-delayed-input-delayed-time="700" swr-delayed-input-callback="search()" />';
    var elm, scopeController;

    beforeEach(inject(function ($controller) {
      scopeController = $rootScope.$new();
      var controller = $controller('StageCtrl', {
        $scope: scopeController});
    }));

    function changeInput(searchTerm) {
      scopeController.searchedTerm = searchTerm;
      scopeController.$apply();
    }

    function createNewElement(inputElement) {
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


  describe('autoFillableField Input Directives', function () {
    var defaultInputElement = '<input type="text" ng-model="logInUser.email" auto-fillable-field>';
    var valueInputElement = '<input type="text" ng-model="logInUser.email" auto-fillable-field value="input value">';
    var noNgModelInputElement = '<input type="text" auto-fillable-field x-auto-fill-prev-val="prev-val" value="input value">';
    var element;

    function createNewElement(elm) {
      element = $compile(elm)($rootScope);
      $rootScope.$digest();
    }

    it('should set the previous value', function () {
      createNewElement(defaultInputElement);
      $timeout.flush(301);
      element.attr('xAutoFillPrevVal', 'abcd');
      expect(element.val()).toBe('');
    });

    it('should set the elm value with the correct one', function () {
      createNewElement(valueInputElement);
      $timeout.flush(301);
      expect(element.attr('value')).toBe('input value');
    });

    it('should set the element value with the previous one', function () {
      createNewElement(valueInputElement);
      $timeout.flush(301);
      element.attr('xAutoFillPrevVal', 'abcd');
      expect(element.attr('value')).toBe('input value');
    });

    it('should call the trigger when there is no model', function () {
      element = $compile(noNgModelInputElement)($rootScope);

      element.on('input', function (event) {
        expect(event.type).toBe('input');
      });

      element.on('change', function (event) {
        expect(event.type).toBe('change');
      });

      element.on('keyup', function (event) {
        expect(event.type).toBe('keyup');
      });

      $rootScope.$digest();
      $timeout.flush(301);
    });
  });
});