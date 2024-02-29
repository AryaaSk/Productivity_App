const UpdateTasks = (tasks: Task[]) => {
    //updates taskContainer element with new tasks
    const container = document.getElementById("taskContainer")!;
    container.innerHTML = "";

    for (const [i,task] of tasks.entries()) {
        const taskElement = document.createElement("div")
        taskElement.className = "task";
        taskElement.onclick = () => { ClaimTask(i); }

        taskElement.innerHTML = 
        `<div><h3>${task.name}</h3></div>
        <div><button>$${task.payout}</button></div>`

        container.append(taskElement)
    }
}

const ClaimTask = (index: number) => {
    //add task's payout to balance and prevent user from being able to claim task again
}