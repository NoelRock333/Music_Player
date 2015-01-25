	/*var colorSelect=rgb(25.25.23);
	var fontColor=rgb(105,237,204);*/

$(document).ready(function(){
	$('#moresong').click(function()
	{
		alert('Cancion agregada con exito!');
	});

	$("div").click(function()
	{
        /*var oID = $("div").attr("id");
		var ide= $(this).attr('id');
		alert('sirve '+oID);*/
		/*funcional*/
		$(this).css({ color: "#69EDC1", background: "#191917" });
		var texto= $(this).text();
		$('#namesong').html(texto);
		
	}); 
});