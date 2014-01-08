'use strict';

describe('Sortable Directives', function () {
  beforeEach(module('septWebRadioDirectives'));

  var scopeController, controller, $compile, rootScope, $controller;

  beforeEach(inject(function ($rootScope, _$compile_, _$controller_) {
    rootScope = $rootScope;
    scopeController = rootScope.$new();
    $compile = _$compile_;
    $controller = _$controller_;
  }));

  describe('swrSortableCtrl Controller', function () {

    function createElement(element) {
      var elm = angular.element(element);
      // instantiate the controller
      controller = $controller('swrSortableCtrl', {$scope: scopeController, $element: elm});
      return elm;
    }

    describe('init', function () {
      it('should init the variables', function () {
        createElement('<div data-swr-sortable/>');
        expect(controller.positionFrom).toBe(-1);
      });

      it('should init the variables', function () {
        var elm = createElement('<div data-swr-sortable/>');
        spyOn(elm, 'sortable');
        spyOn(elm, 'disableSelection');
        controller.init();
        expect(elm.sortable).toHaveBeenCalledWith({
          opacity: 0.9,
          containment: 'parent',
          cursor: 'move',
          forceHelperSize: true,
          forcePlaceholderSize: true,
          revert: true,
          tolerance: 'pointer',
          start: jasmine.any(Function),
          stop: jasmine.any(Function)
        });
        expect(elm.disableSelection).toHaveBeenCalled();
      });
    });


    describe('appendBrick', function () {
      it('should call the sortable method', function () {
        var elm = createElement('<div data-swr-sortable/>');
        spyOn(elm, 'sortable');
        controller.appendBrick();
        expect(elm.sortable).toHaveBeenCalledWith('refreshPositions');
      });
    });


    describe('startMoving', function () {
      it('should set the position From the the element index', function () {
        createElement('<div data-swr-sortable/>');

        var element = {
          index: function () {
            return 2;
          }
        };
        spyOn(element, 'index').andCallThrough();

        controller.startMoving(element);
        expect(element.index).toHaveBeenCalled();
        expect(controller.positionFrom).toBe(2);
      });

      it('should set the position From to -1 when the element is undefined', function () {
        createElement('<div data-swr-sortable/>');
        controller.startMoving(undefined);
        expect(controller.positionFrom).toBe(-1);
      });
    });


    describe('stopMoving', function () {
      it('should set the position From to -1 and call the scope method', function () {
        createElement('<div data-swr-sortable/>');
        var element = {
          index: function () {
            return 2;
          }
        };
        spyOn(element, 'index').andCallThrough();

        scopeController.swrSortableMoveItem = function (positionFrom, positionTo) {
          expect(positionFrom).toBe(5);
          expect(positionTo).toBe(2);
        };
        controller.positionFrom = 5;
        spyOn(scopeController, 'swrSortableMoveItem');

        controller.stopMoving(element);
        expect(scopeController.swrSortableMoveItem).toHaveBeenCalledWith({positionFrom: 5, positionTo: 2});
        expect(element.index).toHaveBeenCalled();
        expect(controller.positionFrom).toBe(-1);
      });

      it('should set the position From to -1 and call the scope method', function () {
        createElement('<div data-swr-sortable/>');
        var element = {
          index: function () {
            return 2;
          }
        };
        spyOn(element, 'index').andCallThrough();

        scopeController.swrSortableMoveItem = function (positionFrom, positionTo) {
          expect(positionFrom).toBe(-1);
          expect(positionTo).toBe(2);
        };
        spyOn(scopeController, 'swrSortableMoveItem');

        controller.stopMoving(element);
        expect(scopeController.swrSortableMoveItem).toHaveBeenCalledWith({positionFrom: -1, positionTo: 2});
        expect(element.index).toHaveBeenCalled();
        expect(controller.positionFrom).toBe(-1);
      });

      it('should set the position From to -1 and dont call the scope method', function () {
        createElement('<div data-swr-sortable/>');
        var element = {
          index: function () {
            return 2;
          }
        };
        spyOn(element, 'index').andCallThrough();
        controller.positionFrom = 2;
        scopeController.swrSortableMoveItem = function (positionFrom, positionTo) {
        };
        spyOn(scopeController, 'swrSortableMoveItem');

        controller.stopMoving(element);
        expect(scopeController.swrSortableMoveItem).not.toHaveBeenCalledWith();
        expect(element.index).toHaveBeenCalled();
        expect(controller.positionFrom).toBe(-1);
      });

      it('should set the position From to -1 when the element is undefined', function () {
        createElement('<div data-swr-sortable/>');
        controller.stopMoving(undefined);
        expect(controller.positionFrom).toBe(-1);
      });
    });
  });
});