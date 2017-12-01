import angular from 'angular';

const dragIndicatorDirective = angular.module('dragIndicator.js', []);

dragIndicatorDirective.directive('dragIndicator', function () {

  return {
    restrict: 'EA',
    controller: function ($scope, $document, $element) {

      const dropTarget = $element;
      const $body = $document.find('body');
      let showDrag = false;
      let timeout = -1;
      // $body.addClass('file-dragging');
      $body.bind('dragstart dragenter', function () {
          dropTarget.addClass('dragging-target');
          $body.addClass('file-dragging');
          showDrag = true;
      });
      $body.bind('dragover', function(){
          showDrag = true;
      });
      $body.bind('dragleave drop', function () {
        showDrag = false;
        clearTimeout( timeout );
        // remove the dragging classes on a timeout to prevent UI flicker
        timeout = setTimeout( function(){
          if( !showDrag ){
            dropTarget.removeClass('dragging-target');
            $body.removeClass('file-dragging');
          }
        }, 100 );
      });

      $scope.$on('$destroy', function () {
        // prevent memory leaks by cleaning up event bindings
        $body.unbind('dragenter dragover dragleave drop');
      });

    }
  };

});

export default dragIndicatorDirective;
