"use strict";
const PopulateSetupData = (setup) => {
    const scheduleModeMaps = { "periodic": "Periodic", "specificDays": "Specific Weekdays", "oneTime": "One Time" };
    const tasksWrapper = document.getElementById("setupTasksWrapper");
    tasksWrapper.innerHTML = "";
    for (const [i, { schedule, task }] of setup.tasks.entries()) {
        const element = document.createElement("div");
        element.className = "taskSetup";
        element.innerHTML = `${task.name}<br>
        Payout: $${task.payout}<br>
        Schedule Mode: ${scheduleModeMaps[schedule.mode]}; ${schedule.data} <br>
        Next Assignment ${ConvertToFullDate(schedule.nextIteration)}<br>`;
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => { DeleteTaskFromSetup(i); PopulateSetupData(setup); };
        element.append(deleteButton);
        tasksWrapper.append(element);
    }
    const rewardsWrapper = document.getElementById("setupRewardsWrapper");
    rewardsWrapper.innerHTML = "";
    for (const [i, reward] of setup.rewards.entries()) {
        const element = document.createElement("div");
        element.className = "rewardSetup";
        element.innerHTML = `${reward.name}<br>
        Cost: $${reward.cost}<br>`;
        const deleteButton = document.createElement("button");
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => { DeleteRewardFromSetup(i); PopulateSetupData(setup); };
        element.append(deleteButton);
        rewardsWrapper.append(element);
    }
};
//For testing, I will add my tasks and rewards via json inputs
//BEWARE: UNVERIFIED INPUTS
const AttachSetupListeners = () => {
    const addTaskButton = document.getElementById("addTask");
    addTaskButton.onclick = () => {
        const name = prompt("Task Name");
        const payout = Number(prompt("Payout: $"));
        const scheduleMode = prompt("Schedule Mode: periodc | specificDays | oneTime");
        const scheduleData = scheduleMode == "oneTime" ? prompt("Schedule Data: number | number[] | mm/dd/yyyy") : JSON.parse(prompt("Schedule Data: number | number[] | mm/dd/yyyy"));
        let nextIteration = "";
        if (scheduleMode == "periodic") {
            nextIteration = prompt("Next Assignment: mm/dd/yyyy");
        }
        else if (scheduleMode == "specificDays") { //next iteration can be calculated if mode is
            //start from CURRENT_DATE and find next date which is one of the mentioned days
            //same code from Scheduler (finding next iteration of specific days task)
            nextIteration = FormatDate(GetNextDateOnDay(CURRENT_DATE, scheduleData));
        }
        else if (scheduleMode == "oneTime") {
            nextIteration = scheduleData; //already given date
        }
        AddTaskToSetup({ name: name, payout: payout, daysCounter: 0 }, { mode: scheduleMode, data: scheduleData, nextIteration: nextIteration });
        PopulateSetupData(SETUP);
    };
    const addReward = document.getElementById("addReward");
    addReward.onclick = () => {
        const name = prompt("Task Name");
        const cost = Number(prompt("Cost: $"));
        AddReward({ name: name, cost: cost });
        PopulateSetupData(SETUP);
    };
};
