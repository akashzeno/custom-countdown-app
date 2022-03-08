// Input Container Variables and Constants
const inputContainer = document.querySelector("#input-container");
const countdownFrom = document.querySelector("#countdownFrom");
const dateElement = document.querySelector("#date-picker");

// Countdown Container Variables and Constants
const countdownElement = document.querySelector("#countdown");
const countdownElementTitle = document.querySelector("#countdown-title");
const countdownBtn = document.querySelector("#countdown-button");
const timeElements = document.querySelectorAll("span");

// Complete Container Variables and Constants
const completeElement = document.querySelector("#complete");
const completeElementInfo = document.querySelector("#complete-info");
const completeBtn = document.querySelector("#complete-button");

let countdownTitle;
let countdownDate;
let countdownActive;
let savedCountdown;

const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;

const audio = new Audio("static/media/audio/minimal.mp3");

// Set Date Input Min with Today's Date
const today = new Date().toISOString().slice(0, 10);
dateElement.setAttribute("min", today);

function restorePreviousCountdown() {
    // Getting the saved countdown from local storage
    if(localStorage.getItem("countdown")) {
    inputContainer.hidden = true;
    savedCountdown = JSON.parse(localStorage.getItem("countdown"));
    countdownTitle = savedCountdown.title;
    countdownDate = savedCountdown.date;
    updateCountdown();
    }
}

function resetCountdown() {
    // Stop audio from playing and resetting the audio
    audio.pause();
    audio.currentTime = 0;

    // Clear the countdown title and date
    countdownTitle = "";
    countdownDate = "";

    // hide complete container
    completeElement.hidden = true;

    // Hide Countdown
    countdownElement.hidden = true;

    // Show Input
    inputContainer.hidden = false;

    // Clear The Running Countdown Interval
    clearInterval(countdownActive);

    // Clear The Countdown Values from local storage
    localStorage.removeItem("countdown");
}


// Take Values from From Input
function updateCountdown(event) {
    // Preventing the default behavior of the form that reloads the page
    if(!countdownTitle && !countdownDate) {
    event.preventDefault();
    countdownTitle = event.srcElement[0].value;
    countdownDate = event.srcElement[1].value;
    }

    // Check if the input is empty
    if (countdownTitle !== "" && countdownDate !== "") {
        // Saving the countdown title and date to local storage
        savedCountdown = {
            title: countdownTitle,
            date: countdownDate
        };
        localStorage.setItem("countdown", JSON.stringify(savedCountdown));

        // Getting the input value from the form and populating the title
        countdownElementTitle.textContent = countdownTitle;

        // Getting the UTC of the local computer or user
        const localUTC = new Date().getTimezoneOffset() * 60 * 1000;

        // Converting the countdown date in milliseconds
        const countdownDateInMs = new Date(countdownDate).getTime();

        // Generation the countdown values and populating the DOM
        countdownActive = setInterval(() => {

        // Get milliseconds from today to countdown date
        const currentDateInMs = new Date().getTime() - localUTC;
        const timeDifferenceInMs = countdownDateInMs - currentDateInMs;

        // converting milliseconds to days, hours, minutes and seconds
        const days = Math.floor(timeDifferenceInMs / day);
        const hours = Math.floor((timeDifferenceInMs % day) / hour);
        const minutes = Math.floor((timeDifferenceInMs % hour) / minute);
        const seconds = Math.floor((timeDifferenceInMs % minute) / second);

        if (timeDifferenceInMs < 0){
            setTimeout(() => {
                countdownElement.hidden = true;
            }, 1);

                clearInterval(countdownActive);
                completeElementInfo.textContent = `${countdownTitle} finished on ${countdownDate}`;
                completeElement.hidden = false;
                audio.play();
        }
        else{
            // Populating Countdown Values
            timeElements[0].textContent = days;
            timeElements[1].textContent = hours;
            timeElements[2].textContent = minutes;
            timeElements[3].textContent = seconds;
        }
        }, second);

        // Setting a 1sec delay so that it will sync with the countdown
        setTimeout(() => {
        // Hide Input
        inputContainer.hidden = true;
        // Show Countdown
        countdownElement.hidden = false;
        }, second);
    }
    else {
        alert("Please fill everything in the form!");
    }
}

// Event Listeners
countdownForm.addEventListener("submit", updateCountdown);
countdownBtn.addEventListener("click", resetCountdown);
completeBtn.addEventListener("click", resetCountdown);

// On Load , Check Local Storage
restorePreviousCountdown();
