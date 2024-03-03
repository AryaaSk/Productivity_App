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
        const { name, payout, scheduleMode, scheduleData, nextIteration } = GetTaskSetupData();
        AddTaskToSetup({ name: name, payout: payout, daysCounter: 0 }, { mode: scheduleMode, data: scheduleData, nextIteration: nextIteration });
        PopulateSetupData(SETUP);
    };
    const addReward = document.getElementById("addReward");
    addReward.onclick = () => {
        const { name, cost } = GetRewardSetupData();
        AddReward({ name: name, cost: cost });
        PopulateSetupData(SETUP);
    };
};
