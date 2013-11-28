'use strict';

describe('Utilities', function () {
  beforeEach(module('septWebRadioApp'));

  var utilities, scope;

  beforeEach(inject(function ($rootScope, _utilities_) {
    scope = $rootScope.$new();
    utilities = _utilities_;
  }));

  describe('removeObjectById', function () {

    it('should return the same object than provided', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];
      var listDest = utilities.removeObjectById(listSource, 0);
      expect(listDest).toBe(listSource);
    }));

    it('should have a returned size to 3', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];
      var listDest = [];

      expect(listSource.length).toBe(4);
      expect(listDest.length).toBe(0);

      listDest = utilities.removeObjectById(listSource, 0);

      expect(listSource.length).toBe(3);
      expect(listDest.length).toBe(3);

      expect(listDest).toEqual([{id: 1}, {id: 2}, {id: 3}]);
    }));

    it('should remove the first item', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];

      var listDest = utilities.removeObjectById(listSource, 0);
      expect(listDest).toEqual([{id: 1}, {id: 2}, {id: 3}]);
    }));

    it('should remove the last item', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];
      var listDest = utilities.removeObjectById(listSource, 3);
      expect(listDest).toEqual([{id: 0}, {id: 1}, {id: 2}]);
    }));

    it('should not remove items', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];

      var listDest = utilities.removeObjectById(listSource, 5);
      expect(listDest).toEqual([{id: 0}, {id: 1}, {id: 2}, {id: 3}]);
    }));
  });


  describe('removeObjectByAttribute', function () {

    it('should return the same object than provided', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];
      var listDest = utilities.removeObjectByAttribute(listSource, 0, 'attributeName');
      expect(listDest).toBe(listSource);
    }));

    it('should have a returned size to 3', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];

      var listDest = [];

      expect(listSource.length).toBe(4);
      expect(listDest.length).toBe(0);

      listDest = utilities.removeObjectByAttribute(listSource, 0, 'attributeName');

      expect(listSource.length).toBe(3);
      expect(listDest.length).toBe(3);

      expect(listDest).toEqual([{attributeName: 1}, {attributeName: 2}, {attributeName: 3}]);
    }));

    it('should remove the first item', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];

      var listDest = utilities.removeObjectByAttribute(listSource, 0, 'attributeName');
      expect(listDest).toEqual([{attributeName: 1}, {attributeName: 2}, {attributeName: 3}]);
    }));

    it('should remove the last item', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];

      var listDest = utilities.removeObjectByAttribute(listSource, 3, 'attributeName');
      expect(listDest).toEqual([{attributeName: 0}, {attributeName: 1}, {attributeName: 2}]);
    }));

    it('should not remove items', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];

      var listDest = utilities.removeObjectByAttribute(listSource, 5, 'attributeName');
      expect(listDest).toEqual([{attributeName: 0}, {attributeName: 1}, {attributeName: 2}, {attributeName: 3}]);
    }));
  });


  describe('listContainsAttribute', function () {

    it('should return the first object', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];
      var item = utilities.listContainsAttribute(listSource, 0, 'attributeName');
      expect(item).toEqual({attributeName: 0});
    }));

    it('should return the last object', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];
      var item = utilities.listContainsAttribute(listSource, 3, 'attributeName');
      expect(item).toEqual({attributeName: 3});
    }));

    it('should return undefined', inject(function () {
      var listSource = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];
      var item = utilities.listContainsAttribute(listSource, 5, 'attributeName');
      expect(item).toBeUndefined()
    }));
  });



  describe('listContainsId', function () {

    it('should return the first object', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];
      var item = utilities.listContainsId(listSource, 0);
      expect(item).toEqual({id: 0});
    }));

    it('should return the last object', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];
      var item = utilities.listContainsId(listSource, 3);
      expect(item).toEqual({id: 3});
    }));

    it('should return undefined', inject(function () {
      var listSource = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];
      var item = utilities.listContainsId(listSource, 5);
      expect(item).toBeUndefined()
    }));
  });


  describe('unionWithAttribute', function () {

    it('should union the two lists', inject(function () {
      var listFrom = [
        {attributeName: 0},
        {attributeName: 1},
        {attributeName: 2},
        {attributeName: 3}
      ];

      var listTo = [
        {attributeName: 4},
        {attributeName: 1},
        {attributeName: 5},
        {attributeName: 6}
      ];

      var newList = utilities.unionWithAttribute(listFrom, listTo, 'attributeName');
      expect(newList).toEqual([{attributeName: 1}, {attributeName: 4}, {attributeName: 5}, {attributeName: 6}]);
    }));

    it('should not merge the two lists', inject(function () {
      var listFrom = [
      ];

      var listTo = [
        {attributeName: 4},
        {attributeName: 1},
        {attributeName: 5},
        {attributeName: 6}
      ];

      var newList = utilities.unionWithAttribute(listFrom, listTo, 'attributeName');
      expect(newList).toEqual([{attributeName: 4}, {attributeName: 1}, {attributeName: 5}, {attributeName: 6}]);
    }));
  });


  describe('unionWithId', function () {

    it('should union the two lists', inject(function () {
      var listFrom = [
        {id: 0},
        {id: 1},
        {id: 2},
        {id: 3}
      ];

      var listTo = [
        {id: 4},
        {id: 1},
        {id: 5},
        {id: 6}
      ];

      var newList = utilities.unionWithId(listFrom, listTo, 'id');
      expect(newList).toEqual([{id: 1}, {id: 4}, {id: 5}, {id: 6}]);
    }));

    it('should not merge the two lists', inject(function () {
      var listFrom = [
      ];

      var listTo = [
        {id: 4},
        {id: 1},
        {id: 5},
        {id: 6}
      ];

      var newList = utilities.unionWithId(listFrom, listTo);
      expect(newList).toEqual([{id: 4}, {id: 1}, {id: 5}, {id: 6}]);
    }));
  });

});