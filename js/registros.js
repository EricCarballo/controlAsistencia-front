var dataTable;
var dataTableInicializada = false;

const dataTableOpciones = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5] },
        { orderable: false, targets: [0, 1,,3, 4, 5] }
    ],
    pageLength: 6,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por páginas",
        zeroRecords: "Ningún registro encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuariuo encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
}

const initTable = async() => {
    if(dataTableInicializada){
        dataTable.destroy();
    }
    await listaRegistros();

    dataTable = $("#dataTable").DataTable(dataTableOpciones);

    dataTableInicializada = true;
};

const listaRegistros = async() => {
    try {
        const res = await fetch("http://localhost:3000/registros");
        const listaRegistros = await res.json();
        
        var contenido = ``;
        listaRegistros.forEach((empleado, i) => {
            contenido += `
                <tr>
                    <td> ${ i + 1 } </td>
                    <td> ${ empleado.nombreEmpleado } </td>
                    <td> ${ empleado.fecha } </td>
                    <td> ${ empleado.entrada } </td>
                    <td> ${ empleado.salida } </td>
                    <td>
                        <button class="btn btn-primary"> <i class="fa-solid fa-pencil"></i> </button>
                        <button class="btn btn-danger"> <i class="fa-solid fa-trash-can"></i> </button>
                    </td>
                </tr>
            `;
        })
        tblBodyRegistros.innerHTML = contenido;
    } catch (err) {
        alert(err)
    }
}

window.addEventListener("load", async() =>{
    await initTable();
})