import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

const startBtn = document.querySelector('[data-start]');
const dataDaysEl = document.querySelector('[data-days]');
const dataHoursEl = document.querySelector('[data-hours]');
const dataMinutsEl = document.querySelector('[data-minutes]');
const dataSecondEl = document.querySelector('[data-seconds]');
const inputEl = document.querySelector('#datetime-picker');

startBtn.disabled = true;
let userSelectedDate = null;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0] || null;
    const now = new Date();
    if (userSelectedDate.getTime() <= now) {
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
  onChange(selectedDates) {
    userSelectedDate = selectedDates[0] || null;
    const now = new Date();
    if (selectedDates[0] <= now) {
      iziToast.show({
        title: 'Hey',
        message: 'Please choose a date in the future',
        color: 'green',
        position: 'topRight',
        progressBarColor: 'darkred',
      });
      return (startBtn.disabled = true);
    } else if (selectedDates[0] > now) {
      return (startBtn.disabled = false);
    }
  },
};

flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', () => {
  // console.log('Start!');
  updateTimer();
  startBtn.disabled = true;
  inputEl.disabled = true;
  timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const now = new Date();
  const diff = userSelectedDate - now;

  if (diff <= 0) {
    clearInterval(timerId);
    startBtn.disabled = false;
    inputEl.disabled = false;
    // console.log('Time is up!');
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(diff);
  // console.log({ days, hours, minutes, seconds });

  addLeadingZero({ days, hours, minutes, seconds });
}

function convertMs(ms) {
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  const days = Math.floor(ms / day);
  const hours = Math.floor((ms % day) / hour);
  const minutes = Math.floor(((ms % day) % hour) / minute);
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}

function addLeadingZero(value) {
  dataDaysEl.textContent = String(value.days).padStart(2, '0');
  dataHoursEl.textContent = String(value.hours).padStart(2, '0');
  dataMinutsEl.textContent = String(value.minutes).padStart(2, '0');
  dataSecondEl.textContent = String(value.seconds).padStart(2, '0');
}
