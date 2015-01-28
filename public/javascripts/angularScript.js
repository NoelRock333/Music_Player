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

			//var mediaPlayer = $("#media_player");
			//var btnPlay = $("#btn_play");

			$scope.isPlaying = false;
			$scope.isPaused = false;
			$scope.isStopped = true;

			musicService.all().then(function(data){
				$scope.songs = data;
				$scope.playingUrl = data[0].url;
			});

			/*$scope.play = function(url){
				mediaPlayer.attr("src", url);
				mediaPlayer[0].play();
				mediaPlayer.addClass("playing");
				btnPlay.find(".fa-play").removeClass("fa-play").addClass("fa-pause");
			}*/
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
					var $btnPlay = $("#btn_play");
					var $timeLine = $("#time_line");
					// <a class="btn" play="song_url"> </a>
					
					$element.on("click", function(e) {
						if($mediaPlayer.attr("src") == $attrs.play && $scope.isPaused == false){
							$scope.isPaused = true;
							$scope.isPlaying = false;
							$scope.isStopped = false;
							$mediaPlayer[0].pause();
						}
						else{
							$scope.isPaused = false;
							$scope.isStopped = false;
							$scope.isPlaying = true;
							$mediaPlayer.attr("src", $attrs.play);
							$mediaPlayer[0].play();
						}
						$scope.$apply(function(){
							$scope.isPaused = $scope.isPaused;
							$scope.isStopped = $scope.isStopped;
							$scope.isPlaying = $scope.isPlaying;
						});
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