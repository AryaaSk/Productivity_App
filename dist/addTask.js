"use strict";
const AttachListenersAddTask = () => {
    const schedulingModeSelect = document.getElementById("schedulingModeSelect");
    const periodicDiv = document.getElementById("periodic");
    const specificDaysDiv = document.getElementById("specificDays");
    const oneTimeDiv = document.getElementById("oneTime");
    schedulingModeSelect.onchange = () => {
        const selectedMode = schedulingModeSelect.value;
        //show the div with the specified mode
        periodicDiv.style.display = "none";
        specificDaysDiv.style.display = "none";
        oneTimeDiv.style.display = "none";
        document.getElementById(selectedMode).style.display = "";
    };
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    for (const day of days) {
        const row = document.getElementById(day);
        row.onclick = () => {
            if (row.getAttribute("selected") == "false") {
                row.setAttribute("selected", "true");
            }
            else {
                row.setAttribute("selected", "false");
            }
        };
    }
    const LinkSliderToLabel = (sliderID, labelID) => {
        const slider = document.getElementById(sliderID);
        const label = document.getElementById(labelID);
        slider.addEventListener('input', () => {
            const isInteger = Number(slider.value) % 1 == 0;
            label.innerText = slider.value + (isInteger ? ".0" : "");
            UpdatePayoutValue();
        });
    };
    LinkSliderToLabel("benefitSlider", "benefitValue");
    LinkSliderToLabel("difficultySlider", "difficultyValue");
    LinkSliderToLabel("timeSlider", "timeValue");
    const addTaskButton = document.getElementById("add");
    addTaskButton.onclick = () => {
        AddTaskFromUI();
    };
};
const UpdatePayoutValue = () => {
    const benefit = Number(document.getElementById("difficultySlider").value);
    const difficulty = Number(document.getElementById("benefitSlider").value);
    const time = Number(document.getElementById("timeSlider").value);
    const payoutLabel = document.getElementById("payout");
    const payout = Math.round(8 * Math.exp(0.432 * benefit) + 5 * Math.exp(0.432 * difficulty) + 52 * time + 7);
    payoutLabel.innerText = `$${payout}`;
    return payout;
};
const AddTaskFromUI = () => {
    //get data from inputs
    const name = document.getElementById("name").value;
    if (name.replaceAll(" ", "") == "") {
        alert("Cannot add a task with an empty name");
        return;
    }
    const scheduleMode = document.getElementById("schedulingModeSelect").value;
    let scheduleData = "";
    let nextIteration = "";
    if (scheduleMode == "periodic") {
        scheduleData = Number(document.getElementById("periodicRepeat").value);
        const datePicker = document.getElementById("periodicStartingFrom");
        nextIteration = FormatDate(datePicker.valueAsDate);
    }
    else if (scheduleMode == "specificDays") {
        //go through each cell and check whether it is selected
        const weekdays = []; //starts from Sunday
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        for (const [i, day] of days.entries()) {
            const cell = document.getElementById(day);
            if (cell.getAttribute("selected") == "true") {
                weekdays.push(i);
            }
        }
        scheduleData = weekdays;
        nextIteration = FormatDate(GetNextDateOnDay(TODAY_DATE, scheduleData));
    }
    else if (scheduleMode == "oneTime") {
        const datePicker = document.getElementById("oneTimeDate");
        scheduleData = nextIteration = FormatDate(datePicker.valueAsDate);
    }
    //take payout from payout function
    const payout = UpdatePayoutValue();
    //add task to setup and update user data
    const task = { name: name, payout: payout, daysCounter: 0 };
    const schedule = { mode: scheduleMode, data: scheduleData, nextIteration: nextIteration };
    SETUP.tasks.push({ task: task, schedule: schedule });
    ADD_USER_DATA_AVAILABLE_TASKS(TODAY_DATE); //update to check for any new tasks added today
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    //return back to setup screen
    location.href = "setup.html";
};
const MainAddTask = () => {
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    AttachListenersAddTask();
    UpdatePayoutValue();
};
MainAddTask();
