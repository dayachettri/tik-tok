// import { getStorage, ref, uploadBytes } from 'firebase/storage';

const loginSingupForm = document.querySelector('.login-signup-form');
const openLoginModal = document.querySelector('.open-login-modal');
const loginModal = document.querySelector('.login-modal');
const closeLoginModal = document.querySelector('.close-login-modal');
const overlay = document.querySelector('.overlay');
const uploadModal = document.querySelector('.upload-modal');
const openUploadModal = document.querySelector('.open-upload-modal');
const closeUploadModal = document.querySelector('.close-upload-modal');
const chooseFileInput = document.querySelector('#choose-file');
const btnUpload = document.querySelector('.upload-btn');
const btnSignup = document.querySelector('.btn-signup');
const btnLogin = document.querySelector('.btn-login');
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
const storage = firebase.storage();
// const storageRef = storage.ref();
const storageRef = firebase.storage().ref();
const videosRef = storageRef.child('videos');

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

//# Upload Modal
function showUploadModalFN() {
  if (isLoggedIn) {
    overlay.classList.remove('hidden');
    uploadModal.classList.remove('hidden');
  }
}

function closeUploadModalFN() {
  overlay.classList.add('hidden');
  uploadModal.classList.add('hidden');
}

openUploadModal.addEventListener('click', showUploadModalFN);
closeUploadModal.addEventListener('click', closeUploadModalFN);
overlay.addEventListener('click', closeUploadModalFN);

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape' && !uploadModal.classList.contains('hidden')) {
    closeUploadModalFN();
  }
});

let file = null;

function uploadVideo() {
  if (file === null) return;
  // const videoRef = ref(storage, `videos/${file.name}`);

  var videoRef = videosRef.child(file.name);

  // uploadBytes(videoRef, file).then((snapshot) => {
  //   console.log('Uploaded a blob or file!');
  // });
  // ref.put(videoRef).then((snapshot) => {
  //   console.log('Uploaded a blob or file!');
  // });

  const uploadTask = videoRef.put(file);
  uploadTask.on(
    'state_changed',
    function progress(snapshot) {
      console.log('uploading');
    },
    function error(err) {
      // Handle errors
    },
    function complete() {
      // Handle completion
      console.log('completed');
      return uploadTask.snapshot.ref
        .getDownloadURL()
        .then((result) => {
          console.log(result);
        })
        .then(() => {
          overlay.classList.add('hidden');
          uploadModal.classList.add('hidden');
        });
    }
  );
}

chooseFileInput.addEventListener('change', (event) => {
  file = event.target.files[0];
  console.log(file);
});

btnUpload.addEventListener('click', uploadVideo);
