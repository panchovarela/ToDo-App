window.addEventListener('load', () => {

    const url = 'https://todo-api.ctd.academy/v1';


    /* -------------------------------------------------------------------------- */
    /*            FUNCIÓN 1: Escuchamos el submit y preparamos el envío           */
    /* -------------------------------------------------------------------------- */

    document.forms[0].addEventListener('submit', e => {
        e.preventDefault();
        const payload = {
            email: document.getElementById('inputEmail').value,
            password: document.getElementById('inputPassword').value
        }
        const settings = {
            method: 'POST',
            body: JSON.stringify(payload),
            headers: {
                'Content-type': 'application/json'
            }
        }
        realizarLogin(settings);
    });


    /* -------------------------------------------------------------------------- */
    /*                     FUNCIÓN 2: Realizar el login [POST]                    */
    /* -------------------------------------------------------------------------- */
    function realizarLogin(settings) {
       fetch(`${url}/users/login`, settings)
       .then(res => {
            if(!res.ok)
                alert('Alguno de los datos es incorrecto.');
            return res.json();
       })
       .then(data => {
            if(data.jwt){
                localStorage.setItem('jwt', JSON.stringify(data.jwt));
                location.replace('./mis-tareas.html');
            }
       })
       .catch(err => console.log(err)); 
    }
});