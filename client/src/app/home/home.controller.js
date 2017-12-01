'use strict';
import 'lodash';

import angular from 'angular';

class HomeCtrl {

  // called once when the class is instantiated
  constructor ($scope, $mdMedia, $http, Config) {
    this.$scope = $scope;
    this.$mdMedia = $mdMedia;
    this.$http = $http;
    this.Config = Config;

    (function() {
      var script = document.createElement('script');
      script.src = 'https://backerkit.com/assets/preorders.js';
      script.async = true;
      var entry = document.getElementsByTagName('script')[0];
      entry.parentNode.insertBefore(script, entry);
    })();

    this.$http.get('http://blog.openlegendrpg.com/wp-json/wp/v2/posts?per_page=5&_embed=wp:featuredmedia')
    .then( res => {
      res.data.map( item => {
        if ( _.get( item, 'post.excerpt.rendered' ) ) {
          item.post.excerpt.rendered = item.post.excerpt.rendered + `<a href="${ item.link }">Read On &rarr;</a>`;
        }
        return item;
      });
      this.blogPosts = res.data;
    });

  }

  // public class methods
  deleteThisFunction () {
    // does nothing
  }
}

export default HomeCtrl;

