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
const videoCaption = document.querySelector('.video-caption');
const postsContainer = document.querySelector('.right');
let isLoggedIn = false;

const firebaseApp = firebase.initializeApp({
  apiKey: 'AIzaSyAFhj-Ow06G2yCAW1tnG8PaJQbB5dDzQsM',
  authDomain: 'tik-tok-7264f.firebaseapp.com',
  projectId: 'tik-tok-7264f',
  storageBucket: 'tik-tok-7264f.appspot.com',
  messagingSenderId: '167363836238',
  appId: '1:167363836238:web:e5e20b388984f7c62d061f',
  measurementId: 'G-9NZPW4P17P',
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebase.storage();
// const storageRef = storage.ref();
const storageRef = firebase.storage().ref();
const videosRef = storageRef.child('videos');

let userName = null;
function loggedInTrue(email) {
  const loginBox = document.querySelector('.login');
  loginBox.classList.add('hidden');
  openLoginModal.classList.add('hidden');
  userName = email.slice(0, email.indexOf('@'));
  const nav = document.querySelector('.nav-right');
  const userNamePara = `<p class="username-para">${userName}</p>`;
  nav.insertAdjacentHTML('afterbegin', userNamePara);
  readData();
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
function saveData(link, caption) {
  // const email = document.getElementById('email').value;
  // const password = document.getElementById('password').value;

  db.collection('posts')
    .add({
      link,
      caption,
      userName,
      likes: 0,
      comments: [],
    })
    .then((docRef) => {
      console.log('Document written with ID:', docRef.id);
    })
    .catch((error) => {
      console.log('Error adding document:', error);
    });
}

let postsData = null;

//# Read Data
function readData() {
  db.collection('posts')
    .get()
    .then((data) => {
      postsData = data.docs.map((item) => {
        return { ...item.data(), id: item.id };
      });
    })
    .then(() => {
      console.log(postsData);
    })
    .then(() => {
      renderPost(postsData);
    });
  // console.log(postsData);
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

btnSignup.addEventListener('click', (event) => {
  event.preventDefault();
  register();
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
let caption = null;

function uploadVideo() {
  if (file === null) return;
  const videoRef = videosRef.child(file.name);

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
        .then((url) => {
          saveData(url, videoCaption.value);
        })
        .then(() => {
          readData();
        })
        .then(() => {
          overlay.classList.add('hidden');
          uploadModal.classList.add('hidden');
        });
    }
  );
}

function renderPost(object) {
  const posts = object
    .map((item) => {
      return `
     <div class="post">
    <div class="post-info">
      <div class="user">
        <img
          src="https://avatars.githubusercontent.com/u/96167561?s=400&u=84eebc1422a650886bc43db91d5f193b6f627452&v=4"
          alt="avatar"
        />
        <div>
          <h6>${item.userName}</h6>
          <p>${item.caption}</p>
        </div>
      </div>
      <button>Follow</button>
    </div>
    <div class="post-content">
      <video
        autoplay
        muted 
        controls 
        loop 
        disablepictureinpicture 
        controlslist="nodownload noplaybackrate"
      >
        <source
          src="${item.link}"
          type="video/mp4"
        />
      </video>
      <div class="video-icons">
        <a href="#">
          <i class="fas fa-heart fa-lg"></i>
          <span>422</span>
        </a>
        <a href="#">
          <i class="fas fa-comment-dots fa-lg"></i>
          <span>123</span>
        </a>
        <a href="#">
          <i class="fas fa-share fa-lg"></i> <span>86</span>
        </a>
      </div>
    </div>
  </div>
    `;
    })
    .join('');
  postsContainer.insertAdjacentHTML('afterbegin', posts);
}

chooseFileInput.addEventListener('change', (event) => {
  file = event.target.files[0];
  console.log(file);
});

btnUpload.addEventListener('click', uploadVideo);

let video = document.body.querySelectorAll('video');
video.forEach((video) => {
  console.log(video);
  let playPromise = video.play();
  if (playPromise !== undefined) {
    playPromise.then(() => {
      let observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            video.muted = false;
            if (entry.intersectionRatio !== 1 && !video.paused) {
              video.pause();
            } else if (entry.intersectionRatio > 0.5 && video.paused) {
              video.play();
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(video);
    });
  }
});
