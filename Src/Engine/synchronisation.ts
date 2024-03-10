const SYNCHRONISE_USER_DATA = (syncUptoDate: Date) => { //uses global variables of userData and setup
    //compare uptoDate with userData's last synchronisation; if last sync is ahead of upto, then we don't need to sync anything further
    const lastSynchronisated = new Date(USER_DATA.lastScheduleUpdate);
    if (lastSynchronisated.getTime() > syncUptoDate.getTime()) {
        console.log("Already synchronised past this date");
        return;
    }

    const syncUptoDateString = FormatDate(syncUptoDate);
    while (USER_DATA.lastScheduleUpdate != syncUptoDateString) {
        const lastSynchronisated = new Date(USER_DATA.lastScheduleUpdate);
        const newSyncDate = AddDays(lastSynchronisated, 1);
        for (const task of USER_DATA.tasks) {
            task.daysCounter += 1;
        }

        ADD_USER_DATA_AVAILABLE_TASKS(newSyncDate);
        ADD_USER_DATA_REWARDS();

        USER_DATA.lastScheduleUpdate = FormatDate(newSyncDate);
    }
}
const ADD_USER_DATA_AVAILABLE_TASKS = (currentDate: Date) => { //adds all available tasks for specific date in setup
    const GetTasks = (setup: Setup, date: Date) => {
        //looks at setup and returns schedule for the date provided
        //note that once tasks have been returned, their nextIteration attribute is incremented
        //therefore you can only call this function once to get all results for a particular date
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
                    schedule.nextIteration = FormatDate(GetNextDateOnDay(AddDays(date, 1), <number[]>schedule.data)); //find next date from tomorrow (since we don't want to include today)
                }
                else if (schedule.mode == "oneTime") {
                    schedule.nextIteration = "-"; //there is no next iteration for a oneTime event
                }
            }
        }
        return todayTasks;
    }

    const newTasks = GetTasks(SETUP, currentDate);
    USER_DATA.tasks = USER_DATA.tasks.concat(newTasks);
}
const ADD_USER_DATA_REWARDS = () => { //rewards doesn't depend on date
    const rewards = JSON.parse(JSON.stringify(SETUP.rewards));
    USER_DATA.rewards = rewards;
}



const CLEAN_SETUP = () => { //removes all tasks with nextIteration = '-'; this implies the task is complete and won't occur again
    let i = 0;
    while (i != SETUP.tasks.length) {
        if (SETUP.tasks[i].schedule.nextIteration == "-") {
            SETUP.tasks.splice(i, 1);
        }
        else {
            i += 1;
        }
    }
}