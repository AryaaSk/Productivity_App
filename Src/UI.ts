let CURRENTLY_SHOWING: "tasks" | "rewards" | "setup"= "tasks"; //dynamically changing pages

//Implementing routing manually to utilise single tabbar and reduce code duplication;
const ShowElement = (elementID: string) => {
    const element = document.getElementById(elementID)!;
    element.style.display = '';
}
const HideElement = (elementID: string) => {
    const element = document.getElementById(elementID)!;
    element.style.display = 'none';
}
const DisplayTasksPage = () => {
    CURRENTLY_SHOWING = "tasks";
    HideElement("rewardContainer");
    HideElement("setupContainer");

    ShowElement("taskContainer");
    PopulateTasks(USER_DATA.tasks);
    ShowElement("balance");
    UpdateBalance(USER_DATA.balance);
}
const DisplayRewardsPage = () => {
    CURRENTLY_SHOWING = "rewards";
    HideElement("taskContainer");
    HideElement("setupContainer");

    ShowElement("rewardContainer");
    PopulateRewards(USER_DATA.rewards);
    ShowElement("balance");
    UpdateBalance(USER_DATA.balance);
}
const DisplaySetupPage = () => {
    CURRENTLY_SHOWING = "setup";
    HideElement("taskContainer");
    HideElement("rewardContainer");
    HideElement("balance");   

    ShowElement("setupContainer");
    PopulateSetupData(SETUP);
    AttachSetupListeners();
}

const AttachTabBarListeners = () => {
    const tasksButton = document.getElementById("tasksPage")!;
    tasksButton.onclick = () => {
        DisplayTasksPage();
    }

    const rewardsButton = document.getElementById("rewardsPage")!;
    rewardsButton.onclick = () => {
        DisplayRewardsPage();
    }

    const setupButton = document.getElementById("setupPage")!;
    setupButton.onclick = () => {
        DisplaySetupPage();
    }
}

const UpdateBalance = (balance: number) => {
    const balanceElement = document.getElementById("balance")!;
    balanceElement.innerText = `Current Balance: $${balance}`;
}

const PopulateTasks = (tasks: Task[]) => {
    //updates taskContainer element with new tasks
    const container = document.getElementById("taskContainer")!;
    container.innerHTML = "";

    //mode recent tasks have the lowest damping, and thus will have the greatest payouts; therefore we want to display the last task first
    for (let i = tasks.length - 1; i >= 0; i -= 1) {
        const task = tasks[i];
        const taskElement = document.createElement("div")
        taskElement.className = "task";

        taskElement.innerHTML = 
        `<div><h3>${task.name}</h3></div>`;

        const claimButton = document.createElement("button");
        claimButton.className = "claimTaskButton";
        claimButton.innerText = `$${PayoutDamping(task.payout, task.daysCounter)}`;
        claimButton.onclick = () => { ClaimTask(i); }
        taskElement.append(claimButton);

        const forfeitButton = document.createElement("button");
        forfeitButton.innerText = `Forfeit`;
        forfeitButton.onclick = () => { ForfeitTask(i); }
        taskElement.append(forfeitButton);

        container.append(taskElement)
    }
}

const PopulateRewards = (rewards: Reward[]) => {
    //will use same template as tasks for now, however later I will differentiate rewards
    const container = document.getElementById("rewardContainer")!;
    container.innerHTML = "";

    for (const [i,reward] of rewards.entries()) {
        const rewardElement = document.createElement("div")
        rewardElement.className = "reward";

        rewardElement.innerHTML = 
        `<div><h3>${reward.name}</h3></div>`;

        const claimButton = document.createElement("button");
        claimButton.innerText = `$${reward.cost}`;
        claimButton.onclick = () => { ClaimReward(i); }
        rewardElement.append(claimButton);

        container.append(rewardElement)
    }
}

const PopulateSetupData = (setup: Setup) => {
    const scheduleModeMaps = { "periodic": "Periodic", "specificDays": "Specific Weekdays", "oneTime": "One Time" };

    const tasksWrapper = document.getElementById("setupTasksWrapper")!;
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

    const rewardsWrapper = document.getElementById("setupRewardsWrapper")!;
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
}

//For testing, I will add my tasks and rewards via json inputs
//BEWARE: UNVERIFIED INPUTS
const AttachSetupListeners = () => {
    const addTaskButton = document.getElementById("addTask")!;
    addTaskButton.onclick = () => {
        const name = prompt("Task Name")!;
        const payout = Number(prompt("Payout"))
        const scheduleMode = prompt("Schedule Mode: periodc | specificDays | oneTime");
        const scheduleData = scheduleMode == "oneTime" ? prompt("Schedule Data: number | number[] | mm/dd/yyyy") : JSON.parse(prompt("Schedule Data: number | number[] | mm/dd/yyyy")!)
        const nextIteration = prompt("Next Assignment: mm/dd/yyyy")!;

        AddTaskToSetup({ name: name, payout: payout, daysCounter: 0 }, { mode: <"periodic" | "specificDays" | "oneTime">scheduleMode, data: scheduleData, nextIteration: nextIteration });
        PopulateSetupData(SETUP);
    }

    const addReward = document.getElementById("addReward")!;
    addReward.onclick = () => {
        const name = prompt("Task Name")!;
        const cost = Number(prompt("Cost: $"))

        AddReward({ name: name, cost: cost });
        PopulateSetupData(SETUP);
    }
}