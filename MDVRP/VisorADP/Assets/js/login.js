$(document).ready(function () {
  
    $(document).on("click", "#btnAdminLogin", function () {
        mostrarAdminLogin()
    });

    $(document).on("click", "#btnLoginAdminAceptar", function () {

        loginAdmin();
       
    });
    //$(document).on("click", "#btnVolverRegistro", function () {
    //    toggle()
    //});
});

//function toggle(login) {


//    if (!$("#loginDiv").hasClass("ocultar")) {
//        mostrarLogin();
//    }
//    else{
//        mostrarRegister();
//    }
    

//}

function mostrarAdminLogin() {
    $("#modalAdminLogin").modal("show");
}


function loginAdmin() {
    
    var vPassAdmin = $("#txtPwdAdmin").val();
    if (!vPassAdmin)
    {
        mostrarError("La constraseña de administrador no es correcta");
    }
    vPassAdmin = vPassAdmin.toString();
    $.ajax({
        dataType: 'json',
        contentType: 'application/json; charset=UTF-8',
        type: 'POST',
        url: "/ADP/Home/LoginAdministrador",
       // url: "Home/LoginAdministrador",
        data: JSON.stringify({ "pPassAdmin": vPassAdmin }),//"{message:'hola'}",
        success: function (response) {
            if (response.Exito) {
                window.location.href = response.Error;
                //mostrarSuccess("Se ha notificado correctamente la tarea realizada");
            }
            else {
                mostrarError(response.Error)
            }
        },
        error: function (result) {
            mostrarError("Ingrese la contraseña de administrador");
        }
    });

}



function mostrarError(errorMsg) {

    $('.loading').css({ "display": "none" });
    $("#errorMsgAdmLog").html(errorMsg);
    $("#modalErrorMsgAdmLog").modal("show");

}