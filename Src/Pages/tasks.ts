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