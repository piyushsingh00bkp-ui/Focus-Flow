// ---- ELEMENTS ----
const startBtn = document.getElementById("btn");
const resetBtn = document.getElementById("resetBtn");
const statusEl = document.getElementById("status");
const timerEl = document.getElementById("timer");
const sessionNumEl = document.getElementById("sessionNum");
const ring = document.getElementById("progressRing");

// ---- CONSTANTS ----
const FOCUS_TIME = 25 * 60;
const BREAK_TIME = 5 * 60;
const CIRCUMFERENCE = 502;

// ---- STATE ----
let timeLeft = FOCUS_TIME;
let isRunning = false;
let isBreak = false;
let sessionCount = 0;
let timer = null;

// ---- INIT ----
loadSessions();
restoreTimer();

// ---- RESTORE TIMER ----
function restoreTimer() {
  chrome.storage.local.get(
    ["startTime", "totalTime", "isBreak", "isRunning", "pausedTimeLeft"],
    (data) => {
      // Restore paused state
      if (!data.isRunning && data.pausedTimeLeft) {
        isBreak = data.isBreak || false;
        timeLeft = data.pausedTimeLeft;

        if (isBreak) {
          statusEl.textContent = "Break Time!";
          document.body.classList.add("break-mode");
        } else {
          statusEl.textContent = "Ready to focus?";
        }

        updateDisplay(timeLeft);
        updateRing(timeLeft, isBreak ? BREAK_TIME : FOCUS_TIME);
        return;
      }

      // Restore running state
      if (data.isRunning && data.startTime) {
        const elapsed = Math.floor((Date.now() - data.startTime) / 1000);
        const remaining = data.totalTime - elapsed;

        if (remaining > 0) {
          isBreak = data.isBreak;
          timeLeft = remaining;

          if (isBreak) {
            statusEl.textContent = "Break Time!";
            document.body.classList.add("break-mode");
          }

          updateDisplay(timeLeft);
          updateRing(timeLeft, data.totalTime);

          startBtn.textContent = "Stop";
          isRunning = true;

          timer = setInterval(() => {
            timeLeft--;
            updateDisplay(timeLeft);
            updateRing(timeLeft, data.totalTime);

            if (timeLeft <= 0) {
              clearInterval(timer);
              timer = null;
              isRunning = false;
              startBtn.textContent = "Start";
              chrome.storage.local.set({ isRunning: false });
            }
          }, 1000);
        }
      }
    },
  );
}

// ---- RING UPDATE ----
function updateRing(timeLeft, totalTime) {
  const progress = timeLeft / totalTime;
  const offset = CIRCUMFERENCE * (1 - progress);
  ring.style.strokeDashoffset = String(offset);
}

// ---- TIMER DISPLAY ----
function updateDisplay(seconds) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  timerEl.textContent = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

// ---- START / STOP ----
startBtn.addEventListener("click", () => {
  if (!isRunning) {
    // START
    isRunning = true;
    startBtn.textContent = "Stop";

    const startTime = Date.now();
    const total = isBreak ? BREAK_TIME : FOCUS_TIME;
    chrome.storage.local.set({
      startTime: startTime,
      totalTime: total,
      isBreak: isBreak,
      isRunning: true,
    });

    chrome.alarms.create(isBreak ? "breakEnd" : "focusEnd", {
      delayInMinutes: total / 60,
    });

    timer = setInterval(() => {
      timeLeft--;
      const total = isBreak ? BREAK_TIME : FOCUS_TIME;

      updateDisplay(timeLeft);
      updateRing(timeLeft, total);

      if (timeLeft <= 0) {
        clearInterval(timer);
        timer = null;
        isRunning = false;
        startBtn.textContent = "Start";

        if (!isBreak) {
          sessionCount++;
          sessionNumEl.textContent = sessionCount;
          saveSessions();

          isBreak = true;
          timeLeft = BREAK_TIME;
          statusEl.textContent = "Break Time!";
          document.body.classList.add("break-mode");

          sendNotification("Focus session done!", "Time for a 5 minute break.");
        } else {
          isBreak = false;
          timeLeft = FOCUS_TIME;
          statusEl.textContent = "Ready to focus?";
          document.body.classList.remove("break-mode");

          sendNotification("Break over!", "Time to get back to work.");
        }

        updateDisplay(timeLeft);
        updateRing(timeLeft, isBreak ? BREAK_TIME : FOCUS_TIME);
        chrome.storage.local.set({ isRunning: false });
      }
    }, 1000);
  } else {
    // STOP
    clearInterval(timer);
    timer = null;
    isRunning = false;
    startBtn.textContent = "Start";
    chrome.alarms.clearAll();
    chrome.storage.local.set({
      isRunning: false,
      pausedTimeLeft: timeLeft,
      isBreak: isBreak,
    });
  }
});

// ---- RESET ----
resetBtn.addEventListener("click", () => {
  clearInterval(timer);
  timer = null;
  isRunning = false;
  isBreak = false;
  timeLeft = FOCUS_TIME;

  startBtn.textContent = "Start";
  statusEl.textContent = "Ready to focus?";
  document.body.classList.remove("break-mode");

  updateDisplay(timeLeft);
  updateRing(timeLeft, FOCUS_TIME);

  chrome.alarms.clearAll();
  chrome.storage.local.remove([
    "startTime",
    "totalTime",
    "isRunning",
    "isBreak",
    "pausedTimeLeft",
  ]);
});

// ---- NOTIFICATIONS ----
function sendNotification(title, message) {
  chrome.notifications.create({
    type: "basic",
    iconUrl: "icons/icon48.png",
    title: title,
    message: message,
  });
}

// ---- STORAGE ----
function saveSessions() {
  chrome.storage.local.set({ sessions: sessionCount });
}

function loadSessions() {
  chrome.storage.local.get("sessions", (data) => {
    if (data.sessions) {
      sessionCount = data.sessions;
      sessionNumEl.textContent = sessionCount;
    }
  });
}
