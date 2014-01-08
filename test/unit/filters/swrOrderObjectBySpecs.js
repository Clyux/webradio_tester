'use strict';

describe('Filters', function () {
  beforeEach(module('septWebRadioFilters'));

  var swrOrderObjectBy;

  beforeEach(inject(function ($filter) {
    swrOrderObjectBy = $filter('swrOrderObjectBy');
  }));

  describe('swrOrderObjectBy', function () {
    it('should return a new array', inject(function () {
      var list = [];
      var newArray = swrOrderObjectBy(list, 'pos');
      expect(newArray).toEqual([]);
    }));

    it('should return the input', inject(function () {
      var list = undefined;
      var ret = swrOrderObjectBy(list, 'pos');
      expect(ret).toBe(list);
    }));

    it('should return the input if it s a string', inject(function () {
      var list = 'test';
      var ret = swrOrderObjectBy(list, 'pos');
      expect(ret).toBe(list);
    }));

    it('should return the same position', inject(function () {
      var list = [
        {pos: 0},
        {pos: 1},
        {pos: 2}
      ];
      var newArray = swrOrderObjectBy(list, 'pos');
      expect(newArray).toEqual([
        {pos: 0},
        {pos: 1},
        {pos: 2}
      ]);
    }));

    it('should sort the positions', inject(function () {
      var list = [
        {pos: 1},
        {pos: 0},
        {pos: 2}
      ];
      var newArray = swrOrderObjectBy(list, 'pos');
      expect(newArray).toEqual([
        {pos: 0},
        {pos: 1},
        {pos: 2}
      ]);
    }));

    it('should sort the positions', inject(function () {
      var list = [
        {id:1, pos: 1},
        {id:0, pos: 0},
        {id:2, pos: undefined}
      ];
      var newArray = swrOrderObjectBy(list, 'pos');
      expect(newArray).toEqual([
        {id:0, pos: 0},
        {id:1, pos: 1},
        {id:2, pos: undefined}
      ]);
    }));
  });
});