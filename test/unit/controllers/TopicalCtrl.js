'use strict';

describe('Topical', function () {
  beforeEach(module('septWebRadioApp', 'septWebRadioServices'));

  describe('Controller', function () {

    var scope, controller, page;

    // Init controller
    beforeEach(inject(function ($rootScope, _Page_) {
      scope = $rootScope.$new();
      page = _Page_;
    }));

    // The main controller test
    describe('Topical Controller Init', function () {

      // init controller for test
      beforeEach(inject(function ($controller) {
        spyOn(page, 'setTitle').andCallThrough();

        controller = $controller('TopicalCtrl', {
          $scope: scope});
      }));

      it('should set the correct title', inject(function () {
        expect(page.setTitle).toHaveBeenCalledWith('Topical');
        expect(page.title()).toBe('Sept Web Radio - Topical');
      }));
    });
  });
});
