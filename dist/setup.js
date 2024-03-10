"use strict";
const PopulateSetupTableview = (tasks, rewards) => {
    const tableview = document.getElementById("setupData");
    tableview.innerHTML = "";
    const addTaskButton = document.createElement("button");
    addTaskButton.className = "button";
    addTaskButton.innerText = "Add Task";
    addTaskButton.onclick = () => { AddTask(); };
    tableview.append(addTaskButton);
    const tasksSection = document.createElement("div");
    tasksSection.className = "section";
    const scheduleModeMaps = { "periodic": "Periodic", "specificDays": "Specific Weekdays", "oneTime": "One Time" };
    for (const [i, { task, schedule }] of tasks.entries()) {
        const element = document.createElement("div");
        element.className = "row setupItem";
        element.innerHTML = `
        ${task.name}<br>
        Payout: $${task.payout}<br>
        Schedule Mode: ${scheduleModeMaps[schedule.mode]}; ${schedule.data}<br>
        Next Assignment ${ConvertToFullDate(schedule.nextIteration)}<br>`;
        const deleteButton = document.createElement("button");
        deleteButton.className = "button";
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => { DeleteTask(i); };
        element.append(deleteButton);
        tasksSection.append(element);
    }
    if (tasks.length == 0) {
        tableview.append(document.createElement("br"));
        tableview.innerHTML += "<p>No tasks yet...<p>";
        tableview.append(document.createElement("br"));
        tableview.append(document.createElement("br"));
    }
    else {
        tableview.append(tasksSection);
    }
    const addRewardButton = document.createElement("button");
    addRewardButton.className = "button";
    addRewardButton.innerText = "Add Reward";
    addRewardButton.onclick = () => { AddReward(); };
    tableview.append(addRewardButton);
    const rewardsSection = document.createElement("div");
    rewardsSection.className = "section";
    for (const [i, reward] of rewards.entries()) {
        const element = document.createElement("div");
        element.className = "row setupItem";
        element.innerHTML = `
        ${reward.name}<br>
        Cost: $${reward.cost}<br>`;
        const deleteButton = document.createElement("button");
        deleteButton.className = "button";
        deleteButton.innerText = "Delete";
        deleteButton.onclick = () => { DeleteReward(i); };
        element.append(deleteButton);
        rewardsSection.append(element);
    }
    if (rewards.length == 0) {
        tableview.append(document.createElement("br"));
        tableview.innerHTML += "<p>No rewards yet...<p>";
    }
    else {
        tableview.append(rewardsSection);
    }
};
const AddTask = () => {
    const GetTaskSetupData = () => {
        const name = prompt("Task Name");
        const payout = Number(prompt("Payout: $"));
        const scheduleMode = prompt("Schedule Mode: periodic | specificDays | oneTime");
        const scheduleData = scheduleMode == "oneTime" ? prompt("Schedule Data: number | number[] | mm/dd/yyyy") : JSON.parse(prompt("Schedule Data: number | number[] | mm/dd/yyyy"));
        let nextIteration = "";
        if (scheduleMode == "periodic") {
            nextIteration = prompt("Next Assignment: mm/dd/yyyy");
        }
        else if (scheduleMode == "specificDays") { //next iteration can be calculated if mode is
            //start from CURRENT_DATE and find next date which is one of the mentioned days
            //same code from Scheduler (finding next iteration of specific days task)
            nextIteration = FormatDate(GetNextDateOnDay(TODAY_DATE, scheduleData));
        }
        else if (scheduleMode == "oneTime") {
            nextIteration = scheduleData; //already given date
        }
        return { name, payout, scheduleMode, scheduleData, nextIteration };
    };
    const { name, payout, scheduleMode, scheduleData, nextIteration } = GetTaskSetupData();
    const task = { name: name, payout: payout, daysCounter: 0 };
    const schedule = { mode: scheduleMode, data: scheduleData, nextIteration: nextIteration };
    SETUP.tasks.push({ task: task, schedule: schedule });
    ADD_USER_DATA_AVAILABLE_TASKS(TODAY_DATE); //update to check for any new tasks added today
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
};
const DeleteTask = (index) => {
    SETUP.tasks.splice(index, 1); //if the task was due today then it'll already have been added to USER DATA, therefore this will only affect future assignments
    SaveData(SETUP, SETUP_KEY);
    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
};
const AddReward = () => {
    const GetRewardSetupData = () => {
        const name = prompt("Reward Name");
        const cost = Number(prompt("Cost: $"));
        return { name, cost };
    };
    const { name, cost } = GetRewardSetupData();
    const reward = { name: name, cost: cost };
    SETUP.rewards.push(reward);
    ADD_USER_DATA_REWARDS();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
};
const DeleteReward = (index) => {
    SETUP.rewards.splice(index, 1);
    //rewards are simply assigned to User Data from setup so it will be updated on the same day
    ADD_USER_DATA_REWARDS();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
};
const MainSetup = () => {
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
};
MainSetup();
