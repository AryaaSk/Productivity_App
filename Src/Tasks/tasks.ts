//@ts-expect-error; same name
const UpdateBalance = (balance: number) => {
    const element = document.getElementById("title")!;
    element.innerText = `Tasks - Current Balance: $${balance}`;
}

const PopulateTableview = (tasks: Task[]) => {
    const tableview = document.getElementById("tasks")!;
    tableview.innerHTML = "";

    const CreateSection = (daysCounter: Number) => {
        const section = document.createElement("div");
        section.className = "section";
        section.append(`<header>${daysCounter} day${daysCounter != 1 ? 's' : ''} old</header>`);
        return section;
    }
    let currentDayCounter = 0; //assumes tasks are given in sorted order based on dayCounter
    let currentSection = CreateSection(currentDayCounter);

    for (let i = tasks.length - 1; i >= 0; i -= 1) {
        const task = tasks[i];
        if (task.daysCounter != currentDayCounter) { //add a new section
            tableview.append(currentSection);

            currentDayCounter = task.daysCounter;
            currentSection = CreateSection(currentDayCounter);
        }

        const element = document.createElement("div");
        element.className = "row task";
        element.append(`<div class="name">${task.name}</div>`);

        const claimButton = document.createElement("button");
        claimButton.className = "button";
        claimButton.innerText = `$${PayoutDamping["reverseExponential"](task.payout, task.daysCounter)}`;
        claimButton.onclick = () => { ClaimTask(i); }
        element.append(claimButton);

        const forfeitButton = document.createElement("button");
        forfeitButton.className = "button"
        forfeitButton.innerText = `Forfeit`;
        forfeitButton.onclick = () => { ForfeitTask(i); }
        element.append(forfeitButton);

        currentSection.append(element);
    }
}



const ClaimTask = (index: number) => {
    //ask for summary (acts as pseudo-verfication and useful for showing progress later on)
    const summary = prompt("Task Summary");
    if (summary == undefined || summary.replaceAll(" ", "") == "") return;

    //add task's payout to balance and prevent user from being able to claim task again
    const task = USER_DATA.tasks[index];
    const payout = PayoutDamping["reverseExponential"](task.payout, task.daysCounter);
    USER_DATA.balance += payout;

    USER_DATA.tasks.splice(index, 1);
    HISTORY.push({ taskName: task.name, summary: summary, payout: payout, date: FormatDate(TODAY_DATE) });
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(HISTORY, HISTORY_KEY);
    PopulateTableview(USER_DATA.tasks);
    UpdateBalance(USER_DATA.balance);

    alert(`Congratulations, you completed the task '${task.name}'; $${payout} will be deposited in your account.`);
}

const ForfeitTask = (index: number) => {
    const task = USER_DATA.tasks[index];
    const payout = PayoutDamping["reverseExponential"](task.payout, task.daysCounter);
    const confirm = window.confirm(`Are you sure you want to forfeit $${payout}...`);

    if (confirm == true) {
        USER_DATA.tasks.splice(index, 1);
        SaveData(USER_DATA, USER_DATA_KEY);
        PopulateTableview(USER_DATA.tasks);
    }
}



const MainTasks = () => {
    //synchronise user data using setup
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    console.log(SETUP);
    console.log(USER_DATA);
    console.log(HISTORY);

    //Display data
    UpdateBalance(USER_DATA.balance);
    PopulateTableview(USER_DATA.tasks);
}
MainTasks();