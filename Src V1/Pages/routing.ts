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