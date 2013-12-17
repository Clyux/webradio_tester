'use strict';

describe('swrNotification', function () {
  beforeEach(module('septWebRadioFactories'));

  var swrNotification, swrGmailNotify;

  beforeEach(inject(function (_swrNotification_, _swrGmailNotify_) {
    swrNotification = _swrNotification_;
    swrGmailNotify = _swrGmailNotify_;
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
});