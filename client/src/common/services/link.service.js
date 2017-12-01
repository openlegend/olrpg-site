'use strict';

import angular from 'angular';
import configService from 'config/config';

const linkServiceModule = angular.module('link.service.js', [
  configService
]);

class Link {
  constructor (Config, $mdDialog, $log) {
    this.Config = Config;
    this.$mdDialog = $mdDialog;
    this.$log = $log;
  }

  nameToUrlPath (name) {
    return name.split('(')[0].trim().split(' ').join('_').toLowerCase();
  }

  copyLinkToClip(items, path) {

    let urlString = '';
    items.forEach((item, i) => {
      if (i > 0) {
        urlString += ',';
      }

      urlString += `${ this.Config.urlBase }${ path }/${  this.nameToUrlPath(item.name) }`;
    });

    if (document.queryCommandSupported('copy')) {

      const copyTextToClipboard = function (text) {
        // create a temporary textarea to give it focus and then copy to clipboard
        let textArea = document.createElement('textarea');

        // Place in top-left corner of screen regardless of scroll position.
        textArea.style.position = 'fixed';
        textArea.style.top = 0;
        textArea.style.left = 0;

        // Ensure it has a small width and height. Setting to 1px / 1em
        // doesn't work as this gives a negative w/h on some browsers.
        textArea.style.width = '2em';
        textArea.style.height = '2em';

        // We don't need padding, reducing the size if it does flash render.
        textArea.style.padding = 0;

        // Clean up any borders.
        textArea.style.border = 'none';
        textArea.style.outline = 'none';
        textArea.style.boxShadow = 'none';

        // Avoid flash of white box if rendered for any reason.
        textArea.style.background = 'transparent';

        textArea.value = text;

        document.body.appendChild(textArea);

        textArea.select();

        try {
          const successful = document.execCommand('copy');
          const msg = successful ? 'successful' : 'unsuccessful';
          this.$log.info('Copying text command was ' + msg);
        } catch (err) {
          this.$log.info('Unable to copy');
        }

        document.body.removeChild(textArea);

      };

      copyTextToClipboard.bind(this)(urlString);

    } else {
      this.$mdDialog.show(
        this.$mdDialog.alert()
          .clickOutsideToClose(true)
          .title('Cannot Copy to Clipboard')
          .textContent('Your browser doesn\'t support copying links to your system clipboard.')
          .ariaLabel('Cannot Copy to Clipboard')
          .ok('Got it!')
      );
      this.$log.info(urlString)
    } // end conditional for modal for browsers without clipboard copy
  }

}

linkServiceModule.service('Link', Link);

export default linkServiceModule;
