function obtenerUsuarioActivo() {
  return JSON.parse(localStorage.getItem("usuarioActivo"));
}
function mostrarSolicitudes(usuario) {
  const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
  const contenedor = document.getElementById('contenedor-solicitudes');

  // Filtrado por rol
  const visibles = usuario.rol === "Administrador"
    ? solicitudes
    : solicitudes.filter(s => s.nombreSolicitante === usuario.nombre);

  if (visibles.length === 0) {
    contenedor.innerHTML = "<p>No hay solicitudes para mostrar.</p>";
    return;
  }

  visibles.forEach(solicitud => {
    const div = document.createElement('div');
    div.className = 'solicitud';

    const puedeEditar = usuario.rol === "Administrador";

    div.innerHTML = `
      <div><strong>ID:</strong> ${solicitud.id}</div>
      <div><strong>Solicitante:</strong> ${solicitud.nombreSolicitante}</div>
      <div><strong>Destino:</strong> ${solicitud.destino}</div>
      <div><strong>Fechas:</strong> ${solicitud.fechaInicio} → ${solicitud.fechaFin}</div>
      <div><strong>Tipo de Trayecto:</strong> ${solicitud.tipoTrayecto}</div>
      <div class="estado"><strong>Estado Actual:</strong> <span id="estado-${solicitud.id}">${solicitud.estadoActual}</span></div>

      ${puedeEditar ? `
        <label for="cambioEstado-${solicitud.id}"><strong>Cambiar Estado:</strong></label>
        <select id="cambioEstado-${solicitud.id}">
          <option value="">Seleccionar nuevo estado</option>
          <option value="En Revisión">En Revisión</option>
          <option value="En Ejecución">En Ejecución</option>
          <option value="Aprobado">Aprobado</option>
          <option value="Cerrado">Cerrado</option>
        </select>
        <button onclick="cambiarEstado('${solicitud.id}')">Actualizar Estado</button>

        <div class="adjunto">
          <strong>Adjuntar Documento:</strong>
          <input type="file" id="archivo-${solicitud.id}" />
          <button onclick="adjuntarDocumento('${solicitud.id}')">Subir</button>
        </div>
      ` : ""}

      <div class="historial">
        <strong>Historial:</strong>
        ${solicitud.historial.map(e => `<span>${e.estado} - ${new Date(e.fecha).toLocaleString()}</span>`).join('')}
      </div>

      <div class="adjuntos">
        <strong>Documentos Adjuntos:</strong>
        ${solicitud.documentos && solicitud.documentos.length > 0
          ? solicitud.documentos.map(doc => `<span>${doc.nombreArchivo} (${new Date(doc.fechaCarga).toLocaleString()})</span>`).join('')
          : "<span>No hay documentos adjuntos.</span>"
        }
      </div>
    `;

    contenedor.appendChild(div);
  });
}

function cambiarEstado(id) {
  const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
  const solicitud = solicitudes.find(s => s.id === id);
  const nuevoEstado = document.getElementById(`cambioEstado-${id}`).value;

  if (!nuevoEstado) {
    alert("Debes seleccionar un estado.");
    return;
  }

  if (nuevoEstado === solicitud.estadoActual) {
    alert("El estado ya es el actual.");
    return;
  }

  solicitud.estadoActual = nuevoEstado;
  solicitud.historial.push({
    estado: nuevoEstado,
    fecha: new Date().toISOString()
  });

  localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
  alert("Estado actualizado.");
  location.reload();
}

function adjuntarDocumento(id) {
  const archivoInput = document.getElementById(`archivo-${id}`);
  const archivo = archivoInput.files[0];

  if (!archivo) {
    alert("Por favor selecciona un archivo.");
    return;
  }

  const lector = new FileReader();
  lector.onload = function (e) {
    const base64 = e.target.result;

    const solicitudes = JSON.parse(localStorage.getItem('solicitudes')) || [];
    const solicitud = solicitudes.find(s => s.id === id);

    if (!solicitud.documentos) {
      solicitud.documentos = [];
    }

    solicitud.documentos.push({
      nombreArchivo: archivo.name,
      fechaCarga: new Date().toISOString(),
      dataUrl: base64 
    });

    localStorage.setItem('solicitudes', JSON.stringify(solicitudes));
    alert("Documento adjuntado correctamente.");
    location.reload();
  };

  lector.readAsDataURL(archivo);
}

document.addEventListener("DOMContentLoaded", () => {
  const usuario = obtenerUsuarioActivo();
  if (!usuario) {
    alert("Debes iniciar sesión primero.");
    window.location.href = "index.html";
    return;
  }

  mostrarSolicitudes(usuario);
});