$(document).ready(function(){
	/*alert("texto");*/
	var user;
    var pasw;
    var usernew=false;
    var passwordnew=false;

	$('input:text').click(
    function(){
        $(this).val('');
        usernew=true;
    });

    $('input:password').click(
    function(){
        $(this).val('');
        passwordnew=true
    });
    $('#ingresar').click(function(){
    	alert('Entro');
    	if(usernew){
	    	user=$("input#User").val();
	    	console.log(user);
	    	alert('Falta su correo')
    	}
    	if(passwordnew){
	    	user=='';
	    	alert('Falta su contraseña')
    	}
    });

    
});