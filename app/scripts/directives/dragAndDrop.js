'use strict';

angular.module('septWebRadioDirectives');

angular.module('septWebRadioDirectives')
  .directive('swrDraggable', ['$rootScope', 'uuid',
    function ($rootScope, uuid) {
      return {
        restrict: 'A',
        link: function (scope, el) {
          var element = angular.element(el);
          element.attr('draggable', 'true');
          var id = element.attr('id');
          if (!id) {
            id = uuid.new();
            element.attr('id', id);
          }

          el.bind('dragstart', function (e) {
            e.dataTransfer = e.originalEvent.dataTransfer;
            e.dataTransfer.setData('text', id);

            angular.element(e.target).addClass('swr-start');

            $rootScope.$emit('SWR-DRAG-START');
          });

          el.bind('dragend', function (e) {
            angular.element(e.target).removeClass('swr-start');
            $rootScope.$emit('SWR-DRAG-END', e);
          });
        }
      };
    }]
  );

angular.module('septWebRadioDirectives')
  .directive('swrDropTarget', ['$rootScope', 'uuid',
    function ($rootScope, uuid) {
      return {
        restrict: 'A',
        scope: {
          onDrop: '&'
        },
        link: function (scope, el) {
          var element = angular.element(el);
          var id = element.attr('id');
          if (!id) {
            id = uuid.new();
            element.attr('id', id);
          }

          el.bind('dragover', function (e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            e.dataTransfer = e.originalEvent.dataTransfer;
            e.dataTransfer.dropEffect = 'copy';  // See the section on the DataTransfer object.
            return false;
          });

          el.bind('dragenter', function (e) {
            // this / e.target is the current hover target.
            angular.element(e.target).addClass('swr-over');
          });

          el.bind('dragleave', function (e) {
            angular.element(e.target).removeClass('swr-over');  // this / e.target is previous target element.
          });

          el.bind('drop', function (e) {
            if (e.preventDefault) {
              e.preventDefault(); // Necessary. Allows us to drop.
            }

            if (e.stopPropogation) {
              e.stopPropogation(); // Necessary. Allows us to drop.
            }

            e.dataTransfer = e.originalEvent.dataTransfer;
            var data = e.dataTransfer.getData('text');
            var dest = document.getElementById(id);
            var src = document.getElementById(data);

            scope.onDrop({dragEl: src, dropEl: dest});
          });

          $rootScope.$on('SWR-DRAG-START', function () {
            var el = document.getElementById(id);
            angular.element(el).addClass('swr-target');
          });

          $rootScope.$on('SWR-DRAG-END', function () {
            var el = document.getElementById(id);
            var element = angular.element(el);
            element.removeClass('swr-target');
            element.removeClass('swr-over');
          });
        }
      };
    }]
  );