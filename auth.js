function registrarUsuario(usuario) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const existe = usuarios.find(u => u.email === usuario.email);
  if (existe) {
    alert("Este correo ya está registrado.");
    return;
  }
  usuarios.push(usuario);
  localStorage.setItem("usuarios", JSON.stringify(usuarios));
  alert("Registro exitoso. Redirigiendo al login...");
  window.location.href = "index.html";
}

function loginUsuario(email, password) {
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const usuario = usuarios.find(u => u.email === email && u.password === password);
  if (!usuario) {
    alert("Credenciales incorrectas.");
    return;
  }
  localStorage.setItem("usuarioActivo", JSON.stringify(usuario));
  alert(`Bienvenido, ${usuario.nombre}.`);
  window.location.href = "crear-solicitud.html";
}

function obtenerUsuarioActivo() {
  return JSON.parse(localStorage.getItem("usuarioActivo"));
}

function cerrarSesion() {
  localStorage.removeItem("usuarioActivo");
  window.location.href = "index.html";
}