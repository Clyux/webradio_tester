'use strict';

describe('swrSound Cloud Player Directives', function () {
  beforeEach(module('septWebRadioApp'));

  var elm, scopeController, $compile;
  var defaultInputElement = '<iframe id="soundcloud-player" swr-soundcloud-player></iframe>';

    beforeEach(inject(function ($rootScope, _$compile_) {
    scopeController = $rootScope.$new();
    $compile = _$compile_;
  }));

  function createNewElement(inputElement){
    elm = angular.element(inputElement);
    $compile(elm)(scopeController);
  }

  it('should have the correct url', function () {
    spyOn(SC, 'Widget');
    createNewElement(defaultInputElement);
    var widgetUrl = 'https://soundcloud.com/lapause/sets/la-pause-playlist-21&amp;auto_play=true&amp;download=true&amp;show_comments=false';
    var sourceUrl = location.protocol + '//w.soundcloud.com/player/?url=' + widgetUrl;
    expect(elm.attr('src')).toBe(sourceUrl);
  });

  it('should Call the widget with the correct id', function () {
    spyOn(SC, 'Widget');
    expect(SC.Widget).not.toHaveBeenCalled();
    createNewElement(defaultInputElement);
    expect(SC.Widget).toHaveBeenCalledWith('soundcloud-player');

    createNewElement('<iframe id="soundcloud-player-test" swr-soundcloud-player></iframe>');
    expect(SC.Widget).toHaveBeenCalledWith('soundcloud-player-test');
  });
});