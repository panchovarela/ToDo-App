// SEGURIDAD: Si no se encuentra en localStorage info del usuario
// no lo deja acceder a la página, redirigiendo al login inmediatamente.

if(!localStorage.jwt)
  location.replace('./index.html');

/* ------ comienzan las funcionalidades una vez que carga el documento ------ */

window.addEventListener('load', () => {

  /* ---------------- variables globales y llamado a funciones ---------------- */

  const url = 'https://todo-api.ctd.academy/v1';
  const token = JSON.parse(localStorage.jwt);

  obtenerNombreUsuario();
  consultarTareas();


  /* -------------------------------------------------------------------------- */
  /*                          FUNCIÓN 1 - Cerrar sesión                         */
  /* -------------------------------------------------------------------------- */

  document.getElementById('closeApp').addEventListener('click', () => {
    localStorage.clear();
    location.replace('./index.html');
  });


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 2 - Obtener nombre de usuario [GET]                */
  /* -------------------------------------------------------------------------- */

  function obtenerNombreUsuario() {
    fetch(`${url}/users/getMe`, {
      method: 'GET',
      headers: {authorization: token}
    })
    .then(res => res.json())
    .then(data => document.querySelector('.user-info p').textContent = data.firstName)
    .catch(err => console.error(err));
  }


  /* -------------------------------------------------------------------------- */
  /*                 FUNCIÓN 3 - Obtener listado de tareas [GET]                */
  /* -------------------------------------------------------------------------- */

  function consultarTareas() {
    fetch(`${url}/tasks`, {
      method: 'GET',
      headers: {authorization: token}
    })
    .then(res => res.json())
    .then(tareas => {
      renderizarTareas(tareas);
      botonesCambioEstado();
      botonBorrarTarea();
    })
    .catch(err => console.error(err));
  }


  /* -------------------------------------------------------------------------- */
  /*                    FUNCIÓN 4 - Crear nueva tarea [POST]                    */
  /* -------------------------------------------------------------------------- */

  const form = document.forms[0];
  form.addEventListener('submit', e => {
    e.preventDefault();
    fetch(`${url}/tasks`, {
      method: 'POST',
      body: JSON.stringify({
        description: document.getElementById('nuevaTarea').value.trim(),
        completed: false
      }),
      headers: {
        'Content-type': 'application/json',
        authorization: token
      }
    })
    .then(res => res.json())
    .then(data => consultarTareas())
    .catch(err => console.error(err));
    form.reset();
  });


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 5 - Renderizar tareas en pantalla                 */
  /* -------------------------------------------------------------------------- */

  function renderizarTareas(listado) {
    const tareasPendientes = document.querySelector('.tareas-pendientes');
    const tareasTerminadas = document.querySelector('.tareas-terminadas');
    tareasPendientes.innerHTML = '';
    tareasTerminadas.innerHTML = '';
    let contador = 0;
    listado.forEach(tarea => {
      let fecha =  new Date(tarea.createdAt);
      if(tarea.completed){
        contador++;
        tareasTerminadas.innerHTML += `
          <li class="tarea">
            <div class="hecha">
              <i class="fa-regular fa-circle-check"></i>
            </div>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <div class="cambios-estados">
                <button class="change incompleta" id="${tarea.id}"><i class="fa-solid fa-rotate-left"></i></button>
                <button class="borrar" id="${tarea.id}"><i class="fa-regular fa-trash-can"></i></button>
              </div>
            </div>
          </li>`
      } else{
        tareasPendientes.innerHTML += `
          <li class="tarea">
            <button class="change" id="${tarea.id}"><i class="fa-regular fa-circle"></i></button>
            <div class="descripcion">
              <p class="nombre">${tarea.description}</p>
              <p class="timestamp">${fecha.toLocaleDateString()}</p>
            </div>
          </li>`
      }
      document.getElementById('cantidad-finalizadas').textContent = contador;
    });
  }


  /* -------------------------------------------------------------------------- */
  /*                  FUNCIÓN 6 - Cambiar estado de tarea [PUT]                 */
  /* -------------------------------------------------------------------------- */

  function botonesCambioEstado() {
    const btnCambioEstado = document.querySelectorAll('.change');
    btnCambioEstado.forEach(btn => {
      btn.addEventListener('click', () => {
        const payload = {};
        if(btn.classList.contains('incompleta'))
          payload.completed = false;
        else
          payload.completed = true;
        fetch(`${url}/tasks/${btn.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
          headers: {
            'authorization': token,
            'Content-type': 'application/json'
          }
        })
        consultarTareas();
      });
    });
  }


  /* -------------------------------------------------------------------------- */
  /*                     FUNCIÓN 7 - Eliminar tarea [DELETE]                    */
  /* -------------------------------------------------------------------------- */

  function botonBorrarTarea() {
    const btnBorrar = document.querySelectorAll('.borrar');
    btnBorrar.forEach(btn => {
      btn.addEventListener('click', () => {
        fetch(`${url}/tasks/${btn.id}`, {
          method: 'DELETE',
          headers: {
            'authorization': token
          }
        })
        consultarTareas();
      });
    });
  }
});