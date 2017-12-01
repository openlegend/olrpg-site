'use strict';

export default class MainwrapCtrl {
  constructor($scope, $timeout, $state, $mdMedia, $mdSidenav, $sce, Auth, Config) {

    this.$scope = $scope;
    this.$state = $state;
    this.$timeout = $timeout;
    this.$mdMedia = $mdMedia;
    this.$mdSidenav = $mdSidenav;

    if ( $state.current.name === 'core' ) {
      this.$scope.chapterListExpanded = true;
    }

    this.Auth = Auth;
    this.Config = Config;
    this.Date = Date;

    this.profileSubnavOpen = false;

    $timeout( () => {
      if ( _.has( window, 'twttr' ) ) twttr.widgets.load();
    });
  }

  toggleSidenav (menuId) {
    this.$mdSidenav(menuId).toggle();
  }

  navIsOpen (menuId) {
    return this.$mdSidenav(menuId).isOpen();
  };

}
