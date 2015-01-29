(function(){

	var app = angular.module('player', [
		'player.directives',
		'player.controllers',
		'player.services'
	]);

	angular.module('player.services', [])
		.factory('musicService', ['$http','$q', function($http, $q){
			function all(){
				var deferred = $q.defer();

				$http.get('/songsList_JSON')
					.success(function(data){
						deferred.resolve(data);
					});
				return deferred.promise;
			}

			function byName(songName){
				all().then(function(data){
					return data;
				});
			}
			return {
				all: all,
				byName: byName
			};
		}]);

	angular.module('player.controllers', [])
		.controller('PlayerController', ['$scope', 'musicService', function($scope, musicService){

			$scope.player = { playing: false }; 
			$scope.btnPlayerClass = 'fa-play';

			$scope.togglePlayingState = function() {
				if($scope.btnPlayerClass == 'fa-play')
					$scope.btnPlayerClass = 'fa-pause';
				else
					$scope.btnPlayerClass = 'fa-play';
			};

			musicService.all().then(function(data){
				$scope.songs = data;
				$scope.playingUrl = data[0].url;
			});

		}])
		.controller('MusicController',['$scope', 'musicService', function($scope, musicService){
			$scope.song = {};

			musicService.byName('ThePretender').
				then(function(data){
					$scope.song = data;
				});
		}]);

	angular.module('player.directives', [])
		.directive('play', ['$document', function($document) {
			return {
				restrict: "A",
				link: function($scope, $element, $attrs) {

					var $mediaPlayer = $("#media_player")
					var $timeLine = $("#time_line");
					// <a class="btn" play="song_url"> </a>
					
					$element.on("click", function(e) {
						if($mediaPlayer.attr("src") == $attrs.play && $scope.isPaused == false){
							$scope.isPaused = true;
							$mediaPlayer[0].pause();
						}
						else{
							$scope.isPaused = false;
							$mediaPlayer.attr("src", $attrs.play);
							$mediaPlayer[0].play();
						}
					});

					$mediaPlayer.on('timeupdate', function() {
						var rem = parseInt(this.duration - this.currentTime, 10),
						pos = (this.currentTime / this.duration) * 100,
						mins = Math.floor(rem/60,10),
						secs = rem - mins*60;
						$timeLine.css({width: pos + '%'});
					});

					//Esta es para cuando quieres parar las rolas
					$mediaPlayer.on('ended', function() {
						this.currentTime = 0;
					});
				}
			}
		}]);
}());