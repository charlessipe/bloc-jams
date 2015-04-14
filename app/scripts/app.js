
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
      { name: 'Blue', length: 163.38, audioUrl: '/music/placeholders/blue' },
      { name: 'Green', length: 105.66, audioUrl: '/music/placeholders/green' },
      { name: 'Red', length: 270.14, audioUrl: '/music/placeholders/red' },
      { name: 'Pink', length: 154.81, audioUrl: '/music/placeholders/pink' },
      { name: 'Magenta', length: 375.92, audioUrl: '/music/placeholders/magenta' }
    ]
};


blocJams = angular.module('BlocJams', ['ui.router']);

blocJams.controller('Collection.controller', ['$scope', 'SongPlayer', function($scope, SongPlayer) {
  $scope.albums = [];
    for (var i = 0; i < 33; i++) {
      $scope.albums.push(angular.copy(albumPicasso)); 
    }

      $scope.playAlbum = function(album) {  // Start playing first song in album by clicking on overlays on the Collection page
        SongPlayer.setSong(album, album.songs[0]); // Targets first song in the array.
      }

  //ConsoleLogger.log();

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

blocJams.controller('Album.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
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
      };
 
      $scope.pauseSong = function(song) {
        SongPlayer.pause();
      };

      //ConsoleLogger.log();
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
});

*/

blocJams.controller('PlayerBar.controller', ['$scope', 'SongPlayer', 'ConsoleLogger', function($scope, SongPlayer, ConsoleLogger) {
  $scope.songPlayer = SongPlayer;

    SongPlayer.onTimeUpdate(function(event, time) {
      $scope.$apply(function(){
        $scope.playTime = time;
      });
    });

  //ConsoleLogger.log();

}]);

 
blocJams.service('SongPlayer', ['$rootScope', function($rootScope) {
  var currentSoundFile = null;
  var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
  };

  return {
    currentSong: null,
    currentAlbum: null,
    playing: false,
 
    play: function() {
      this.playing = true;
        currentSoundFile.play();
    },
    pause: function() {
      this.playing = false;
        currentSoundFile.pause();
    },
    next: function() {
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex++;
      if (currentTrackIndex >= this.currentAlbum.songs.length) {
        currentTrackIndex = 0;
      }
        var song = this.currentAlbum.songs[currentTrackIndex];
        this.setSong(this.currentAlbum, song);
      //this.currentSong = this.currentAlbum.songs[currentTrackIndex];
    },
    previous: function() { // this function is called in player_bar.html
      var currentTrackIndex = trackIndex(this.currentAlbum, this.currentSong);
      currentTrackIndex--;
      if (currentTrackIndex < 0) {
        currentTrackIndex = this.currentAlbum.songs.length - 1;
      }
        var song = this.currentAlbum.songs[currentTrackIndex];
        this.setSong(this.currentAlbum, song);
      //this.currentSong = this.currentAlbum.songs[currentTrackIndex];
    },

    seek: function(time) {
      // Checks to make sure that a sound file is playing before seeking.
      if(currentSoundFile) {
        // Uses a Buzz method to set the time of the song.
        currentSoundFile.setTime(time);
      }
    },

      onTimeUpdate: function(callback) {
        return $rootScope.$on('sound:timeupdate', callback); // Adding this method will allow us to execute a callback on every time update.
      },

    setSong: function(album, song) {
        if (currentSoundFile) {
          currentSoundFile.stop();  
        }
      this.currentAlbum = album;
      this.currentSong = song;

        currentSoundFile = new buzz.sound(song.audioUrl, {
          formats: [ "mp3" ],
          preload: true
        });

        currentSoundFile.bind('timeupdate', function(e){
          $rootScope.$broadcast('sound:timeupdate', this.getTime());
        });

        this.play();
    }
  };
}]);

blocJams.service('ConsoleLogger', function() {
  console.log("Hello Earth");
});




blocJams.directive('slider', ['$document', function($document){

/*
  var updateSeekPercentage = function($seekBar, event) {
    var barWidth = $seekBar.width();
    var offsetX =  event.pageX - $seekBar.offset().left;
 
    var offsetXPercent = (offsetX  / $seekBar.width()) * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
 
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
  }
*/

  var numberFromValue = function(value, defaultValue) {
    if (typeof value === 'number') {
      return value;
    }

    if(typeof value === 'undefined') {
      return defaultValue;
    }

    if(typeof value === 'string') {
      return Number(value);
    }

  }
 
  return {
    templateUrl: '/templates/directives/slider.html',
    replace: true,
    restrict: 'E',
      //scope: {}, // Creates a scope
      scope: {  // makes directive treat the onChange attribute as code to be evaluated
        onChange: '&'
      },
    link: function(scope, element, attributes) {
      // These values represent the progress into the song/volume bar, and its max value.
      // For now, we're supplying arbitrary initial and max values.
      scope.value = 0;
      scope.max = 100; // default max
    var $seekBar = $(element); // sets the seekbar variable to $(element)
      console.log(attributes);
      attributes.$observe('value', function(newValue) {
        scope.value = numberFromValue(newValue, 0); // varible that holds position of thumb as a percent
      });

      attributes.$observe('max', function(newValue) {
        scope.max = numberFromValue(newValue, 100) || 100;
      });

      var percentString = function () {   // Calculate the position
        //var percent = Number(scope.value) / Number(scope.max) * 100;
        var value = scope.value || 0;
        var max = scope.max || 100;
        percent = value / max * 100;
        return percent + "%"; 
      }

      scope.fillStyle = function() {
        return {width: percentString()};
      }

      scope.thumbStyle = function() {
        return {left: percentString()};
      }

      scope.onClickSlider = function(event) {  // Function to change the slider location
        var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
        scope.value = percent * scope.max;
          notifyCallback(scope.value); // callback to notify us of changes to the slider position
      }

      var calculateSliderPercentFromMouseEvent = function($slider, event) {  // Function to determine slider location where the event occured
        var offsetX = event.pageX - $slider.offset().left; // Distace from left
        var sliderWidth = $slider.width(); // Width of slider
        var offsetXPercent = (offsetX / sliderWidth); 
        offsetXPercent = Math.max(0, offsetXPercent);
        offsetXPercent = Math.min(1, offsetXPercent);
        return offsetXPercent;
      }

      scope.trackThumb = function() { // Function for dragging slider
        $document.bind('mousemove.thumb', function(event){
          var percent = calculateSliderPercentFromMouseEvent($seekBar, event);
          scope.$apply(function(){  // $apply looks for changes affected by the function called on the jQuery mousemove event
            scope.value = percent * scope.max;
              notifyCallback(scope.value); // callback to notify us of changes to the slider position
          });  
        });

        //cleanup
        $document.bind('mouseup.thumb', function(){  // $document is an Angular wrapper for the browser's window.document object
          $document.unbind('mousemove.thumb');
          $document.unbind('mouseup.thumb');
        });

      };

      var notifyCallback = function(newValue) {
        if(typeof scope.onChange === 'function') {
          scope.onChange({value: newValue});
        }
      }


 /*
      $seekBar.click(function(event) {
        updateSeekPercentage($seekBar, event);
      });
 
      $seekBar.find('.thumb').mousedown(function(event){
        $seekBar.addClass('no-animate');
 
        $(document).bind('mousemove.thumb', function(event){
          updateSeekPercentage($seekBar, event);
        });
 
        //cleanup
        $(document).bind('mouseup.thumb', function(){
          $seekBar.removeClass('no-animate');
          $(document).unbind('mousemove.thumb');
          $(document).unbind('mouseup.thumb');
        });
 
      }); */
    }
  };
}]);


blocJams.filter('timecode', function(){
  return function(seconds) {
    seconds = Number.parseFloat(seconds);
 
    // Returned when no time is provided.
    if (Number.isNaN(seconds)) {
      return '-:--';
    }
 
    // make it a whole number
    var wholeSeconds = Math.floor(seconds);
 
    var minutes = Math.floor(wholeSeconds / 60);
 
    remainingSeconds = wholeSeconds % 60;
 
    var output = minutes + ':';
 
    // zero pad seconds, so 9 seconds should be :09
    if (remainingSeconds < 10) {
      output += '0';
    }
 
    output += remainingSeconds;
 
    return output;
  }
})



// Create directive clickMe, restricted to an element, creates an alert when clicked

/*
blocJams.directive('clickMe', function() {
  return {
    restrict: "E", 
    link: function(scope, element) {
      $(element).click(function(){
        alert("This has been clicked");
      )};
    }
  };
});
*/

// Create directive countHoverTime, restricted to an attribute, console.log number of seconds hovered

/*
blocJams.directive('countHoverTime', function() {

  return {
    restrict: "A", 
    link: function() {
      var seconds = 0;    
      
      $(document).ready(function(){
        function countTime(){
          $(element).hover().setTimeout(addSecond, 1000);   
        }

        function addSecond(){
          seconds ++;
        }
        
        console.log("The element has been hovered for " + seconds + " seconds!");
    }); 
});

*/







/*


econds = window.setTimeout( seconds +=1 , 1000);
        console.log("The element has been hovered for " + seconds + " seconds");
      };
    };
});

blocJams.directive('countHoverTime', function() {

  return {
    restrict: "A", 
    link: function() {
      var begin = 0;
      var end = 0;

    $(element).hover(function () {
      begin = new Date().getTime();
    });

    $(element).leave(function () {
      end = new Date().getTime();
      sec = (end - begin) / 1000;
      console.log("The element has been hovered for " + sec + " seconds");
    });
  };
});
*/













