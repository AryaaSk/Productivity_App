"use strict";
const ScheduleTasks = (setup, date) => {
    //looks at setup and returns schedule for the date provided
    //note that once tasks have been returned, their nextIteration attribute is incremented
    //therefore you can only call this function once to get all results for a particular date
    const dateString = FormatDate(date);
    const todayTasks = [];
    for (const { schedule, task } of setup.tasks) {
        if (schedule.nextIteration == dateString) {
            todayTasks.push(JSON.parse(JSON.stringify(task)));
            //update schedule.nextIteration
            //object is passed by reference so we can modify it;
            if (schedule.mode == "periodic") {
                schedule.nextIteration = FormatDate(AddDays(date, schedule.data));
            }
            else if (schedule.mode == "specificDays") {
                schedule.nextIteration = FormatDate(GetNextDateOnDay(AddDays(date, 1), schedule.data)); //find next date from tomorrow (since we don't want to include today)
            }
            else if (schedule.mode == "oneTime") {
                schedule.nextIteration = "-"; //there is no next iteration for a oneTime event
            }
        }
    }
    return todayTasks;
};
const UpdateUserData = (userData, setup, date) => {
    const newTasks = ScheduleTasks(setup, date); //add today's tasks from Scheduler
    userData.tasks = userData.tasks.concat(newTasks);
    const rewards = JSON.parse(JSON.stringify(setup.rewards)); //same rewards available everyday
    userData.rewards = rewards;
};
const CatchUpUserData = (userData, setup, date) => {
    const dateString = FormatDate(date);
    //check if given date is behind of lastScheduleUpdate; in which case the loop will run forever
    if (date.getTime() < new Date(userData.lastScheduleUpdate).getTime()) {
        console.log("Date given has already been scheduled");
        return;
    }
    //Will only run the update once per day
    while (userData.lastScheduleUpdate != dateString) { //catch up days between last schedule and today
        const currentDate = AddDays(new Date(userData.lastScheduleUpdate), 1); //schedule next day
        for (const task of userData.tasks) { //increment dayCounter for all tasks in tasks
            task.daysCounter += 1;
        }
        UpdateUserData(userData, setup, currentDate);
        userData.lastScheduleUpdate = FormatDate(currentDate);
    }
};
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
        nextIteration = FormatDate(GetNextDateOnDay(CURRENT_DATE, scheduleData));
    }
    else if (scheduleMode == "oneTime") {
        nextIteration = scheduleData; //already given date
    }
    return { name, payout, scheduleMode, scheduleData, nextIteration };
};
const AddTaskToSetup = (task, schedule) => {
    SETUP.tasks.push({ schedule: schedule, task: task });
    UpdateUserData(USER_DATA, SETUP, new Date(USER_DATA.lastScheduleUpdate)); //update to check for any new tasks added today
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
};
const DeleteTaskFromSetup = (index) => {
    SETUP.tasks.splice(index, 1); //will only affect from next day and onwards; therefore do not need to update user data
    SaveData(SETUP, SETUP_KEY);
};
const GetRewardSetupData = () => {
    const name = prompt("Reward Name");
    const cost = Number(prompt("Cost: $"));
    return { name, cost };
};
const AddReward = (reward) => {
    SETUP.rewards.push(reward);
    UpdateUserData(USER_DATA, SETUP, new Date(USER_DATA.lastScheduleUpdate)); //update to check for any new tasks added today
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
};
const DeleteRewardFromSetup = (index) => {
    SETUP.rewards.splice(index, 1);
    //rewards are simply assigned to User Data from setup so it will be updated on the same day
    UpdateUserData(USER_DATA, SETUP, new Date(USER_DATA.lastScheduleUpdate)); //update to check for any new tasks added today
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
};
const ClaimTask = (index) => {
    //ask for summary (acts as pseudo-verfication and useful for showing progress later on)
    const summary = prompt("Task Summary");
    if (summary == undefined || summary.replaceAll(" ", "") == "")
        return;
    //add task's payout to balance and prevent user from being able to claim task again
    const task = USER_DATA.tasks[index];
    const payout = PayoutDamping(task.payout, task.daysCounter);
    USER_DATA.balance += payout;
    USER_DATA.tasks.splice(index, 1);
    HISTORY.push({ taskName: task.name, summary: summary, payout: payout, date: FormatDate(CURRENT_DATE) });
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(HISTORY, HISTORY_KEY);
    PopulateTasks(USER_DATA.tasks);
    UpdateBalance(USER_DATA.balance);
    alert(`Congratulations, you completed the task '${task.name}'; $${payout} will be deposited in your account.`);
};
const ForfeitTask = (index) => {
    const task = USER_DATA.tasks[index];
    const payout = PayoutDamping(task.payout, task.daysCounter);
    const confirm = window.confirm(`Are you sure you want to forfeit $${payout}...`);
    if (confirm == true) {
        USER_DATA.tasks.splice(index, 1);
        SaveData(USER_DATA, USER_DATA_KEY);
        PopulateTasks(USER_DATA.tasks);
    }
};
const ClaimReward = (index) => {
    //deduct reward's cost from balance (check if balance >= cost first), and possible remove reward
    const reward = USER_DATA.rewards[index];
    const cost = reward.cost;
    if (USER_DATA.balance < cost) {
        alert(`You do not have sufficient funds to purchase '${reward.name}'. Complete a few tasks and earn $${reward.cost - USER_DATA.balance} more...`);
        return;
    }
    USER_DATA.balance -= cost;
    SaveData(USER_DATA, USER_DATA_KEY);
    PopulateRewards(USER_DATA.rewards); //for now there shouldn't be any effect, as we aren't currently locking this reward off.
    UpdateBalance(USER_DATA.balance);
    alert(`Purchased '${reward.name}' for $${cost}; Enjoy the reward!`);
};
