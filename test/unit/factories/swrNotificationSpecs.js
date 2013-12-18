'use strict';

describe('swrNotification', function () {
  beforeEach(module('septWebRadioFactories'));

  var swrNotification, swrGmailNotify, $timeout;

  beforeEach(inject(function (_swrNotification_, _swrGmailNotify_, $injector) {
    swrNotification = _swrNotification_;
    swrGmailNotify = _swrGmailNotify_;
    $timeout = $injector.get('$timeout');
  }));

  describe('success', function () {
    it('should not call the success method', inject(function () {
      spyOn(alertify, 'success');
      swrNotification.success();
      expect(alertify.success).not.toHaveBeenCalled();
    }));

    it('should call the success method', inject(function () {
      spyOn(alertify, 'success');
      swrNotification.success('Message success');
      expect(alertify.success).toHaveBeenCalledWith('Message success');
    }));
  });


  describe('info', function () {
    it('should not call the log method', inject(function () {
      spyOn(alertify, 'log');
      swrNotification.info();
      expect(alertify.log).not.toHaveBeenCalled();
    }));

    it('should call the log method', inject(function () {
      spyOn(alertify, 'log');
      swrNotification.info('Message info');
      expect(alertify.log).toHaveBeenCalledWith('Message info');
    }));
  });


  describe('error', function () {
    it('should not call the error method', inject(function () {
      spyOn(alertify, 'error');
      swrNotification.error();
      expect(alertify.error).not.toHaveBeenCalled();
    }));

    it('should call the error method', inject(function () {
      spyOn(alertify, 'error');
      swrNotification.error('Message error');
      expect(alertify.error).toHaveBeenCalledWith('Message error');
    }));
  });


  describe('message', function () {
    it('should not call the message method', inject(function () {
      spyOn(swrGmailNotify, 'message');
      swrNotification.message();
      expect(swrGmailNotify.message).not.toHaveBeenCalled();
    }));

    it('should call the message method', inject(function () {
      spyOn(swrGmailNotify, 'message');
      swrNotification.message('Message message');
      expect(swrGmailNotify.message).toHaveBeenCalledWith('Message message');
    }));
  });


  describe('pushMessage', function () {
    it('should call the function and add the message to the list', inject(function () {
      var spy = jasmine.createSpy('toCall');
      var list = [];
      swrNotification.pushMessage(spy, list, 'a');
      expect(spy).toHaveBeenCalledWith('a');
      expect(list).toEqual(['a']);
    }));

    it('should remove the item from the list', inject(function () {
      var spy = jasmine.createSpy('toCall');
      var list = [];
      swrNotification.pushMessage(spy, list, 'a');
      expect(list).toEqual(['a']);
      $timeout.flush(4000);
      expect(list).toEqual([]);
    }));

    it('should do nothing when the item is presents', inject(function () {
      var spy = jasmine.createSpy('toCall');
      var list = ['a'];
      swrNotification.pushMessage(spy, list, 'a');
      expect(list).toEqual(['a']);
      expect(spy).not.toHaveBeenCalled();
    }));
  });
});