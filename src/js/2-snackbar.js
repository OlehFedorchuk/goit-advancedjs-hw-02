import iziToast from 'izitoast';

const formEl = document.querySelector('.form');

formEl.addEventListener('submit', event => {
  event.preventDefault();

  const formData = new FormData(event.currentTarget);
  const delay = Number(formData.get('delay'));
  const state = formData.get('state');

  formEl.reset();

  const promise = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (state === 'fulfilled') {
        resolve(delay);
      } else {
        reject(delay);
      }
    }, delay);
  });

  promise
    .then(ms => {
      iziToast.show({
        message: `✅ Fulfilled promise in ${ms}ms`,
        position: 'topRight',
        color: 'green',
        timeout: 3000,
      });
    })
    .catch(ms => {
      iziToast.show({
        message: `❌ Rejected promise in ${ms}ms`,
        position: 'topRight',
        color: 'red',
        timeout: 3000,
      });
    });
});
