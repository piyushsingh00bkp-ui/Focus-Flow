// ---- ALARM LISTENER ----
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "focusEnd") {
    chrome.storage.local.set({ timerState: "breakStart" });
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Focus session done!",
      message: "Time for a 5 minute break.",
    });
  }

  if (alarm.name === "breakEnd") {
    chrome.storage.local.set({ timerState: "focusStart" });
    chrome.notifications.create({
      type: "basic",
      iconUrl: "icons/icon48.png",
      title: "Break over!",
      message: "Time to get back to work.",
    });
  }
});
