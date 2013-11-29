'use strict';

describe('Select Div Directives', function () {
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

  it('should add the three CSS classes and set an attribute', function () {
    createNewElement('<div data-swr-select-div />');

    expect(elm.hasClass('swr-select')).toBeFalsy();
    expect(elm.hasClass('ui-selected')).toBeFalsy();
    expect(elm.attr('selected')).toBeFalsy();

    elm.click();

    expect(elm.hasClass('swr-select')).toBeTruthy();
    expect(elm.hasClass('ui-selected')).toBeTruthy();
    expect(elm.attr('selected')).toBeTruthy();
  });

  it('should add the three CSS classes and set an attribute', function () {
    createNewElement('<div data-swr-select-div class="swr-select ui-selected" selected/>');

    expect(elm.hasClass('swr-select')).toBeTruthy();
    expect(elm.hasClass('ui-selected')).toBeTruthy();
    expect(elm.attr('selected')).toBeTruthy();

    elm.click();

    expect(elm.hasClass('swr-select')).toBeFalsy();
    expect(elm.hasClass('ui-selected')).toBeFalsy();
    expect(elm.attr('selected')).toBeFalsy();
  });
});