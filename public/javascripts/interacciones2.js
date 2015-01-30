	/*var colorSelect=rgb(25.25.23);
	var fontColor=rgb(105,237,204);*/

$(document).on("ready", function()
{
	/*var socket = io('http://localhost:3000');

	$('#file').on("change", function(e) {
		console.log("emitiendo change");
		var file = e.target.files[0];
		var stream = ss.createStream();

		// upload a file to the server.
		ss(socket).emit('file', stream, {size: file.size, filename: file.name});
		//ss.createBlobReadStream(file).pipe(stream);

		// Upload progress 
		var blobStream = ss.createBlobReadStream(file);
		var size = 0;
		var progress = 0;

		blobStream.on('data', function(chunk) {
			size += chunk.length;
			progress = Math.floor(size / file.size * 100);
			$("#upload_progress").text(progress+"%");
			if(progress == 100){
				alert("Archivo agregado correctamente");
				$("#upload_progress").empty();
			}
		});

		blobStream.pipe(stream);
	});*/


	$("#btn_backward").on("click", function(){
		//$("#media_player");
	});

	$("#btn_forward").on("click", function(){
		//$("#media_player");
	});

	/*$("#btn_play").on("click", function(){
		var mediaPlayer = $("#media_player");

		if( mediaPlayer.hasClass("playing") ){
			mediaPlayer[0].pause();
			mediaPlayer.removeClass("playing");
			$(this).find(".fa-pause").removeClass("fa-pause").addClass("fa-play");
		}
		else{
			mediaPlayer[0].play();
			mediaPlayer.addClass("playing");
			$(this).find(".fa-play").removeClass("fa-play").addClass("fa-pause");
		}
	});*/

	/*$("div").click(function()
	{
        //var oID = $("div").attr("id");
		//var ide= $(this).attr('id');
		//alert('sirve '+oID);
		//funcional
		$(this).css({ color: "#69EDC1", background: "#191917" });
		var texto= $(this).text();
		$('#namesong').html(texto);
		
	});*/ 
});