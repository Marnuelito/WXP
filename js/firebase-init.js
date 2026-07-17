// ==========================================================================
// FIREBASE - INICIALIZACIÓN
// ==========================================================================

firebase.initializeApp(firebaseConfig);
const galeriaDB = firebase.database();
const galeriaRef = galeriaDB.ref('dibujos');
const galeriaAuth = firebase.auth();

// Estado global de autenticación
let galeriaUsuarioActual = null;

// Iniciar sesión anónima automáticamente
galeriaAuth.signInAnonymously().catch(error => {
  console.error('Auth error:', error);
});

galeriaAuth.onAuthStateChanged(async user => {
  galeriaUsuarioActual = user;
  if (user) {
    console.log('Usuario conectado:', user.uid);

    // Verificar si es admin
    try {
      const snap = await galeriaDB.ref('admins/' + user.uid).once('value');
      if (snap.exists() && snap.val() === true) {
        galeriaAdminActivo = true;
        galeriaMostrarIndicadorAdmin();
        console.log('🔒 Modo admin activado automáticamente');

        // Si hay un dibujo seleccionado, mostrar botón delete
        if (galeriaSeleccionado) {
          document.getElementById('mypicturesBtnDelete').style.display = 'flex';
        }
      }
    } catch (error) {
      console.log('No es admin:', error);
    }
  }
});