'use strict';

/* jasmine specs for controllers go here */

describe('controllers', function () {
  beforeEach(module('septWebRadioApp'));

  var scope, ctrl;

  beforeEach(inject(function ($rootScope, $controller) {
    scope = $rootScope.$new();
    ctrl = $controller('MainCtrl', {$scope: scope});
  }));

  it('should attached three elements to awesomeThings', inject(function () {
    expect(scope.awesomeThings.length).toBe(3);
  }));

  it('should be true', inject(function () {
    expect(true).toBe(true);
  }));
});