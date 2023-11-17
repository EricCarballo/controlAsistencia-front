

// INICIO DE LA SECCIÓN --> ACTUALIZAR FECHA Y HORA  <--

document.addEventListener('DOMContentLoaded', function () {
    updateTime(); // Llamar a la función para establecer la hora y la fecha inicial

    // Actualizar la hora y la fecha cada segundo
    setInterval(updateTime, 1000);
});

function updateTime() {
    const timeContainer = document.getElementById('current-time');
    const dateContainer = document.getElementById('current-date');
    const currentDateTime = new Date();
    const hours = currentDateTime.getHours();
    const minutes = currentDateTime.getMinutes();
    const seconds = currentDateTime.getSeconds();
    const day = currentDateTime.getDate();
    const month = currentDateTime.getMonth() + 1; // Se suma 1 porque los meses van de 0 a 11
    const year = currentDateTime.getFullYear();

    // Asegurar que los valores tengan dos dígitos
    const formattedTime = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;
    const formattedDate = `${padZero(day)}/${padZero(month)}/${year}`;

    timeContainer.textContent = formattedTime;
    dateContainer.textContent = formattedDate;
}

function padZero(value) {
    return value < 10 ? '0' + value : value;
}

// FIN DE LA SECCIÓN --> ACTUALIZAR FECHA Y HORA  <--


// INICIO DE LA SECCIÓN --> VÁLIDAR LOGIN  <--

const oLogin = document.getElementById('login');
const usuario = document.getElementById('usuario');
const constraseña = document.getElementById('contraseña');
const url = 'http://localhost:3000';
const horaEntrada = new Date().toLocaleDateString();

oLogin.addEventListener('click', async (e) => {
    e.preventDefault();

    const user = usuario.value;
    const password = constraseña.value;

    if(!user || !password){
        Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Por favor, ingrese tanto el usuario como la contraseña!",
          });
          return;
    }

    try {
        
        const res = await fetch( `${ url }/login` , {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ usuario: user, password: password }),
        });

        if (res.ok) {
            const data = await res.json();
                
            if (data && Object.keys(data).length > 0) {        
                if( data.isAdmin ){
                    Swal.fire({
                        icon: "success",
                        title: `Bienvenido: ${ user }`,
                        text: `Hora Entrada: ${ horaEntrada } `
                    });                    
                    setTimeout(() => {
                        window.location.href = 'admin.html' 
                    }, 1500);
                }else{
                    usuario.value = '';
                    constraseña.value = '';    
                    Swal.fire({
                        icon: "success",
                        title: `Bienvenido: ${ user }`,
                        text: `Hora Entrada: ${ horaEntrada } `
                    });
                }

            } else {
                
                Swal.fire({
                    icon: "error",
                    title: "Oopss...",
                    text: "Credenciales Incorrectas. Por favor intenta de nuevo"
                });

            }
        } else {
            console.error('Error en la respuesta del servidor:', res.statusText);
        }
    } catch (error) {
        console.log('Error:', error);
    }

});

// FIN DE LA SECCIÓN --> VÁLIDAR LOGIN  <--