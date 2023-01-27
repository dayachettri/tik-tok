const form = document.querySelector('form');
const btnSignup = document.querySelector('.btn-signup');
const btnLogin = document.querySelector('.btn-login');
const btnSave = document.querySelector('.btn-save');
const btnGetData = document.querySelector('.btn-get-data');
const btnUpdateData = document.querySelector('.btn-update-data');
const btnDeleteData = document.querySelector('.btn-delete-data');

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

  form.reset();
}

function login() {
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  auth
    .signInWithEmailAndPassword(email, password)
    .then((resolve) => {
      console.log(resolve.user);
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });

  form.reset();
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
btnSignup.addEventListener('click', (event) => {
  event.preventDefault();
  register();
});

btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  login();
});

btnSave.addEventListener('click', (event) => {
  saveData();
});

btnGetData.addEventListener('click', (event) => {
  readData();
});

btnUpdateData.addEventListener('click', (event) => {
  updateData();
});
btnDeleteData.addEventListener('click', (event) => {
  deleteData();
});

// const menu = document.querySelector('.menu');
// const dropDown = document.querySelector('.drop-down');

// dropDown.addEventListener('mouseenter', () => {
//   menu.classList.remove('hidden');
// });

// menu.addEventListener('mouseleave', () => {
//   menu.classList.add('hidden');
// });

// let video = document.querySelectorAll('video');
// video.forEach((video) => {
//   let playPromise = video.play();
//   if (playPromise !== undefined) {
//     playPromise.then(() => {
//       let observer = new IntersectionObserver(
//         (entries) => {
//           entries.forEach((entry) => {
//             video.muted = false;
//             if (entry.intersectionRatio !== 1 && !video.paused) {
//               video.pause();
//             } else if (entry.intersectionRatio > 0.5 && video.paused) {
//               video.play();
//             }
//           });
//         },
//         { threshold: 0.5 }
//       );
//       observer.observe(video);
//     });
//   }
// });
