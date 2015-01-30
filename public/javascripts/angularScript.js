(function(_){

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

			function save(songname, author, filename){
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: '/newSong',
					params: {
						name: songname, 
						author: author, 
						filename: filename
					}
				})
				.success(function(data){
					deferred.resolve(data);
				});
				return deferred.promise;
			}

			return {
				all: all,
				save: save
			};
		}]);

	angular.module('player.controllers', [])
		.controller('PlayerController', ['$scope', 'musicService', function($scope, musicService){

			var $mediaPlayer = $("#media_player");
			var $timeLine = $("#time_line");
			$scope.player = { playing: false }; 
			$scope.btnPlayerClass = 'fa-play';
			$scope.songIndex = 0;

			$scope.togglePlayingState = function(index) {
				if($scope.btnPlayerClass == 'fa-play')
					$scope.btnPlayerClass = 'fa-pause';
				else
					$scope.btnPlayerClass = 'fa-play';

				if(typeof index != "undefined"){
					$scope.songIndex = index;
				}
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

					var $mediaPlayer = $("#media_player");
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
						$mediaPlayer.currentTime = 0;
						$timeLine.css({width: '0%'});
						//$scope.songIndex = $scope.songIndex + 1;
						$mediaPlayer.attr("src", $scope.songs[$scope.songIndex].url);
						$mediaPlayer[0].play();
						$scope.songIndex++;
					});
				}
			}
		}])
		.directive('songUploader', ['$document', 'musicService', function($document, musicService) {
			return {
				restrict: "A",
				link: function($scope, $element, $attrs) {
					var socket = io('http://localhost:3000');
					var $uploadProgress = $("#upload_progress");

					$element.on("change", function(e) {
						var file = e.target.files[0];
						var stream = ss.createStream();
						var size = 0;
						var progress = 0;
						var filename = "";

						if(file.name.split('.').pop() == "mp3"){
							// upload a file to the server.
							ss(socket).emit('file', stream, {size: file.size, filename: $attrs.songUploader });

							// Upload progress 
							var blobStream = ss.createBlobReadStream(file);

							blobStream.on('data', function(chunk) {
								size += chunk.length;
								progress = Math.floor(size / file.size * 100);
								$uploadProgress.text(progress+"%");

								if(progress == 100){
									songname=prompt("Nombre del tema","");
									if(songname != ""){
										author=prompt("Nombre del autor","");
										if(author != ""){
											musicService.save(songname, author, filename).then(
												function(data){
													console.log(data);
													if(data == false)
														alert("Algo salió mal, intentalo de nuevo")
													else
														alert("Tema agregado correctamente");
											});
										}
									}
									else
										alert("No se ha podido agregar el tema");

									$("#upload_progress").empty();
								}
							});

							blobStream.pipe(stream);

							socket.on('file_name', function (data) {
								filename = data.filename;
							});

						}
						else
							alert("Formato de archivo no admitido");

					});
				}
			}
		}]);
	}());