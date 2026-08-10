const startBtn = document.getElementById("btn");
const status = document.getElementById("status");
const time = document.getElementById("timer");

let isFocusing = false;
let timeLeft = 25 * 60 * 1000;
let timer = null;
let isBreak = false;
let breakTime = 5 * 60 * 1000;

startBtn.addEventListener("click", () => {

    if (isFocusing === false) {

        // START
        isFocusing = true;
        status.textContent = "Focus Mode On";
        startBtn.textContent = "Stop";

        console.log("TIMER STARTED");

        timer = setInterval(() => {

            timeLeft -= 10;

            // TIMER FINISHED
            if (timeLeft <= 0) {

                clearInterval(timer);
                timer = null;

                if (isBreak === false) {

                    // Focus ended → start break
                    isBreak = true;
                    timeLeft = breakTime;
                    status.textContent = "Break Time!";

                    // Auto start break
                    timer = setInterval(() => {

                        timeLeft -= 10;

                        if (timeLeft <= 0) {

                            clearInterval(timer);
                            timer = null;

                            isBreak = false;
                            isFocusing = false;
                            timeLeft = 25 * 60 * 1000;

                            status.textContent = "Ready to focus?";
                            startBtn.textContent = "Start";
                            time.textContent = "25:00:000";

                            return;
                        }

                        let minutes = Math.floor(timeLeft / 60000);
                        let seconds = Math.floor(
                            (timeLeft % 60000) / 1000
                        );
                        let milliseconds = timeLeft % 1000;

                        time.textContent =
                            `${String(minutes).padStart(2, "0")}:` +
                            `${String(seconds).padStart(2, "0")}:` +
                            `${String(milliseconds).padStart(3, "0")}`;

                    }, 10);

                }

            }

            let minutes = Math.floor(timeLeft / 60000);
            let seconds = Math.floor(
                (timeLeft % 60000) / 1000
            );
            let milliseconds = timeLeft % 1000;

            time.textContent =
                `${String(minutes).padStart(2, "0")}:` +
                `${String(seconds).padStart(2, "0")}:` +
                `${String(milliseconds).padStart(3, "0")}`;

        }, 10);

    } else {

        // STOP MANUALLY
        isFocusing = false;

        status.textContent = "Ready to focus?";
        startBtn.textContent = "Start";

        clearInterval(timer);
        timer = null;

        isBreak = false;
        timeLeft = 25 * 60 * 1000;

        time.textContent = "25:00:000";

        console.log("TIMER STOPPED");
    }

});