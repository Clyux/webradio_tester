'use strict';

describe('Select Directives', function () {
  beforeEach(module('septWebRadioApp'));

  var elm, scopeController, $compile;

  beforeEach(inject(function ($rootScope, _$compile_) {
    scopeController = $rootScope.$new();
    $compile = _$compile_;
  }));

  function createNewElement(inputElement){
    elm = angular.element(inputElement);
    $compile(elm)(scopeController);
  }

  it('should add the default CSS classe and set the attribute', function () {
    createNewElement('<div data-swr-select />');

    expect(elm.hasClass('swr-select')).toBeFalsy();
    expect(elm.attr('selected')).toBeFalsy();

    elm.click();


    expect(elm.hasClass('swr-select')).toBeTruthy();
    expect(elm.attr('selected')).toBeTruthy();
  });

  it('should add the correct CSS classe and set the attribute', function () {
    createNewElement('<div data-swr-select data-swr-select-class="active" />');

    expect(elm.hasClass('active')).toBeFalsy();
    expect(elm.attr('selected')).toBeFalsy();

    elm.click();


    expect(elm.hasClass('active')).toBeTruthy();
    expect(elm.attr('selected')).toBeTruthy();
  });

  it('should remove the default CSS classe and the attribute', function () {
    createNewElement('<div data-swr-select class="swr-select" selected/>');

    expect(elm.hasClass('swr-select')).toBeTruthy();
    expect(elm.attr('selected')).toBeTruthy();

    elm.click();

    expect(elm.hasClass('swr-select')).toBeFalsy();
    expect(elm.attr('selected')).toBeFalsy();
  });

  it('should remove the correct CSS classe and the attribute', function () {
    createNewElement('<div data-swr-select class="active" data-swr-select-class="active" selected />');

    expect(elm.hasClass('active')).toBeTruthy();
    expect(elm.attr('selected')).toBeTruthy()

    elm.click();

    expect(elm.hasClass('active')).toBeFalsy();
    expect(elm.attr('selected')).toBeFalsy();;
  });

});