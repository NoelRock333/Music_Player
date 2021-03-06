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

			function save(filename){
				var deferred = $q.defer();

				$http({
					method: 'POST',
					url: '/newSong',
					params: {
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
		}])
		.provider('playerService',function(){
			this.$get = function() {
				var btnPlayerClass = 'fa-play';
				var isPaused = true;
				var songIndex = 0;
				var playingUrl = "";
				return {
					getClass: function() {
						return btnPlayerClass+"";
					},
					setClass: function(className){
						btnPlayerClass = className;
					},
					getIsPaused: function(){
						return isPaused;
					},
					setIsPaused: function(paused){
						isPaused = paused;
					},
					getSongIndex: function(){
						return songIndex;
					},
					setSongIndex: function(index){
						songIndex = index;
					},
					getPlayingUrl: function(){
						return playingUrl;
					},
					setPlayingUrl: function(url){
						playingUrl = url;
					}
				}
			};
		})
		.factory('_', function() {
			return window._; 
		});

	angular.module('player.controllers', [])
		.controller('PlayerController', ['$scope', 'musicService', 'playerService', function($scope, musicService, playerService){
			$scope.btnPlayerClass 	= "fa-play";
			$scope.songName 		= "";
			$scope.songAuthor 		= "";
			$scope.songIndex 		= 0;

			$scope.togglePlayingState = function(index) {
				$scope.btnPlayerClass = playerService.getClass();
				if(typeof index != "undefined"){
					playerService.setSongIndex(index);
					$scope.songIndex = index;
					playerService.setPlayingUrl($scope.songs[index].url);
					$scope.playingUrl = $scope.songs[index].url;
				}
			};

			musicService.all().then(function(data){
				$scope.songs 		= data;
				$scope.playingUrl 	= data[0].url;
				$scope.songName 	= data[0].name;
				$scope.songAuthor 	= data[0].author;
				playerService.setPlayingUrl(data[0].url);
			});

		}]);

	angular.module('player.directives', [])
		.directive('play', ['$document', 'playerService', '_', function($document, playerService, _) {
			return {
				restrict: "A",
				link: function($scope, $element, $attrs) {

					var $mediaPlayer= $("#media_player");
					var $timeLine 	= $("#time_line");
					var $songName 	= $("#song_name");
					
					$element.on("click", function(e) {
						if($attrs.play == "forward"){
							playNext();
						}
						else if($attrs.play == "backward"){
							playPrevious();
						}
						else if($mediaPlayer.attr("src") == $attrs.play && playerService.getIsPaused() == false){
							pause();
						}
						else{
							play();
						}
					});

					$mediaPlayer.on('timeupdate', function() {
						var rem = parseInt(this.duration - this.currentTime, 10),
						pos = (this.currentTime / this.duration) * 100,
						mins = Math.floor(rem/60,10),
						secs = rem - mins*60;
						$timeLine.css({width: pos + '%'});
					});

					$mediaPlayer.on('ended', function() {
						playNext();
					});

					var play = function(){
						var nowPlaying 	= $scope.songs[$attrs.songIndex];
						$songName.text(nowPlaying.name +" - "+ nowPlaying.author);
						playerService.setClass('fa-pause');
						playerService.setIsPaused(false);
						$mediaPlayer.attr("src", $attrs.play);
						$mediaPlayer[0].play();
					}

					var pause = function(){
						playerService.setClass('fa-play');
						playerService.setIsPaused(true);
						$mediaPlayer[0].pause();
					}

					var playNext = function(){
						$mediaPlayer.currentTime = 0;
						$timeLine.css({width: '0%'});
						var next = playerService.getSongIndex()+1; 
						if( next < _.size($scope.songs) ){
							var nextSong = $scope.songs[next];
							$mediaPlayer.attr("src", nextSong.url);
							playerService.setPlayingUrl(nextSong.url);
							$songName.text(nextSong.name + " - " + nextSong.author);
							playerService.setSongIndex(next);
							$mediaPlayer[0].play();
						}
						else if(playerService.getSongIndex() == _.size($scope.songs)-1){
							playerService.setIsPaused(true);
							playerService.setClass('fa-play');
							playerService.setSongIndex(-1);
							$mediaPlayer[0].pause();
						}
					}

					var playPrevious = function(){
						$mediaPlayer.currentTime = 0;
						$timeLine.css({width: '0%'});
						if(playerService.getSongIndex() > 0){
							var prev = playerService.getSongIndex()-1; 
							var prevSong = $scope.songs[prev];
							$mediaPlayer.attr("src", prevSong.url);
							playerService.setPlayingUrl(prevSong.url);
							$songName.text(prevSong.name + " - " + prevSong.author);
							playerService.setSongIndex(prev);
							$mediaPlayer[0].play();
						}
						else if(playerService.getSongIndex() == 0){
							playerService.setClass('fa-play');
							playerService.setIsPaused(true);
							playerService.setSongIndex(0);
							$mediaPlayer[0].pause();
						}
					}
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
							ss(socket).emit('file', stream, {size: file.size, filename: $attrs.songUploader });
							var blobStream = ss.createBlobReadStream(file);

							blobStream.on('data', function(chunk) {
								size += chunk.length;
								progress = Math.floor(size / file.size * 100);
								$uploadProgress.text(progress+"%");

								if(progress == 100){
									musicService.save(filename).then(
										function(data){
											if(data == false)
												$("#new_song_msg").fadeIn(1600).fadeOut(3000);
											else{
												$scope.songs.push(data);
												$("#new_song_msg").fadeIn(1600).fadeOut(3000);
											}
									});

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