(function(){

	var app = angular.module('player', [
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

			var mediaPlayer = $("#media_player");
			var btnPlay = $("#btn_play");

			musicService.all().then(function(data){
				$scope.songs = data;
			});

			$scope.play = function(url){
				mediaPlayer.attr("src", url);
				mediaPlayer[0].play();
				mediaPlayer.addClass("playing");
				btnPlay.find(".fa-play").removeClass("fa-play").addClass("fa-pause");
			}
		}])
		.controller('MusicController',['$scope', 'musicService', function($scope, musicService){
			$scope.song = {};

			musicService.byName('ThePretender').
				then(function(data){
					$scope.song = data;
				});
		}]);
}());