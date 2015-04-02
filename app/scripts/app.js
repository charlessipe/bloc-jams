
 //require('./landing');
 //require('./album');
 //require('./collection');
 //require('./profile');
 
// Example album
var albumPicasso = {
  name: 'The Colors',
  artist: 'Pablo Picasso',
  label: 'Cubism',
  year: '1881',
  albumArtUrl: '/images/album-placeholder.png',
 
  songs: [
      { name: 'Blue', length: '4:26' },
      { name: 'Green', length: '3:14' },
      { name: 'Red', length: '5:01' },
      { name: 'Pink', length: '3:21'},
      { name: 'Magenta', length: '2:15'}
    ]
};


blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.controller('Collection.controller', ['$scope', function($scope) {
  $scope.albums = [];
    for (var i = 0; i < 33; i++) {
      $scope.albums.push(angular.copy(albumPicasso));
    }
}]);


blocJams.config(['$stateProvider', '$locationProvider', function($stateProvider, $locationProvider) {
  $locationProvider.html5Mode(true);

  $stateProvider.state('landing', {
    url: '/',
    controller: 'Landing.controller',
    templateUrl: '/templates/landing.html'
  });

  /*$stateProvider.state('song', {
    url: '/song',
    controller: 'Landing.controller',
    templateUrl: '/templates/song.html'
  }); */

  $stateProvider.state('collection', {
    url: '/collection',
    controller: 'Collection.controller',
    templateUrl: '/templates/collection.html'
  });

 
  $stateProvider.state('album', {
    url: '/album',
    templateUrl: '/templates/album.html',
    controller: 'Album.controller'
  });

}]);

blocJams.controller('Landing.controller', ['$scope', function($scope) {
  $scope.subText = "Turn the music up!";

    $scope.subTextClicked = function() {
      $scope.subText += '!';
  };




$scope.albumURLs = [
  '/images/album-placeholders/album-1.jpg',
  '/images/album-placeholders/album-2.jpg',
  '/images/album-placeholders/album-3.jpg',
  '/images/album-placeholders/album-4.jpg',
  '/images/album-placeholders/album-5.jpg',
  '/images/album-placeholders/album-6.jpg',
  '/images/album-placeholders/album-7.jpg',
  '/images/album-placeholders/album-8.jpg',
  '/images/album-placeholders/album-9.jpg',
  ];

 }]);

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.album = angular.copy(albumPicasso);

    var hoveredSong = null;
 
    $scope.onHoverSong = function(song) {
      hoveredSong = song;
    };
 
    $scope.offHoverSong = function(song) {
     hoveredSong = null;
    };

      $scope.getSongState = function(song) {
        if (song === SongPlayer.currentSong && SongPlayer.playing) {
          return 'playing';
      }
      else if (song === hoveredSong) {
        return 'hovered';
      }
      return 'default';
    };

      $scope.playSong = function(song) {
        SongPlayer.setSong($scope.album, song);
        SongPlayer.play();
      };
 
      $scope.pauseSong = function(song) {
        SongPlayer.pause();
      };

}]);

// Use UI Router for playbar
/*
blocJams.config(function($stateProvider) {
  $stateProvider
    .state('playbar', {
      url: "/player_bar.html",
      views: {
        "playbar": { template: "/templates/player_bar.html" }
      }
    })
    .state('route1', {
      url: "/route1",
      views: {
        "viewA": { template: "route1.viewA" },
        "viewB": { template: "route1.viewB" }
      }
    })
    .state('route2', {
      url: "/route2",
      views: {
        "viewA": { template: "route2.viewA" },
        "viewB": { template: "route2.viewB" }
      }
    })
   
});

*/

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.songPlayer = SongPlayer;
}]);

 
blocJams.service('SongPlayer', function() {
  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,
 
    play: function() {
      this.playing = true;
    },
    pause: function() {
      this.playing = false;
    },
    setSong: function(album, song) {
      this.currentAlbum = album;
      this.currentSong = song;
    }
  };
});






