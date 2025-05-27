// ELEMENTOS
const registerForm = document.getElementById('registerForm');
const loginForm = document.getElementById('loginForm');
const recoveryForm = document.getElementById('recoveryForm');
const mainMenu = document.getElementById('mainMenu');
const appointmentForm = document.getElementById('appointmentForm');
const petFormSection = document.getElementById('petForm');
const petRegistrationForm = document.getElementById('petRegistrationForm');

const togglePasswordIcons = document.querySelectorAll('.toggle-password');

// Contenedor dinámico para mostrar la ficha de cita
let appointmentDetailsContainer = null;

// Mostrar formularios y secciones
function showRegister() {
  registerForm.classList.remove('hidden');
  loginForm.classList.add('hidden');
  recoveryForm.classList.add('hidden');
  mainMenu.classList.add('hidden');
  appointmentForm.classList.add('hidden');
  petFormSection.classList.add('hidden');
  clearAppointmentDetails();  
  clearMessages();
}

function showLogin() {
  registerForm.classList.add('hidden');
  loginForm.classList.remove('hidden');
  recoveryForm.classList.add('hidden');
  mainMenu.classList.add('hidden');
  appointmentForm.classList.add('hidden');
  petFormSection.classList.add('hidden');
  clearAppointmentDetails();  
  clearMessages();
}

function showRecovery() {
  registerForm.classList.add('hidden');
  loginForm.classList.add('hidden');
  recoveryForm.classList.remove('hidden');
  mainMenu.classList.add('hidden');
  appointmentForm.classList.add('hidden');
  petFormSection.classList.add('hidden');
  clearAppointmentDetails();  
  clearMessages();
}

function showMenu() {
  mainMenu.classList.remove('hidden');
  registerForm.classList.add('hidden');
  loginForm.classList.add('hidden');
  recoveryForm.classList.add('hidden');
  appointmentForm.classList.add('hidden');
  petFormSection.classList.add('hidden');
  clearAppointmentDetails();  
  clearMessages();
}

function showAppointmentForm() {
  appointmentForm.classList.remove('hidden');
  mainMenu.classList.add('hidden');
  petFormSection.classList.add('hidden');
  clearAppointmentDetails();
  clearMessages();
}

function showPetForm() {
  petFormSection.classList.remove('hidden');
  mainMenu.classList.add('hidden');
  appointmentForm.classList.add('hidden');
  clearAppointmentDetails();
  clearMessages();
}

function goToMenu() {
  showMenu();
  clearAppointmentDetails();
}

function clearMessages() {
  document.querySelectorAll('.message').forEach(el => {
    el.textContent = '';
    el.className = 'message';
  });
}

function showMessage(formId, msg, type) {
  const form = document.getElementById(formId);
  const message = form.querySelector('.message');
  message.textContent = msg;
  message.className = `message ${type}`;
}

// Toggle mostrar/ocultar contraseña
togglePasswordIcons.forEach(icon => {
  icon.addEventListener('click', () => {
    const input = icon.previousElementSibling;
    if (input.type === 'password') {
      input.type = 'text';
      icon.textContent = '🙈';
    } else {
      input.type = 'password';
      icon.textContent = '👁';
    }
  });
});

// REGISTRO (simulado con código de verificación)
let verificationSent = false;
let currentVerificationCode = '';

function generateCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function sendVerificationCode() {
  const email = document.getElementById('regEmail').value.trim();
  if (!validateEmail(email)) {
    showMessage('registerForm', 'Correo inválido', 'error');
    return;
  }
  currentVerificationCode = generateCode();
  verificationSent = true;
  alert(`Código de verificación enviado: ${currentVerificationCode} (simulado)`); // Aquí iría EmailJS
  document.getElementById('verificationCode').classList.remove('hidden');
  showMessage('registerForm', 'Código enviado, revisa tu correo', 'success');
}

registerForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!verificationSent) {
    showMessage('registerForm', 'Primero debes enviar el código', 'error');
    return;
  }
  const enteredCode = document.getElementById('verificationCode').value.trim();
  if (enteredCode !== currentVerificationCode) {
    showMessage('registerForm', 'Código incorrecto', 'error');
    return;
  }

  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value.trim();
  if (!validateEmail(email)) {
    showMessage('registerForm', 'Correo inválido', 'error');
    return;
  }
  if (!validatePassword(password)) {
    showMessage('registerForm', 'La contraseña debe tener mínimo 8 caracteres, incluyendo letras, números y símbolos.', 'error');
    return;
  }

  const user = { email, password };
  localStorage.setItem('user', JSON.stringify(user));

  showMessage('registerForm', 'Registro exitoso. Puedes iniciar sesión.', 'success');
  setTimeout(showLogin, 2000);
});

// LOGIN
loginForm.addEventListener('submit', e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value.trim();
  const storedUser = JSON.parse(localStorage.getItem('user'));

  if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
    showMessage('loginForm', 'Correo o contraseña incorrectos.', 'error');
    return;
  }

  showMessage('loginForm', 'Inicio de sesión exitoso.', 'success');
  setTimeout(showMenu, 1000);
});

// RECUPERACIÓN (simulada)
let recoverySent = false;
let recoveryCurrentCode = '';

function sendRecoveryCode() {
  const email = document.getElementById('recoveryEmail').value.trim();
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (!storedUser || storedUser.email !== email) {
    showMessage('recoveryForm', 'Correo no registrado.', 'error');
    return;
  }
  recoveryCurrentCode = generateCode();
  recoverySent = true;
  alert(`Código de recuperación enviado: ${recoveryCurrentCode} (simulado)`); // Aquí iría EmailJS
  document.getElementById('recoveryCode').classList.remove('hidden');
  document.getElementById('newPassword').classList.remove('hidden');
  showMessage('recoveryForm', 'Código enviado, revisa tu correo.', 'success');
}

recoveryForm.addEventListener('submit', e => {
  e.preventDefault();
  if (!recoverySent) {
    showMessage('recoveryForm', 'Primero debes enviar el código.', 'error');
    return;
  }
  const enteredCode = document.getElementById('recoveryCode').value.trim();
  const newPassword = document.getElementById('newPassword').value.trim();

  if (enteredCode !== recoveryCurrentCode) {
    showMessage('recoveryForm', 'Código incorrecto.', 'error');
    return;
  }
  if (!validatePassword(newPassword)) {
    showMessage('recoveryForm', 'La contraseña debe tener mínimo 8 caracteres, incluyendo letras, números y símbolos.', 'error');
    return;
  }

  const storedUser = JSON.parse(localStorage.getItem('user'));
  storedUser.password = newPassword;
  localStorage.setItem('user', JSON.stringify(storedUser));

  showMessage('recoveryForm', 'Contraseña restablecida con éxito.', 'success');
  setTimeout(showLogin, 2000);
});

// VALIDACIONES
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function validatePassword(password) {
  const re = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&]).{8,}$/;
  return re.test(password);
}

// FUNCIONES NUEVAS PARA MOSTRAR FICHA DE CITA
function clearAppointmentDetails() {
  if (appointmentDetailsContainer) {
    appointmentDetailsContainer.remove();
    appointmentDetailsContainer = null;
  }
}

function showAppointmentDetails(appointment, index) {
  clearAppointmentDetails();

  appointmentDetailsContainer = document.createElement('section');
  appointmentDetailsContainer.id = 'appointmentDetails';
  appointmentDetailsContainer.style.border = '1px solid #333';
  appointmentDetailsContainer.style.padding = '15px';
  appointmentDetailsContainer.style.marginTop = '20px';
  appointmentDetailsContainer.style.backgroundColor = '#f9f9f9';

  appointmentDetailsContainer.innerHTML = `
    <h3>Ficha de Cita #${index + 1}</h3>
    <p><strong>Dueño:</strong> ${appointment.ownerName}</p>
    <p><strong>Mascota:</strong> ${appointment.petName}</p>
    <p><strong>Especie y Raza:</strong> ${appointment.speciesBreed}</p>
    <p><strong>Fecha y Hora:</strong> ${new Date(appointment.appointmentDateTime).toLocaleString()}</p>
    <p><strong>Síntomas:</strong> ${appointment.symptoms || 'Ninguno'}</p>
    <button id="backToMenuBtn">Volver al Menú</button>
  `;

  appointmentForm.parentNode.insertBefore(appointmentDetailsContainer, appointmentForm.nextSibling);

  // Ocultar formulario y menú para mostrar solo la ficha
  appointmentForm.classList.add('hidden');
  mainMenu.classList.add('hidden');

  // Botón para volver al menú principal
  document.getElementById('backToMenuBtn').addEventListener('click', () => {
    clearAppointmentDetails();
    showMenu();
    appointmentForm.reset();
  });
}

// FORMULARIO CITA MÉDICA
function submitAppointment() {
  const ownerName = document.getElementById('ownerName').value.trim();
  const petName = document.getElementById('petName').value.trim();
  const speciesBreed = document.getElementById('speciesBreed').value.trim();
  const appointmentDateTime = document.getElementById('appointmentDateTime').value;
  const symptoms = document.getElementById('symptoms').value.trim();

  if (!ownerName || !petName || !speciesBreed || !appointmentDateTime) {
    showMessage('appointmentForm', 'Por favor, completa todos los campos obligatorios.', 'error');
    return;
  }

  let appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  const newAppointment = { ownerName, petName, speciesBreed, appointmentDateTime, symptoms };
  appointments.push(newAppointment);
  localStorage.setItem('appointments', JSON.stringify(appointments));

  showMessage('appointmentForm', 'Cita agendada con éxito.', 'success');
  
  // Mostrar ficha justo después de agendar sin alertas ni tiempo de espera
  showAppointmentDetails(newAppointment, appointments.length - 1);
}

// FORMULARIO REGISTRO MASCOTA
petRegistrationForm.addEventListener('submit', e => {
  e.preventDefault();

  const nombre = petRegistrationForm.nombre.value.trim();
  const especie = petRegistrationForm.especie.value;
  const raza = petRegistrationForm.raza.value;
  const genero = petRegistrationForm.genero.value;
  const edad = petRegistrationForm.edad.value;
  const observaciones = petRegistrationForm.observaciones.value.trim();

  if (!nombre || !especie || !raza || !genero || !edad) {
    showMessage('petForm', 'Por favor, completa todos los campos obligatorios.', 'error');
    return;
  }

  let pets = JSON.parse(localStorage.getItem('pets') || '[]');
  pets.push({ nombre, especie, raza, genero, edad, observaciones });
  localStorage.setItem('pets', JSON.stringify(pets));

  showMessage('petForm', 'Mascota registrada con éxito.', 'success');
  petRegistrationForm.reset();
  setTimeout(goToMenu, 2000);
});

// FUNCIONES DEMO
function showReports() {
  const appointments = JSON.parse(localStorage.getItem('appointments') || '[]');
  if (appointments.length === 0) {
    alert('No hay citas registradas.');
  } else {
    // En lugar de alert, mostrar en ficha (puedes adaptar para mostrar todas las citas si quieres)
    let reportWindow = window.open('', 'Reportes de Citas', 'width=600,height=400');
    reportWindow.document.write('<h2>Reporte de Citas</h2>');
    appointments.forEach((a, i) => {
      reportWindow.document.write(`<p><strong>Cita #${i+1}</strong><br>Dueño: ${a.ownerName}<br>Mascota: ${a.petName}<br>Fecha: ${new Date(a.appointmentDateTime).toLocaleString()}<br>Síntomas: ${a.symptoms || 'Ninguno'}</p><hr>`);
    });
  }
}

function showUserData() {
  const storedUser = JSON.parse(localStorage.getItem('user'));
  if (!storedUser) {
    alert('No hay datos registrados.');
  } else {
    alert(`Correo: ${storedUser.email}`);
  }
}

function logout() {
  showLogin();
  alert('Has cerrado sesión.');
}