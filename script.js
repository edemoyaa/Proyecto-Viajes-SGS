function generarId() {
  return 's' + Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

function guardarSolicitud(solicitud) {
  const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
  solicitudes.push(solicitud);
  localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
}

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("form-solicitud");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const nuevaSolicitud = {
      id: generarId(),
      nombreSolicitante: document.getElementById("nombre").value,
      fechaInicio: document.getElementById("fechaInicio").value,
      fechaFin: document.getElementById("fechaFin").value,
      tipoTrayecto: document.getElementById("tipoTrayecto").value,
      destino: document.getElementById("destino").value,
      observaciones: document.getElementById("observaciones").value,
      estadoActual: "Solicitado",
      historial: [
        {
          estado: "Solicitado",
          fecha: new Date().toISOString()
        }
      ],
      documentos: []
    };

    guardarSolicitud(nuevaSolicitud);

    alert("Solicitud registrada exitosamente");
    form.reset();
  });
});