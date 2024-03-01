const ScheduleTasks = (setup: Setup, date: Date) => {
    //looks at setup and returns schedule for the date provided
    //note that this is not a pure function as it uses stored state
    //therefore ensure calls are made with an appropriate date parameter
    const dateString = FormatDate(date);
    const todayTasks: Task[] = [];

    for (const { schedule, task } of setup.tasks) {
        if (schedule.nextIteration == dateString) {
            todayTasks.push(JSON.parse(JSON.stringify(task)));

            //update schedule.nextIteration
            //object is passed by reference so we can modify it;
            if (schedule.mode == "periodic") {
                schedule.nextIteration = FormatDate(AddDays(date, <number>schedule.data))
            }
            else if (schedule.mode == "specificDays") {
                //need to find next day in the week
                const currentDayIndex = date.getDay()
                let nextClosetDayDifference = Infinity; //default marker

                for (const dayIndex of <number[]>schedule.data) {
                    const difference = dayIndex - currentDayIndex;
                    if (difference > 0 && difference < nextClosetDayDifference) {
                        nextClosetDayDifference = difference;
                    }
                }

                if (nextClosetDayDifference == Infinity) {
                    nextClosetDayDifference = (7 -  currentDayIndex) + (<number[]>schedule.data)[0];
                }

                schedule.nextIteration = FormatDate(AddDays(date, nextClosetDayDifference))
            }
            //for one time we could remove this from the setup, but that may cause complications so we'll just leave it here
            //can create a clean up function later on which removes oneTime tasks that have already passed
            else if (schedule.mode == "oneTime") {}
        }
    }

    return todayTasks;
}

const UpdateUserData = (userData: UserData, setup: Setup, date: Date) => {
    for (const task of userData.tasks) { //increment dayCounter for all tasks in tasks
        task.daysCounter += 1;
    }

    const newTasks = ScheduleTasks(setup, date); //add today's tasks from Scheduler
    userData.tasks = userData.tasks.concat(newTasks);

    const rewards = JSON.parse(JSON.stringify(setup.rewards)); //same rewards available everyday
    userData.rewards = rewards;
}

const CatchUpUserData = (userData: UserData, setup: Setup, date: Date) => {
    const dateString = FormatDate(date);

    //check if given date is behind of lastScheduleUpdate; in which case the loop will run forever
    if (date.getTime() < new Date(userData.lastScheduleUpdate).getTime()) {
        console.log("Date given has already been scheduled");
        return;
    }
    
    //Will only run the update once per day
    while (userData.lastScheduleUpdate != dateString) { //catch up days between last schedule and today
        const currentDate = AddDays(new Date(userData.lastScheduleUpdate), 1); //schedule next day
        UpdateUserData(userData, setup, currentDate);
        userData.lastScheduleUpdate = FormatDate(currentDate);
    }
}

const ClaimTask = (index: number) => {
    //add task's payout to balance and prevent user from being able to claim task again
    const task = USER_DATA.tasks[index];
    const payout = PayoutDamping(task.payout, task.daysCounter);
    USER_DATA.balance += payout;
    
    USER_DATA.tasks.splice(index, 1);
    SaveData(USER_DATA, USER_DATA_KEY);
    LoadTasks(USER_DATA.tasks);
    UpdateBalance(USER_DATA.balance);

    alert(`Congratulations, you completed a task; $${payout} will be deposited in your account.`);
}

const ClaimReward = (index: number) => {
    //deduct reward's cost from balance (check if balance >= cost first), and possible remove reward
    const reward = USER_DATA.rewards[index];
    
    if (USER_DATA.balance < reward.cost) {
        alert(`You do not have sufficient funds to purchase this reward. Complete a few tasks and earn $${reward.cost - USER_DATA.balance} more...`);
        return;
    }

    USER_DATA.balance -= reward.cost;

    SaveData(USER_DATA, USER_DATA_KEY);
    LoadRewards(USER_DATA.rewards); //for now there shouldn't be any effect, as we aren't currently locking this reward off.
    UpdateBalance(USER_DATA.balance);

    alert(`Purchased '${reward.name}'; Enjoy the reward!`);
}