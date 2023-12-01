window.addEventListener('load', () => {

    const url = 'https://todo-api.ctd.academy/v1';


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */

    document.forms[0].addEventListener('submit', e => {
        e.preventDefault();
        const payload = {
            firstName: document.getElementById('inputNombre').value,
            lastName: document.getElementById('inputApellido').value,
            email: document.getElementById('inputEmail').value,
            password: document.getElementById('inputPassword').value
        }
        if(esRegistroValido(payload.email, payload.password, document.getElementById('inputPasswordRepetida').value)){
            const settings = {
                method: 'POST',
                body: JSON.stringify(payload),
                headers: {
                    'Content-type': 'application/json'
                }
            }
            realizarRegistro(settings);
        }
    });


    /* -------------------------------------------------------------------------- */
    /*                    FUNCIÓN 2: Realizar el signup [POST]                    */
    /* -------------------------------------------------------------------------- */

    function realizarRegistro(settings) {
        fetch(`${url}/users`, settings)
        .then(res => {
            if(!res.ok)
                alert('El usuario ya se encuentra registrado o alguno de los datos requeridos está incompleto.');
            return res.json();
        })
        .then(data => {
            if(data.jwt){
                localStorage.setItem('jwt', JSON.stringify(data.jwt));
                location.replace('./mis-tareas.html');
            }
        })
        .catch(err => console.log(err));
    };
});