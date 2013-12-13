'use strict';

describe('Door', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  describe('Controller', function () {

    var scope, controller;

    // Init controller
    beforeEach(inject(function ($rootScope, $controller) {
      var scopeController = $rootScope.$new();
      $controller('MainCtrl', {
        $scope: scopeController});

      $rootScope.initPageTitle = function (title) {
        scopeController.initPageTitle(title);
      };

      scope = $rootScope.$new();
    }));

    // The main controller test
    describe('Door Controller Init', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        controller = $controller('DoorCtrl', {
          $scope: scope});
      }));

      it('should init the title page', inject(function () {
        spyOn(scope, 'initPageTitle');
        expect(scope.initPageTitle).not.toHaveBeenCalled();
        scope.init();
        expect(scope.initPageTitle).toHaveBeenCalledWith('Door');
      }));
    });
  });
});
