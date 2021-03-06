(function() {
    function SongPlayer($rootScope, Fixtures) {
        var SongPlayer = {};
        
        /**
        * @desc Current Album
        * @type {Object} getAlbum
        */
        
        var currentAlbum = Fixtures.getAlbum();
        SongPlayer.currentArtist = currentAlbum.artist;
        
        /**
        * @desc Buzz object audio file
        * @type {Object}
        */
        var currentBuzzObject = null;
        
        /**
        * @function setSong
        * @desc Stops currently playing song and loads new audio file as currentBuzzObject
        * @param {Object} song
        */
        
        var setSong = function(song) {
            if (currentBuzzObject) {
                stopSong(SongPlayer.currentSong);
            }
            
            currentBuzzObject = new buzz.sound(song.audioUrl, {
                formats: ['mp3'],
                preload: true
            });
            
            currentBuzzObject.setVolume(SongPlayer.volume);
            
            currentBuzzObject.bind('timeupdate', function() {
                $rootScope.$apply(function() {
                    SongPlayer.currentTime = currentBuzzObject.getTime();
                });
            });
            
            currentBuzzObject.bind('volumechange', function() {
                $rootScope.$apply(function() {
                    SongPlayer.volume = currentBuzObject.getVolume();
                });
            });
            
            SongPlayer.currentSong = song;
        };
        
        /**
        * @function getSongIndex
        * @desc Gets the index of a song
        * @param {Object} song
        */
        
        var getSongIndex = function(song) {
            return currentAlbum.songs.indexOf(song);
        };
        
        /**
        * @desc Current song object
        * @type {Object}
        */
        SongPlayer.currentSong = null;
        /**
        * @desc Current playback time (in seconds) of currently playing song
        * @type {Number}
        */
        SongPlayer.currentTime = null;
        
        /**
        * @desc The volume of the song player
        * @type {Number}
        */
        SongPlayer.volume = null;
        
        /**
        * @function playSong
        * @desc Plays the loaded currentBuzzObject
        * @param {Object} song
        */
        
        var playSong = function(song) {
            currentBuzzObject.play();
            song.playing = true;
        };
        
        /**
        * @function SongPlayer.play
        * @desc Uses setSong and playSong methods to play music
        * @param {Object} song
        */
        
        SongPlayer.play = function(song) {
            song = song || SongPlayer.currentSong;
            if (SongPlayer.currentSong !== song) {
                setSong(song);
                playSong(song);
            } else if (SongPlayer.currentSong === song) {
                if (currentBuzzObject.isPaused()) {
                    currentBuzzObject.play();
                }
            }
        };
        
        /**
        * @function SongPlayer.pause
        * @desc Uses currentBuzzObject to pause the song
        * @param {Object} song
        */
        
        SongPlayer.pause = function(song) {
            song = song || SongPlayer.currentSong;
            currentBuzzObject.pause();
            song.playing = false;
        };
        
        /**
        * @function SongPlayer.next
        * @desc Goes to the next song
        */
        
        SongPlayer.next = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex++;
            
            if (currentSongIndex >= currentAlbum.songs.length) {
                currentSongIndex = 0;
            }
        };
        
        /**
        * @function setCurrentTime
        * @desc Set current time (in seconds) of currently playing song
        * @param {Number} time
        */
        SongPlayer.setCurrentTime = function(time) {
            if (currentBuzzObject) {
                currentBuzzObject.setTime(time);
            }
        };
        
        /**
        * @function setVolume
        * @desc Set volume of the song player
        * @param {Number} volume
        */
        SongPlayer.setVolume = function(volume) {
            if (currentBuzzObject) {
                currentBuzzObject.setVolume(volume)
            };
        };
        
        /**
        * @function SongPlayer.previous
        * @desc Goes to the previous song
        */
        
        SongPlayer.previous = function() {
            var currentSongIndex = getSongIndex(SongPlayer.currentSong);
            currentSongIndex--;
            
            if (currentSongIndex < 0) {
                stopSong(SongPlayer.currentSong);
            } else {
                var song = currentAlbum.songs[currentSongIndex];
                setSong(song);
                playSong(song);
            }
        };
        
        /**
        * @function stopSong
        * @desc Stops the buzz object
        * @param {Object} song
        */
        
        var stopSong = function(song) {
            currentBuzzObject.stop();
            song.playing = null;
        }
        
        return SongPlayer;
    }
    
    angular
        .module('blocJams')
        .factory('SongPlayer', ['$rootScope', 'Fixtures', SongPlayer]);
})();