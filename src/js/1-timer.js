import flatpickr from 'flatpickr';
import iziToast from 'izitoast';

let userSelectedDate = null;
let userSelectedSeconds = null;
let secondsNow;
let timerId = null;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,

  onClose(selectedDates) {
    userSelectedDate = selectedDates[0] || null;
    const now = options.defaultDate;
    userSelectedSeconds = Math.floor(userSelectedDate.getTime() / 1000);
    secondsNow -= Math.floor(now.getTime() / 1000);

    if (!userSelectedDate || userSelectedDate.getTime() <= now) {
      // window.alert('Please choose a date in the future');
      iziToast.show({
        title: 'Hey',
        message: 'Please choose a date in the future',
        color: 'red',
        position: 'topRight',
        progressBarColor: 'darkred',
      });
      startBtn.disabled = true;
    } else {
      startBtn.disabled = false;
    }
  },
  onChange(selectedDates) {
    userSelectedDate = selectedDates[0] || null;
    const now = options.defaultDate;
    userSelectedSeconds = Math.floor(userSelectedDate.getTime() / 1000);
    secondsNow -= Math.floor(now.getTime() / 1000);

    if (selectedDates[0] <= now) {
      return (startBtn.disabled = true);
    } else if (selectedDates[0] > now) {
      return (startBtn.disabled = false);
    }
  },
};

const startBtn = document.querySelector('[data-start]');
const dataDaysEl = document.querySelector('[data-days]');
const dataHoursEl = document.querySelector('[data-hours]');
const dataMinutsEl = document.querySelector('[data-minutes]');
const dataSecondEl = document.querySelector('[data-seconds]');

flatpickr('#datetime-picker', options);

startBtn.addEventListener('click', () => {
  console.log('Start!');
  updateTimer();
  timerId = setInterval(updateTimer, 1000);
});

function updateTimer() {
  const now = new Date();
  const diff = userSelectedDate - now;

  if (diff <= 0) {
    clearInterval(timerId);
    console.log('Time is up!');
    return;
  }
  const { days, hours, minutes, seconds } = convertMs(diff);
  console.log({ days, hours, minutes, seconds });

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

// clearInterval(intervalId);
function addLeadingZero(value) {
  dataDaysEl.textContent = String(value.days).padStart(2, '0');
  dataHoursEl.textContent = String(value.hours).padStart(2, '0');
  dataMinutsEl.textContent = String(value.minutes).padStart(2, '0');
  dataSecondEl.textContent = String(value.seconds).padStart(2, '0');
}
