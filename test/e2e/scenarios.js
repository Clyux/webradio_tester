'use strict';

/* http://docs.angularjs.org/guide/dev_guide.e2e-testing */

describe('my app', function() {

  beforeEach(function() {
    browser().navigateTo('/');
  });

  it('should automatically redirect to /index when location hash/fragment is empty', function() {
    expect(browser().location().url()).toBe("/index");
  });

  describe('index', function() {

    beforeEach(function() {
      browser().navigateTo('/index');
    });

    it('should render index when user navigates to /index', function() {
      expect(element('[ng-view] h1:first').text()).toMatch(/play/);
    });

  });

  describe('stage', function() {

    beforeEach(function() {
      browser().navigateTo('/stage');
    });

    it('should render stage when user navigates to /stage', function() {
      var elmt = element('[ng-view] img:first');
      expect(elmt.attr('src')).toMatch(/images\/sept.png/);
    });
  });
});