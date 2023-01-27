const loginSingupForm = document.querySelector('.login-signup-form');
const openLoginModal = document.querySelector('.open-login-modal');
const loginModal = document.querySelector('.login-modal');
const closeLoginModal = document.querySelector('.close-login-modal');
const overlay = document.querySelector('.overlay');

const btnSignup = document.querySelector('.btn-signup');
const btnLogin = document.querySelector('.btn-login');
const btnUpload = document.querySelector('.upload-btn');
const btnSave = document.querySelector('.btn-save');
const btnGetData = document.querySelector('.btn-get-data');
const btnUpdateData = document.querySelector('.btn-update-data');
const btnDeleteData = document.querySelector('.btn-delete-data');
let isLoggedIn = false;

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyBewLoXI3zKgMTIJBRGiKAIePL41nq8N34',
  authDomain: 'tik-tok-787b6.firebaseapp.com',
  projectId: 'tik-tok-787b6',
  storageBucket: 'tik-tok-787b6.appspot.com',
  messagingSenderId: '664962763377',
  appId: '1:664962763377:web:5a02eeeeb2f8cad687a9d0',
  measurementId: 'G-W129084451',
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();

function loggedInTrue(email) {
  const loginBox = document.querySelector('.login');
  loginBox.classList.add('hidden');
  openLoginModal.classList.add('hidden');
  const userName = email.slice(0, email.indexOf('@'));
  const nav = document.querySelector('.nav-right');
  const userNamePara = `<p class="username-para">${userName}</p>`;
  nav.insertAdjacentHTML('afterbegin', userNamePara);
}

function register() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth
    .createUserWithEmailAndPassword(email, password)
    .then((resolve) => {
      console.log(resolve.user);
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });

  loginSingupForm.reset();
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((resolve) => {
      console.log(resolve.user);
      isLoggedIn = true;
      overlay.classList.add('hidden');
      loginModal.classList.add('hidden');
      loggedInTrue(email);
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });

  loginSingupForm.reset();
}

//# Save Data
function saveData() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  db.collection('users')
    .add({
      email: email,
      password: password,
    })
    .then((docRef) => {
      console.log('Document written with ID:', docRef.id);
    })
    .catch((error) => {
      console.log('Error adding document:', error);
    });
}

//# Read Data
function readData() {
  db.collection('users')
    .get()
    .then((data) => {
      console.log(
        data.docs.map((item) => {
          return { ...item.data(), id: item.id };
        })
      );
    });
}

//# Update Data
function updateData() {
  db.collection('users')
    .doc('AvViG5qIFakljTBmFn2H')
    .update({ email: 'dayaChettri073@gmail.com', password: '123456' })
    .then(() => {
      alert('Data Updated');
    });
}

//# Delete Data
function deleteData() {
  db.collection('users')
    .doc('AvViG5qIFakljTBmFn2H')
    .delete()
    .then(() => {
      alert('Data Deleted');
    });
}

//# Event Listeners
// btnSignup.addEventListener('click', (event) => {
//   event.preventDefault();
//   register();
// });

// btnLoginModal.addEventListener('click', (event) => {
//   event.preventDefault();
//   login();
// });

// btnSave.addEventListener('click', (event) => {
//   saveData();
// });

// btnGetData.addEventListener('click', (event) => {
//   readData();
// });

// btnUpdateData.addEventListener('click', (event) => {
//   updateData();
// });
// btnDeleteData.addEventListener('click', (event) => {
//   deleteData();
// });

//# Login / Signup Modal
function showModalFN() {
  overlay.classList.remove('hidden');
  loginModal.classList.remove('hidden');
}

function closeModalFN() {
  overlay.classList.add('hidden');
  loginModal.classList.add('hidden');
}

openLoginModal.addEventListener('click', showModalFN);
closeLoginModal.addEventListener('click', closeModalFN);
overlay.addEventListener('click', closeModalFN);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) {
    closeModalFN();
  }
});

btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  login();
});
