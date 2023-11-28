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