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
const uploadingAnimation = document.querySelector('.uploading-animation');
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
const storageRef = firebase.storage().ref();
const videosRef = storageRef.child('videos');
let userName = null;
let postsData = null;
let file = null;
let caption = null;

//# Autologin if user had logged in before
window.addEventListener('load', () => {
  const data = JSON.parse(localStorage.getItem('userData'));
  if (data) {
    auth
      .signInWithEmailAndPassword(data[0].email, data[0].password)
      .then((resolve) => {
        console.log(resolve.user);
        isLoggedIn = true;
        // overlay.classList.add('hidden');
        // loginModal.classList.add('hidden');
        loggedInTrue(data[0].email);
      });
  }
});

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

//# Signup fn
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

//# Login fn
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
      const userData = [{ email, password }];
      window.localStorage.setItem('userData', JSON.stringify(userData));
    })
    .catch((error) => {
      alert(error.message);
      console.log(error.code);
      console.log(error.message);
    });

  loginSingupForm.reset();
}

//# Save Data fn
function saveData(link, caption) {
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
      renderPost(postsData);
    });
}

//# Update Data
function updateData(id, object) {
  db.collection('posts')
    .doc(id)
    .update(object)
    .then(() => {
      alert('Data Updated');
    });
}

//# Update Likes
document.body.addEventListener('click', (event) => {
  if (loggedInTrue && event.target.classList.contains('fa-heart')) {
    const element = event.target;
    const likeEl = element.nextElementSibling;
    const postId = element.closest('.post').dataset.id;
    const objectID = postId;

    const objectRef = firebase.firestore().collection('posts').doc(objectID);
    objectRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          const currentObjectData = { ...doc.data() };
          const currentLikes = currentObjectData.likes;
          console.log(currentObjectData);
          updateData(objectID, {
            ...currentObjectData,
            likes: currentLikes + 1,
          });
          likeEl.textContent = currentLikes + 1;
          element.style.color = '#fe2c55';
        } else {
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }
});

document.body.addEventListener('click', (event) => {
  if (isLoggedIn && event.target.classList.contains('fa-share')) {
    const element = event.target;
    const modal = document.getElementById('copied-alert');
    const currentPost = element.closest('.post');
    const link = currentPost.querySelector('source').src;
    navigator.clipboard.writeText(link);

    modal.style.display = 'block';
    setTimeout(function () {
      modal.style.display = 'none';
    }, 2000);
  }
});

//# Delete Data
function deleteData() {
  db.collection('users')
    .doc('AvViG5qIFakljTBmFn2H')
    .delete()
    .then(() => {
      alert('Data Deleted');
    });
}

//# Upload video fn
chooseFileInput.addEventListener('change', (event) => {
  file = event.target.files[0];
  console.log(file);
});

function uploadVideo() {
  if (file === null) return;
  const videoRef = videosRef.child(file.name);

  const uploadTask = videoRef.put(file);
  uploadTask.on(
    'state_changed',
    function progress(snapshot) {
      uploadingAnimation.classList.remove('hidden');
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
          uploadingAnimation.classList.add('hidden');
        });
    }
  );
}

//# Render posts fn
function renderPost(object) {
  const posts = object
    .map((item) => {
      return `
     <div class="post" data-id="${item.id}">
    <div class="post-info">
      <div class="user">
        <img
          src="https://api.dicebear.com/5.x/croodles/svg?seed=${item.id}"
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
        loop
        controls 
        disablepictureinpicture 
        controlslist="nodownload noplaybackrate"
      >
        <source class="source"
          src="${item.link}"
          type="video/mp4"
        />
      </video>
      <div class="video-icons">
        <a href="#">
          <i class="fas fa-heart fa-lg"></i>
          <span class="likes-count">${item.likes}</span>
        </a>
        <a href="#">
          <i class="fas fa-comment-dots fa-lg openCommentsModal"></i>
          <span class="comment-count">${item.comments.length}</span>
        </a>
        <a href="#">
          <i class="fas fa-share fa-lg"></i>
        </a>
      </div>
    </div>
            <div class="comment-modal hidden">
          <svg class="tiktok-1anes8e-StyledIcon e1gjoq3k3 close-comments-modal" width="1em" data-e2e="" height="1em"
            viewBox="0 0 48 48" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path fill-rule="evenodd" clip-rule="evenodd"
              d="M21.1718 23.9999L10.2931 13.1212C9.90261 12.7307 9.90261 12.0975 10.2931 11.707L11.7074 10.2928C12.0979 9.90228 12.731 9.90228 13.1216 10.2928L24.0002 21.1715L34.8789 10.2928C35.2694 9.90228 35.9026 9.90228 36.2931 10.2928L37.7073 11.707C38.0979 12.0975 38.0979 12.7307 37.7073 13.1212L26.8287 23.9999L37.7073 34.8786C38.0979 35.2691 38.0979 35.9023 37.7073 36.2928L36.2931 37.707C35.9026 38.0975 35.2694 38.0975 34.8789 37.707L24.0002 26.8283L13.1216 37.707C12.731 38.0975 12.0979 38.0975 11.7074 37.707L10.2931 36.2928C9.90261 35.9023 9.90261 35.2691 10.2931 34.8786L21.1718 23.9999Z">
            </path>
          </svg>
          <input type="text" class="commentInput">
          <button class="submitCommentBtn">Submit</button>
          <div class="commentsContainer ">

          </div>
        </div>
  </div>
    `;
    })
    .join('');
  postsContainer.insertAdjacentHTML('afterbegin', posts);
  playPauseVideo();
}

//# Event Listeners
btnLogin.addEventListener('click', (event) => {
  event.preventDefault();
  login();
});

btnSignup.addEventListener('click', (event) => {
  event.preventDefault();
  register();
});

btnUpload.addEventListener('click', uploadVideo);

//# MODALS
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

function playPauseVideo() {
  const videos = document.querySelectorAll('video');
  let currentVideo = null;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const video = entry.target;
      if (entry.isIntersecting) {
        video.muted = false;
        video.play();
        if (currentVideo && currentVideo !== video) {
          currentVideo.pause();
        }
        currentVideo = video;
      } else {
        video.pause();
      }
    });
  });

  videos.forEach((video) => observer.observe(video));
}

function renderComments(array, element) {
  const comments = array
    .map((comment) => {
      return `
       <div class="comment">
      <span class="username">${comment.userName}</span>
      <p class="usercomment">${comment.comment}</p>
    </div>`;
    })
    .join('');
  element.insertAdjacentHTML('afterbegin', comments);
}

document.body.addEventListener('click', (event) => {
  if (event.target.classList.contains('openCommentsModal') && isLoggedIn) {
    let commentArray = null;
    const postId =
      event.target.parentElement.parentElement.parentElement.parentElement
        .dataset.id;
    console.log(postId);
    const element =
      event.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        '.comment-modal'
      );
    const commentsContainer =
      event.target.parentElement.parentElement.parentElement.parentElement.querySelector(
        '.commentsContainer'
      );
    commentsContainer.innerHTML = '';
    element.classList.remove('hidden');

    let objectID = postId;
    const objectRef = firebase.firestore().collection('posts').doc(objectID);
    objectRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          const currentObjectData = { ...doc.data() };
          const currentObjectComments = currentObjectData.comments;
          commentArray = currentObjectComments;
          renderComments(commentArray, commentsContainer);
          console.log(currentObjectComments);
        } else {
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
  }

  if (event.target.classList.contains('close-comments-modal') && isLoggedIn) {
    const element = event.target.parentElement;
    element.classList.add('hidden');
  }

  if (event.target.classList.contains('submitCommentBtn') && isLoggedIn) {
    const postId = event.target.parentElement.parentElement.dataset.id;
    console.log(postId);
    let commentInput = event.target.previousElementSibling;
    const commentsContainer =
      event.target.parentElement.querySelector('.commentsContainer');
    const object = {
      userName,
      comment: commentInput.value,
    };

    let objectID = postId;
    const objectRef = firebase.firestore().collection('posts').doc(objectID);
    objectRef
      .get()
      .then(function (doc) {
        if (doc.exists) {
          console.log('Document data:', doc.data());
          const currentObjectData = { ...doc.data() };
          const currentObjectComments = currentObjectData.comments;
          const comments = [...currentObjectComments, object];
          updateData(objectID, {
            ...currentObjectData,
            comments,
          });
        } else {
          console.log('No such document!');
        }
      })
      .catch(function (error) {
        console.log('Error getting document:', error);
      });
    let newComment = `
    <div class="comment">
      <span class="username">${userName}</span>
      <p class="usercomment">${commentInput.value}</p>
    </div>`;
    commentsContainer.insertAdjacentHTML('afterbegin', newComment);

    commentInput.value = '';
    console.log(object);
  }
});
