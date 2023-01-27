const btnLogin = document.querySelector('.login-btn');
const loginModal = document.querySelector('.login-modal');
const closeLoginModal = document.querySelector('.close-login-modal');
const overlay = document.querySelector('.overlay');

function showModalFN() {
  overlay.classList.remove('hidden');
  loginModal.classList.remove('hidden');
}

function closeModalFN() {
  overlay.classList.add('hidden');
  loginModal.classList.add('hidden');
}

btnLogin.addEventListener('click', showModalFN);
closeLoginModal.addEventListener('click', closeModalFN);
overlay.addEventListener('click', closeModalFN);

document.addEventListener('keydown', function (e) {
  console.log(e);
  if (e.key === 'Escape' && !loginModal.classList.contains('hidden')) {
    closeModalFN();
  }
});
