'use strict';

describe('swrNotification', function () {
  beforeEach(module('septWebRadioFactories'));

  var swrGmailNotify, $compile, $timeout, scope;

  beforeEach(inject(function (_swrGmailNotify_, _$compile_, $injector, $rootScope) {
    swrGmailNotify = _swrGmailNotify_;
    $compile = _$compile_;
    $timeout = $injector.get('$timeout');
    scope = $rootScope.$new();
  }));

  describe('success', function () {
    it('should put the element to the messageElements list', function () {
      spyOn(swrGmailNotify.messageElements, 'push');
      var templateElement = swrGmailNotify.message('message');
      expect(swrGmailNotify.messageElements.push).toHaveBeenCalledWith(templateElement);
    });

    it('should call the remove method', function () {
      var templateElement = swrGmailNotify.message('message');
      spyOn(templateElement, 'remove');
      var event = {originalEvent: {propertyName: 'opacity'}, type: "transitionend"};
      templateElement.trigger(event);
      expect(templateElement.remove).toHaveBeenCalled();
    });

    it('should Not call the remove method', function () {
      var templateElement = swrGmailNotify.message('message');
      spyOn(templateElement, 'remove');
      var event = {originalEvent: {propertyName: 'not-opacity'}, type: "transitionend"};
      templateElement.trigger(event);
      expect(templateElement.remove).not.toHaveBeenCalled();
    });

    it('should splice the element', function () {
      var templateElement = swrGmailNotify.message('message');
      spyOn(templateElement, 'splice');
      var event = {originalEvent: {propertyName: 'opacity'}, type: "transitionend"};
      templateElement.trigger(event);
      expect(templateElement.splice).toHaveBeenCalledWith(0, 1);
    });

    it('should set the css property with the default top value', function () {
      swrGmailNotify.startTop = 50;
      var templateElement = swrGmailNotify.message('message');
      spyOn(templateElement, 'css');
      $timeout.flush();
      expect(templateElement.css).toHaveBeenCalledWith('top', '50px');
    });

    it('should set the css property with the top value provided', function () {
      var templateElement = swrGmailNotify.message('message');
      spyOn(templateElement, 'css').andCallThrough();
      $timeout.flush();
      expect(templateElement.css.calls.length).toBe(3);
      expect(templateElement.css.calls[0].args).toEqual(['top', '10px']);
      expect(templateElement.css.calls[1].args).toEqual(['opacity']);
      expect(templateElement.css.calls[2].args).toEqual(['opacity', 0]);
    });

    it('should not set the opacity property to 0', function () {
      var templateElement = swrGmailNotify.message('message');
      templateElement.css('opacity', 0);
      spyOn(templateElement, 'css').andCallThrough();
      $timeout.flush();
      expect(templateElement.css.calls.length).toBe(2);
      expect(templateElement.css.calls[0].args).toEqual(['top', '10px']);
      expect(templateElement.css.calls[1].args).toEqual(['opacity']);
    });
  });
});