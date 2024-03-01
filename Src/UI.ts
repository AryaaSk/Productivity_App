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
    LoadTasks(USER_DATA.tasks);
    ShowElement("balance");
    UpdateBalance(USER_DATA.balance);
}
const DisplayRewardsPage = () => {
    CURRENTLY_SHOWING = "rewards";
    HideElement("taskContainer");
    HideElement("setupContainer");

    ShowElement("rewardContainer");
    LoadRewards(USER_DATA.rewards);
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

const LoadTasks = (tasks: Task[]) => {
    //updates taskContainer element with new tasks
    const container = document.getElementById("taskContainer")!;
    container.innerHTML = "";

    for (const [i,task] of tasks.entries()) {
        const taskElement = document.createElement("div")
        taskElement.className = "task";

        taskElement.innerHTML = 
        `<div><h3>${task.name}</h3></div>`;

        const claimButton = document.createElement("button");
        claimButton.innerText = `$${PayoutDamping(task.payout, task.daysCounter)}`;
        claimButton.onclick = () => { ClaimTask(i); }
        taskElement.append(claimButton);

        container.append(taskElement)
    }
}

const LoadRewards = (rewards: Reward[]) => {
    //will use same template as tasks for now, however later I will differentiate rewards
    const container = document.getElementById("rewardContainer")!;
    container.innerHTML = "";

    for (const [i,reward] of rewards.entries()) {
        const rewardElement = document.createElement("div")
        rewardElement.className = "task";

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
    for (const { schedule, task } of setup.tasks) {
        const element = document.createElement("div");
        element.className = "taskSetup";

        element.innerHTML = `${task.name}<br>
        Payout: $${task.payout}<br>
        Schedule Mode: ${scheduleModeMaps[schedule.mode]}; ${schedule.data} <br>
        Next Delivery: ${schedule.nextIteration}`;

        tasksWrapper.append(element);
    }

    const rewardsWrapper = document.getElementById("setupRewardsWrapper")!;
    rewardsWrapper.innerHTML = "";
    for (const reward of setup.rewards) {
        const element = document.createElement("div");
        element.className = "rewardSetup";

        element.innerHTML = `${reward.name}<br>
        Cost: $${reward.cost}<br>`;

        rewardsWrapper.append(element);
    }
}