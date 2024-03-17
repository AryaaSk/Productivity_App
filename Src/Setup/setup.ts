const PopulateSetupTableview = (tasks: { task: Task, schedule: Schedule }[], rewards: Reward[]) => {
    const tableview = document.getElementById("setupData")!;
    tableview.innerHTML = "";

    const addTaskButton = document.createElement("button");
    addTaskButton.className = "button";
    addTaskButton.innerText = "Add Task";
    addTaskButton.onclick = () => { AddTask() };
    tableview.append(addTaskButton);

    const tasksSection = document.createElement("div")!;
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
        const emptyText = document.createElement("p");
        emptyText.innerText = "No tasks yet...";
        tableview.append(emptyText);
        tableview.append(document.createElement("br"));
        tableview.append(document.createElement("br"));
    }
    else {
        tableview.append(tasksSection);
    }

    const addRewardButton = document.createElement("button");
    addRewardButton.className = "button";
    addRewardButton.innerText = "Add Reward";
    addRewardButton.onclick = () => { AddReward() };
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
        const emptyText = document.createElement("p");
        emptyText.innerText = "No rewards yet...";
        tableview.append(emptyText);
    }
    else {
        tableview.append(rewardsSection);
    }
}

const AddTask = () => {
    location.href = "/Src/Setup/AddTask/addTask.html";
    /*
    const GetTaskSetupData = () => {
        const name = prompt("Task Name")!;
        const payout = Number(prompt("Payout: $"))
        const scheduleMode = prompt("Schedule Mode: periodic | specificDays | oneTime");
        const scheduleData = scheduleMode == "oneTime" ? prompt("Schedule Data: number | number[] | mm/dd/yyyy") : JSON.parse(prompt("Schedule Data: number | number[] | mm/dd/yyyy")!)
    
        let nextIteration = "";
        if (scheduleMode == "periodic") {
            nextIteration = prompt("Next Assignment: mm/dd/yyyy")!;
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
    }

    const { name, payout, scheduleMode, scheduleData, nextIteration } = GetTaskSetupData();
    const task: Task = { name: name, payout: payout, daysCounter: 0 };
    const schedule: Schedule = { mode: <"periodic" | "specificDays" | "oneTime">scheduleMode, data: scheduleData, nextIteration: nextIteration };
    SETUP.tasks.push({ task: task, schedule: schedule });

    ADD_USER_DATA_AVAILABLE_TASKS(TODAY_DATE); //update to check for any new tasks added today
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
    */
}
const DeleteTask = (index: number) => {
    SETUP.tasks.splice(index, 1); //if the task was due today then it'll already have been added to USER DATA, therefore this will only affect future assignments
    SaveData(SETUP, SETUP_KEY);

    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
}

const AddReward = () => {
    location.href = "/Src/Setup/AddReward/addReward.html";
    /*
    const GetRewardSetupData = () => {
        const name = prompt("Reward Name")!;
        const cost = Number(prompt("Cost: $"));
    
        return { name, cost };
    }

    const { name, cost } = GetRewardSetupData();
    const reward: Reward = { name: name, cost: cost };
    SETUP.rewards.push(reward);

    ADD_USER_DATA_REWARDS();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
    */
}
const DeleteReward = (index: number) => {
    SETUP.rewards.splice(index, 1);

    //rewards are simply assigned to User Data from setup so it will be updated on the same day
    ADD_USER_DATA_REWARDS();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
}

const AttachListeners = () => {
    const importButton = document.getElementById("importState")!;
    importButton.onclick = () => { ImportState(); };

    const exportButton = document.getElementById("exportState")!;
    exportButton.onclick = () => { ExportState(); };
}

const ImportState = () => {
    const json = prompt("Please enter a valid exported JSON");
    if (json == undefined || json.replaceAll(" ", "") == "") {
        return;
    }

    const data: any = JSON.parse(json);
    SaveData(data.userData, USER_DATA_KEY);
    SaveData(data.setup, SETUP_KEY);
    SaveData(data.history, HISTORY_KEY);
    location.reload();
}
const ExportState = () => {
    location.href = "/Src/Misc/Migration/export.html"
}



const MainSetup = () => {
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    CLEAN_SETUP();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    PopulateSetupTableview(SETUP.tasks, SETUP.rewards);
    AttachListeners();
}
MainSetup();