const timer = {
    pomodoro: 25,
    shortBreak: 5,
    longBreak: 15,
    longBreakInterval: 4,
    sessions: 0,
    remainingTime: {
      total: 0,
      minutes: 0,
      seconds: 0,
    },
    mode: 'pomodoro',
  };
  
  let interval;
  
  const buttonSound = new Audio('button-sound.mp3');
  const mainButton = document.getElementById('js-btn');
  mainButton.addEventListener('click', () => {
    buttonSound.play();
    const { action } = mainButton.dataset;
    if (action === 'start') {
      startTimer();
    } else {
      stopTimer();
    }
  });
  
  const modeButtons = document.querySelector('#js-mode-buttons');
  modeButtons.addEventListener('click', handleMode);
  
  // Function to open settings dialog box
  const settingsButton = document.getElementById('js-settings-btn');
  settingsButton.addEventListener('click', openSettingsDialog);
  
  // Function to open settings dialog box
  function openSettingsDialog() {
    const pomodoroInput = window.prompt("Enter Pomodoro duration (in minutes):", timer.pomodoro);
    if (pomodoroInput !== null) {
      timer.pomodoro = parseInt(pomodoroInput) || timer.pomodoro;
    }
    
    const shortBreakInput = window.prompt("Enter Short Break duration (in minutes):", timer.shortBreak);
    if (shortBreakInput !== null) {
      timer.shortBreak = parseInt(shortBreakInput) || timer.shortBreak;
    }
    
    const longBreakInput = window.prompt("Enter Long Break duration (in minutes):", timer.longBreak);
    if (longBreakInput !== null) {
      timer.longBreak = parseInt(longBreakInput) || timer.longBreak;
    }
    
    if (!interval) {
      timer.remainingTime.total = timer[timer.mode] * 60;
      timer.remainingTime.minutes = timer[timer.mode];
      timer.remainingTime.seconds = 0;
      updateClock();
    }
  }
  
  function getRemainingTime(endTime) {
    const currentTime = Date.parse(new Date());
    const difference = endTime - currentTime;
  
    const total = Number.parseInt(difference / 1000, 10);
    const minutes = Number.parseInt((total / 60) % 60, 10);
    const seconds = Number.parseInt(total % 60, 10);
  
    return {
      total,
      minutes,
      seconds,
    };
  }
  
  function startTimer() {
    let { total } = timer.remainingTime;
    const endTime = Date.parse(new Date()) + total * 1000;
  
    if (timer.mode === 'pomodoro') timer.sessions++;
  
    mainButton.dataset.action = 'stop';
    mainButton.textContent = 'stop';
    mainButton.classList.add('active');
  
    interval = setInterval(function() {
      timer.remainingTime = getRemainingTime(endTime);
      updateClock();
  
      total = timer.remainingTime.total;
      if (total <= 0) {
        clearInterval(interval);
  
        switch (timer.mode) {
          case 'pomodoro':
            if (timer.sessions % timer.longBreakInterval === 0) {
              switchMode('longBreak');
            } else {
              switchMode('shortBreak');
            }
            break;
          default:
            switchMode('pomodoro');
        }
  
        document.querySelector(`[data-sound="${timer.mode}"]`).play();
  
        startTimer();
      }
    }, 1000);
  }
  
  function stopTimer() {
    clearInterval(interval);
  
    mainButton.dataset.action = 'start';
    mainButton.textContent = 'start';
    mainButton.classList.remove('active');
  }
  
  function updateClock() {
    const { remainingTime } = timer;
    const minutes = `${remainingTime.minutes}`.padStart(2, '0');
    const seconds = `${remainingTime.seconds}`.padStart(2, '0');
  
    const min = document.getElementById('js-minutes');
    const sec = document.getElementById('js-seconds');
    min.textContent = minutes;
    sec.textContent = seconds;
  
    const progress = document.getElementById('js-progress');
    progress.value = timer[timer.mode] * 60 - timer.remainingTime.total;
  }
  
  function switchMode(mode) {
    timer.mode = mode;
    timer.remainingTime = {
      total: timer[mode] * 60,
      minutes: timer[mode],
      seconds: 0,
    };
  
    document
      .querySelectorAll('button[data-mode]')
      .forEach(e => e.classList.remove('active'));
    document.querySelector(`[data-mode="${mode}"]`).classList.add('active');
    document.body.style.backgroundColor = `var(--${mode})`;
    document
      .getElementById('js-progress')
      .setAttribute('max', timer.remainingTime.total);
  
    updateClock();
  }
  
  function handleMode(event) {
    const { mode } = event.target.dataset;
  
    if (!mode) return;
  
    switchMode(mode);
    stopTimer();
  }
  
  document.addEventListener('DOMContentLoaded', () => {
    switchMode('pomodoro');
  });
  
