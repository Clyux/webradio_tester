'use strict';

describe('Page', function () {
  beforeEach(module('septWebRadioFactories'));

  var Page, scope;
  var defaultTitle = 'Sept Web Radio';

  beforeEach(inject(function ($rootScope, _Page_) {
    scope = $rootScope.$new();
    Page = _Page_;
  }));

  describe('title', function () {
    it('should return the default title', inject(function () {
      var title = Page.title();
      expect(title).toEqual(defaultTitle);
    }));

    it('should return the correct title', inject(function () {
      Page.setTitle('new title');
      var title = Page.title();
      expect(title).toEqual(defaultTitle + ' - new title');
    }));
  });


  describe('setTitle', function () {
    it('should set the title to the default one', inject(function () {
      Page.setTitle();
      var title = Page.title();
      expect(title).toEqual(defaultTitle);
    }));

    it('should set the title with the new one', inject(function () {
      Page.setTitle('my title');
      var title = Page.title();
      expect(title).toEqual(defaultTitle + ' - my title');
    }));
  });

});