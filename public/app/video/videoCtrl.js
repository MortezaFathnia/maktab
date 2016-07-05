(function () {
	'use strict';
	define(['app'], function (app) {
		app.controller('videoCtrl', videoCtrl);
		videoCtrl.$inject = ['homeFactory', 'mainViewFactory', '$routeParams',
			'$sce', 'videoFactory', '$scope'
		];

		function videoCtrl(hf, mainFac, par, $sce, vf, $scope) {
			/*jshint validthis:true */
			var vm = this,
				player = null,
				jwPlayer = null;
			vm.current_video_address = '';
			vm.parameter = par;
			vm.articleInfo = {};
			vm.articleMetadata = '';
			vm.showList = false;
			vm.config = '';
			vm.videoAddress = null;
			vm.count = hf.counting();
			vm.selectedVideo = null;
			vm.selectedSection = null;
			vm.articleVideos = null;
			vm.selectVideo = selectVideo;
			vm.accordion = accordion;



			main();

			function main() {
				console.log('------par------', par);
				vf.getArticleInfo(par).then(getArticleInfoDone);
				leavePage();
			}

			function getArticleInfoDone(res) {
				if (res[0]) {
					vm.showList = false;
				}
				vm.articleVideos = res[1];
				vm.articleInfo = res[2];
				vm.showList = true;
				selectVideo(1, 1);
				console.log('articleVideos-------', vm.articleVideos);
			}

			function selectVideo(sectionId, videoId) {
				vm.selectedVideo = videoId;
				vm.selectedSection = sectionId;
				vm.videoAddress = {};
				vm.videoAddress.wmv = mainFac.getApiUrl() +
					'videos/' + par.artId + '/' + sectionId + '/' + videoId + '.wmv';
				vm.videoAddress.mp4 = mainFac.getApiUrl() +
					'videos/' + par.artId + '/' + sectionId + '/' + videoId + '.mp4';
				vm.videoAddress.webm = mainFac.getApiUrl() +
					'videos/' + par.artId + '/' + sectionId + '/' + videoId + '.webm';

				/*if (!player) {
					player = videojs('my-video', {
						techOrder: ['flash', 'html5'],
						//autoplay: true,
						sources: [{
							type: "video/mp4",
							src: vm.videoAddress.mp4
						}]
					});
				} else {
					changeSource(vm.videoAddress);
				}*/
				if (!jwPlayer) {
					jwPlayer = jwplayer('my-video2');
				}
				jwPlayer.setup({
					file: vm.videoAddress.mp4,
					image: "assets/img/articles/" + par.artId + "/Main.jpg",
					title: vm.articleVideos[sectionId - 1].videos[videoId - 1].videoName,
					"height": 480,
					"width": 800
				});
			}

			function changeSource(src) {
				player.pause();
				player.currentTime(0);
				player.src(src.mp4);
				player.ready(function () {
					this.one('loadeddata', videojs.bind(this, function () {
						this.currentTime(0);
					}));
					this.load();
					this.play();
				});
			}

			function leavePage() {
				$scope.$on("$destroy", function () {
					videojs('my-video').dispose();
				});
			}


			function accordion(event) {
				var parent = null;
				console.log($(event.target));
				if ($(event.target).is('div')) {
					parent = $(event.target).parent();
				} else if ($(event.target).is('span')) {
					parent = $(event.target).closest('header');
				} else if ($(event.target).is('header')) {
					parent = $(event.target);
				}
				if (parent.hasClass('active')) {
					parent.removeClass('active');
					parent.siblings('main').slideUp();
				} else {
					parent.addClass('active');
					parent.siblings('main').slideDown();
				}
			}

		}
	});
}());