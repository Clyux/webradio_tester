'use strict';

describe('Drag And Drop Directives', function () {
  beforeEach(module('septWebRadioApp'));

  var scopeController, controller, $compile, rootScope, swrDragAndDropService, $controller, $timeout;

  beforeEach(inject(function ($rootScope, _$compile_, _swrDragAndDropService_, _$controller_, $injector) {
    rootScope = $rootScope;
    scopeController = rootScope.$new();
    $compile = _$compile_;
    swrDragAndDropService = _swrDragAndDropService_;
    $controller = _$controller_;
    $timeout = $injector.get('$timeout');
  }));

  describe('swrDragController Controller', function () {

    function createElement(element) {
      var elm = angular.element(element);
      // instantiate the controller
      controller = $controller('swrDragController', {$rootScope: rootScope, $scope: scopeController, $element: elm, swrDragAndDropService: swrDragAndDropService});
      return elm;
    }

    describe('init', function () {
      it('should call the drag methods', function () {
        var elm = createElement('<div data-swr-draggable="true"/>');
        spyOn(elm, 'drag');
        controller.init();
        expect(elm.drag.calls.length).toBe(4);
        expect(elm.drag).toHaveBeenCalled();
      });

      it('should call the on methods', function () {
        var elm = createElement('<div data-swr-draggable="true"/>');
        spyOn(elm, 'on');
        controller.init();
        expect(elm.on.calls.length).toBe(5);
        expect(elm.on).toHaveBeenCalledWith('$destroy', controller.cleanDrag);
      });
    });


    describe('drag Init', function () {
      it('should return undefined selector', function () {
        createElement('<div data-swr-draggable="true"/>');
        var result = controller.dragInit();
        expect(result).toBeUndefined();
      });


      it('should return the correct selector', function () {
        createElement('<div data-swr-draggable="true" class="swr-select" />');
        var result = controller.dragInit();
        var selector = jQuery('.swr-select');
        expect(result).toEqual(selector);
      });
    });


    describe('drag Start', function () {

      it('should call the emit method', function () {
        spyOn(rootScope, '$emit');
        var elm = createElement('<div data-swr-draggable="true" data-item-id="123" />');
        controller.dragStart();
        expect(rootScope.$emit).toHaveBeenCalledWith('SWR-DRAG-START', elm);
      });


      it('should add the item id in the factory', function () {
        spyOn(swrDragAndDropService, 'addDraggedItem');
        createElement('<div data-swr-draggable="true" data-item-id="123" />');
        controller.dragStart();
        expect(swrDragAndDropService.addDraggedItem).toHaveBeenCalledWith('123');
      });

      it('should add the class swr-drag-start inside', function () {
        var elm = createElement('<div data-swr-draggable="true" data-item-id="123" />');
        spyOn(elm, 'addClass').andCallThrough();
        controller.dragStart();
        expect(elm.addClass).toHaveBeenCalledWith('swr-drag-start');
        expect(elm.hasClass('swr-drag-start')).toBeTruthy();
      });
    });


    describe('drag', function () {
      it('should move the element', function () {
        var elm = createElement('<div data-swr-draggable="true" data-item-id="123" style="top:0; left:0;" />');
        expect(elm.css('top')).toBe('0px');
        expect(elm.css('left')).toBe('0px');
        spyOn(elm, 'css').andCallThrough();

        var dd = {
          offsetY: 50,
          offsetX: 10
        };

        controller.drag({}, dd);

        expect(elm.css).toHaveBeenCalledWith({top: undefined, left: undefined});
        expect(elm.css('top')).toBe('0px');
        expect(elm.css('left')).toBe('0px');
      });
    });

    describe('dragEnd', function () {
      it('should remove the item inside the factory', function () {
        var elm = createElement('<div data-swr-draggable="true" class="swr-drag-start" data-item-id="123"  style="top:50px; left:10px;" />');

        swrDragAndDropService.addDraggedItem('123');
        expect(swrDragAndDropService.getDraggedItems()).toEqual(['123']);

        // Check CSS
        expect(elm.hasClass('swr-drag-start')).toBeTruthy();
        expect(elm.css('top')).toBe('50px');
        expect(elm.css('left')).toBe('10px');

        spyOn(elm, 'animate').andCallThrough();
        spyOn(swrDragAndDropService, 'removeDraggedItem').andCallThrough();

        var dd = {
          originalY: 0,
          originalX: 0
        };

        controller.dragEnd({}, dd);

        expect(swrDragAndDropService.removeDraggedItem).toHaveBeenCalledWith('123');
        expect(swrDragAndDropService.getDraggedItems()).toEqual([]);
        expect(elm.animate).toHaveBeenCalledWith({top: 0, left: 0}, 600);
      });

      it('should call the emit method', function () {
        var elm = createElement('<div data-swr-draggable="true" class="swr-drag-start" data-item-id="123"  style="top:50px; left:10px;" />');

        spyOn(rootScope, '$emit');

        var dd = {
          originalY: 0,
          originalX: 0
        };
        controller.dragEnd({}, dd);
        expect(rootScope.$emit).toHaveBeenCalledWith('SWR-DRAG-END', elm);
      });
    });


    describe('cleanDrag', function () {
      it('should called the unbind method 4 times', function () {
        var elm = createElement('<div data-swr-draggable="true" class="swr-drag-start" data-item-id="123"  style="top:50px; left:10px;" />');
        spyOn(elm, 'unbind');
        controller.cleanDrag();
        expect(elm.unbind.calls.length).toEqual(5);
      });

      it('should called the unbind method with the good params', function () {
        var elm = createElement('<div data-swr-draggable="true" class="swr-drag-start" data-item-id="123"  style="top:50px; left:10px;" />');
        spyOn(elm, 'unbind');
        controller.cleanDrag();
        expect(elm.unbind).toHaveBeenCalledWith('draginit', controller.dragInit);
        expect(elm.unbind).toHaveBeenCalledWith('dragstart', controller.dragStart);
        expect(elm.unbind).toHaveBeenCalledWith('drag', controller.drag);
        expect(elm.unbind).toHaveBeenCalledWith('dragend', controller.dragEnd);
        expect(elm.unbind).toHaveBeenCalledWith('$destroy', controller.cleanDrag);
      });
    });
  });


  describe('swrDropController Controller', function () {

    function createElement(element) {
      var elm = angular.element(element);
      // instantiate the controller
      controller = $controller('swrDropController', {$rootScope: rootScope, $scope: scopeController, $element: elm, swrDragAndDropService: swrDragAndDropService});
      return elm;
    }

    describe('init', function () {
      it('should call the drop methods', function () {
        var elm = createElement('<div data-swr-drop-target="true"/>');
        spyOn(elm, 'drop');
        controller.init();
        expect(elm.drop.calls.length).toBe(3);
        expect(elm.drop).toHaveBeenCalled();
      });

      it('should call the on methods', function () {
        var elm = createElement('<div data-swr-drop-target="true"/>');
        spyOn(elm, 'on');
        controller.init();
        expect(elm.on.calls.length).toBe(4);
        expect(elm.on).toHaveBeenCalledWith('$destroy', controller.cleanDrop);
      });

      it('should call the on method 2 times', function () {
        spyOn(rootScope, '$on').andCallThrough();
        createElement('<div data-swr-drop-target="true"/>');
        controller.init();
        expect(rootScope.$on.calls.length).toEqual(2);
        expect(rootScope.$on).toHaveBeenCalledWith('SWR-DRAG-START', controller.onSwrDragStart);
        expect(rootScope.$on).toHaveBeenCalledWith('SWR-DRAG-END', controller.onSwrDragEnd);
      });
    });


    describe('onSwrDragStart and onSwrDragEnd', function () {

      it('should add swr-drop-target to the element', function () {
        var elm = createElement('<div data-swr-drop-target="true"/>');
        controller.init();
        expect(elm.hasClass('swr-drop-target')).toBeFalsy();
        rootScope.$emit('SWR-DRAG-START', elm);
        expect(elm.hasClass('swr-drop-target')).toBeTruthy();
      });

      it('should remove css classes', function () {
        var elm = createElement('<div data-swr-drop-target="true" class="swr-drop-target swr-drop-over"/>');
        controller.init();
        expect(elm.hasClass('swr-drop-target')).toBeTruthy();
        expect(elm.hasClass('swr-drop-over')).toBeTruthy();
        controller.onSwrDragEnd();
        expect(elm.hasClass('swr-drop-target')).toBeFalsy();
        expect(elm.hasClass('swr-drop-over')).toBeFalsy();
      });
    });


    describe('dropStart', function () {

      it('should add swr-drop-over to the element', function () {
        var elm = createElement('<div data-swr-drop-target="true"/>');
        expect(elm.hasClass('swr-drop-over')).toBeFalsy();
        controller.dropStart();
        expect(elm.hasClass('swr-drop-over')).toBeTruthy();
      });
    });

    describe('drop', function () {

      it('should call the method onDrop', function () {
        swrDragAndDropService.addDraggedItem('123');
        swrDragAndDropService.addDraggedItem('456');

        var elm = createElement('<div data-swr-drop-target="true" data-swr-drop-target-on-drop="dropped(droppedItems)"/>');

        scopeController.swrDropTargetOnDrop = function (items) {
          expect(items).toEqual({droppedItems: ['123', '456']});
        };

        spyOn(scopeController, 'swrDropTargetOnDrop').andCallThrough();
        spyOn(swrDragAndDropService, 'getDraggedItems').andCallThrough();
        spyOn(swrDragAndDropService, 'removeAllDraggedItems').andCallThrough();

        controller.drop();

        expect(swrDragAndDropService.getDraggedItems).toHaveBeenCalled();
        expect(scopeController.swrDropTargetOnDrop).toHaveBeenCalled();
        expect(swrDragAndDropService.removeAllDraggedItems).toHaveBeenCalled();
      });

      it('should not call the on drop method', function () {
        var elm = createElement('<div data-swr-drop-target="true" data-swr-drop-target-on-drop="dropped(droppedItems)"/>');
        spyOn(swrDragAndDropService, 'getDraggedItems').andCallThrough();
        controller.drop();
        expect(swrDragAndDropService.getDraggedItems).toHaveBeenCalled();
      });
    });


    describe('dropEnd', function () {

      it('should remove swr-drop-over to the element', function () {
        var elm = createElement('<div data-swr-drop-target="true" class="swr-drop-over"/>');
        expect(elm.hasClass('swr-drop-over')).toBeTruthy();
        controller.dropEnd();
        expect(elm.hasClass('swr-drop-over')).toBeFalsy();
      });
    });


    describe('cleanDrag', function () {
      it('should called the unbind method 5 times', function () {
        var elm = createElement('<div data-swr-draggable="true" class="swr-drag-start" data-item-id="123"  style="top:50px; left:10px;" />');
        spyOn(elm, 'unbind');
        controller.cleanDrop();
        expect(elm.unbind.calls.length).toEqual(5);
      });

      it('should called the unbind method with the good params', function () {
        var elm = createElement('<div data-swr-draggable="true" class="swr-drag-start" data-item-id="123"  style="top:50px; left:10px;" />');
        spyOn(elm, 'unbind');
        controller.cleanDrop();
        expect(elm.unbind).toHaveBeenCalledWith('dropstart', controller.dropStart);
        expect(elm.unbind).toHaveBeenCalledWith('drop', controller.drop);
        expect(elm.unbind).toHaveBeenCalledWith('dropend', controller.dropEnd);
        expect(elm.unbind).toHaveBeenCalledWith('SWR-DRAG-START');
        expect(elm.unbind).toHaveBeenCalledWith('SWR-DRAG-END');
      });
    });
  });

  /*
   describe('Select Div Directives', function () {

   var elm;

   function createNewElement(inputElement){
   elm = angular.element(inputElement);
   $compile(elm)(rootScope);
   rootScope.$digest();

   // instantiate the controller
   controller = $controller('swrDragController', {$rootScope: rootScope, $scope: scopeController, $element: elm, swrDragAndDropService: swrDragAndDropService});

   return elm;
   }

   it('should add the three CSS classes and set an attribute', function () {

   elm = angular.element('<div data-swr-draggable="true" />');

   controller = $controller('swrDragController', {$rootScope: rootScope, $scope: scopeController, $element: elm, swrDragAndDropService: swrDragAndDropService});

   //createNewElement('<div data-swr-draggable="true" />');

   spyOn(controller, 'init');


   $compile(elm)(rootScope);
   rootScope.$digest();

   expect(controller.init).toHaveBeenCalled();
   });

   });*/

});