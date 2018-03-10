$(document).ready(function () {
    // Generate a simple captcha
    function randomNumber(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min);
    };
    $('#captchaOperation').html([randomNumber(1, 100), '+', randomNumber(1, 200), '='].join(' '));

    $('#defaultForm').bootstrapValidator({
        message: 'No es un valor valido',
        fields: {
            username: {
                message: 'El nombre de usuario no es valido',
                validators: {
                    notEmpty: {
                        message: 'El nombre de usuario es obligatorio'
                    },
                    //remote: {
                    //    url: 'remote.php',
                    //    message: 'El nombre de usurario ingresado ya se encuentra en uso'
                    //},
                    stringLength: {
                        min: 6,
                        max: 30,
                        message: 'El nombre de usuario tiene que tener de 6 a 30 caracteres'
                    },
                    regexp: {
                        regexp: /^[a-zA-Z0-9_\.]+$/,
                        message: 'El nombre de usuario solo puede tener caracteres alfabeticos, numericos, infraguion o punto'
                    },
                    different: {
                        field: 'password',
                        message: 'El nombre de usuario y la contraseña no pueden ser iguales'
                    }
                }
            },
            nombre: {
                message: 'El nombre no es valido',
                validators: {
                    notEmpty: {
                        message: 'El nombre es obligatorio'
                    },
                }
            },
            apellido: {
                message: 'El apellido no es valido',
                validators: {
                    notEmpty: {
                        message: 'El apellido es obligatorio'
                    },
                }
            },
            celular: {
                message: 'El celular no es valido',
                validators: {
                    notEmpty: {
                        message: 'El celular es obligatorio'
                    },
                }
            },
            telefono: {
                message: 'El telefono no es valido',
                validators: {
                    notEmpty: {
                        message: 'El telefono es obligatorio'
                    },
                }
            },
            cuit: {
                message: 'El CUIT no es valido',
                validators: {
                    notEmpty: {
                        message: 'El CUIT es obligatorio'
                    },
                    regexp: {
                        regexp: /^[Z0-9.]+$/,
                        message: 'El CUIT solo puede tener caracteres numericos o punto'
                    }
                }
            },
            email: {
                validators: {
                    notEmpty: {
                        message: 'La direccion de mail es obligatoria'
                    },
                    emailAddress: {
                        message: 'El mail ingresado no es valido'
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: 'La contraseña es obligatoria y no puede estar en blanco'
                    },
                    identical: {
                        field: 'confirmPassword',
                        message: 'La contraseña y su confirmación no son iguales'
                    },
                    different: {
                        field: 'username',
                        message: 'La contraseña no puede ser la misma que el nombre de usuario'
                    }
                }
            },
            confirmPassword: {
                validators: {
                    notEmpty: {
                        message: 'La contraseña es obligatoria y no puede estar en blanco'
                    },
                    identical: {
                        field: 'password',
                        message: 'La contraseña y su confirmación no son iguales'
                    },
                    different: {
                        field: 'username',
                        message: 'La contraseña no puede ser la misma que el nombre de usuario'
                    }
                }
            },
            captcha: {
                validators: {
                    callback: {
                        message: 'Respuesta erronea',
                        callback: function (value, validator) {
                            var items = $('#captchaOperation').html().split(' '), sum = parseInt(items[0]) + parseInt(items[2]);
                            return value == sum;
                        }
                    }
                }
            }
        }
    });
});