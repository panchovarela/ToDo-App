function esRegistroValido(email, password_1, password_2){
    if(!validarEmail(email)){
        alert('Introduce un correo electrónico válido.');
        return false;
    }
    if(!validarContrasenia(password_1)){
        alert('La contraseña debe contener al menos una letra mayúscula, una letra minúscula y un número.');
        return false;
    }
    if(!compararContrasenias(password_1, password_2)){
        alert('Las contraseñas no coinciden.');
        return false;
    }
    return true;
}


/* ---------------------------------- email --------------------------------- */

function validarEmail(email) {
    var regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}


/* -------------------------------- password -------------------------------- */

function validarContrasenia(password) {
    var regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/;
    return regex.test(password);
}

function compararContrasenias(password_1, password_2) {
    return password_1 === password_2;
}