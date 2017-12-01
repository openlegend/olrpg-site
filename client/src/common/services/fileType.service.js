'use strict';

import angular from 'angular';

const fileTypeModule = angular.module('fileType.js', []);

fileTypeModule.factory('FileType', function () {
    const map = {
      'folder': {
        name: 'Folder',
        icon: 'folder'
      },
      'image': {
        name: 'Image',
        icon: 'file-image'
      },
      'video': {
        name: 'Video',
        icon: 'file-video'
      },
      'pdf': {
        name: 'PDF',
        icon: 'file-pdf'
      },
      'file': {
        name: 'File',
        icon: 'file'
      }
    };

    const getType = function (item) {
      if ( item.primaryType === 'scala:folder' ) {
        return map.folder;
      }
      if ( item.primaryType === 'scala:file' ) {
        if ( /\.jpg|\.jpeg|\.png|\.gif/.test( item.name ) ) {
          return map.image;
        } else if ( /\.mpg|\.mpeg|\.mp4|\.mov/.test( item.name ) ) {
          return map.video;
        } else if ( /\.pdf/.test( item.name ) ) {
          return map.pdf;
        } else {
          return map.file;
        }
      }

    }

    return {
      map,
      getType,
      getName (item) {
        return getType(item).name;
      },
      getIcon (item) {
        return getType(item).icon;
      }
    };
  });

export default fileTypeModule;
