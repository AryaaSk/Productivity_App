//@ts-expect-error; same name
const UpdateBalance = (balance: number) => {
    const element = document.getElementById("title")!;
    element.innerText = `Goals - Current Balance: $${balance}`;
}

const PopulateGoalsTableview = (goals: Goal[]) => {
    const tableview = document.getElementById("goals")!;
    tableview.innerHTML = "";

    const section = document.createElement("div");
    section.className = "section";
    section.innerHTML = "";

    for (const [i, goal] of goals.entries()) {
        const row = document.createElement("div");
        row.className = "row goal"

        row.innerHTML = `<div class="name">
        ${goal.name}
    </div>`;

        const button = document.createElement("button");
        button.className = "button";
        button.innerText = `$${goal.payout}`;
        button.onclick = () => { ClaimGoal(i); };
        row.append(button);

        section.append(row);
    }
    if (goals.length == 0) {
        tableview.innerHTML = "<p>No goals yet...<p>";
        tableview.style.textAlign = "center";
    }
    else {
        tableview.append(section);
    }
}



const ClaimGoal = (index: number) => {
    const goal = USER_DATA.goals[index];

    //similar to adding task, however we have to remove the goal from both the user data and setup (since it will not occur again)
    const thoughts = prompt(`Thoughts about completing ${goal.name}:`);
    if (thoughts == undefined || thoughts.replaceAll(" ", "") == "") return;

    const payout = goal.payout;
    USER_DATA.balance += payout;

    USER_DATA.goals.splice(index, 1);
    SETUP.goals.splice(index, 1); //userData.goals = setup.goals
    HISTORY.push({ taskName: goal.name, summary: thoughts, payout: payout, date: FormatDate(TODAY_DATE) }); //add to history just like a task
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    SaveData(HISTORY, HISTORY_KEY);

    PopulateGoalsTableview(USER_DATA.goals);
    UpdateBalance(USER_DATA.balance);

    alert(`Congratulations, you reached the goal '${goal.name}' and earned $${payout}!`);
}



const MainGoals = () => {
    //Sync datat
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    //Display data
    UpdateBalance(USER_DATA.balance);

    PopulateGoalsTableview(USER_DATA.goals);
}
MainGoals();