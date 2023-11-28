
const oLogin = document.getElementById('login');
const usuario = document.getElementById('usuario');
const constraseña = document.getElementById('contraseña');
const url = 'http://localhost:3000';
const horaEntrada = new Date().toLocaleDateString();

oLogin.addEventListener('click', async (e) => {
    e.preventDefault();

    const user = usuario.value;
    const password = constraseña.value;
    const tipoRegistro = document.getElementById('tipoRegistro').value;

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
            const currentDateTime = new Date();
            const hours = currentDateTime.getHours();
            const minutes = currentDateTime.getMinutes();
            const seconds = currentDateTime.getSeconds();
            const horaFormateada = `${ padZero(hours) } hrs: ${ padZero(minutes) } min: ${ padZero(seconds) } seg`            
                
            if (data && Object.keys(data).length > 0) {        
                if( data.isAdmin ){
                    Swal.fire({
                        icon: "success",
                        title: `Bienvenido: ${ data.nombreEmpleado }`,
                        text: `Hora Entrada: ${ horaFormateada } `
                    });                    
                    setTimeout(() => {
                        window.location.href = 'admin.html' 
                    }, 1500);
                }else{
                    usuario.value = '';
                    constraseña.value = '';

                    try {

                        const idEmpleado = data.idEmpleado;
                        const nombreEmpleado = data.nombreEmpleado;
                        const fecha = new Date().toLocaleDateString();
                        const activo = true;
                        var entrada, salida;
                        var nuevoRegistro;

                        if(tipoRegistro === "entrada"){
                            nuevoRegistro = {
                                idEmpleado,
                                nombreEmpleado,
                                entrada: `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`,
                                salida: 'Sin Registro',
                                fecha,
                                activo
                            }
                            Swal.fire({
                                icon: "success",
                                title: `Bienvenido: ${ user }`,
                                text: `Hora Entrada: ${ horaFormateada } `
                            });
                        } else if(tipoRegistro === "salida") {
                            const buscarRegistro = await fetch(`${url}/registros/${idEmpleado}`);
                            if( buscarRegistro.ok ){
                                const registroExistente = await buscarRegistro.json();
                                const idRegistro = registroExistente[0].idRegistros;
                                entrada = registroExistente[0].entrada;
                                salida = `${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}`;

                                nuevoRegistro = {
                                    idRegistros: idRegistro,
                                    idEmpleado,
                                    nombreEmpleado,
                                    entrada: registroExistente[0].entrada,
                                    salida,
                                    fecha: registroExistente[0].fecha,
                                    activo: registroExistente[0].activo
                                }

                                const actualizarRegistroRes = await fetch(`${url}/registros/${idRegistro}`, {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify({ salida }),
                                });

                                if (actualizarRegistroRes.ok) {
                                    Swal.fire({
                                        icon: "success",
                                        title: `Gracias por tu trabajo: ${ data.nombreEmpleado }`,
                                        text: '¡Bien hecho! Tu arduo trabajo ha dado sus frutos. Tómate un merecido descanso y recarga esas energías. ¡Te lo has ganado!'
                                    });
                                    return;
                                }
                            }else{
                                console.log('Error al actualizar el registro:', actualizarRegistroRes.statusText);
                            }
                            return;
                        }

                        const registroRes = await fetch(`${ url }/registros/`, {
                            method: tipoRegistro === "entrada" ? 'POST' : 'PUT',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(nuevoRegistro)
                        })
                    
                        if (registroRes.ok) {
                            console.log(tipoRegistro === "entrada" ? 'Registro creado exitosamente' : 'Registro actualizado exitosamente');
                        } else {
                            console.error(tipoRegistro === "entrada" ? 'Error al crear el registro:' : 'Error al actualizar el registro:', registroRes.statusText);
                        }
                    } catch (error) {
                        console.log(error);
                    }

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

    function padZero(value) {
        return value < 10 ? '0' + value : value;
    }

});
