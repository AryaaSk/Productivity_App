"use strict";
const ScheduleTasks = (setup, date) => {
    //looks at setup and returns schedule for the date provided
    //note that this is not a pure function as it uses stored state
    //therefore ensure calls are made with an appropriate date parameter
    const dateString = FormatDate(date);
    const todayTasks = [];
    for (const { schedule, task } of setup.tasks) {
        if (schedule.nextIteration == dateString) {
            todayTasks.push(task);
            //update schedule.nextIteration
            //object is passed by reference so we can modify it;
            if (schedule.mode == "periodic") {
                schedule.nextIteration = FormatDate(AddDays(date, schedule.data));
            }
            else if (schedule.mode == "specificDays") {
                //need to find next day in the week
                const currentDayIndex = date.getDay();
                let nextClosetDayDifference = Infinity; //default marker
                for (const dayIndex of schedule.data) {
                    const difference = dayIndex - currentDayIndex;
                    if (difference > 0 && difference < nextClosetDayDifference) {
                        nextClosetDayDifference = difference;
                    }
                }
                if (nextClosetDayDifference == Infinity) {
                    nextClosetDayDifference = (7 - currentDayIndex) + schedule.data[0];
                }
                schedule.nextIteration = FormatDate(AddDays(date, nextClosetDayDifference));
            }
            else if (schedule.mode == "oneTime") {
                //we could remove this from the setup, but that may cause complications so we'll just leave it here
                //can create a clean up function later on which removes oneTime tasks that have already passed
            }
        }
    }
    return todayTasks;
};
const UpdateUserData = (userData, setup, date) => {
    const dateString = FormatDate(date);
    //check if given date is behind of lastScheduleUpdate; in which case the loop will run forever
    if (date.getTime() < new Date(userData.lastScheduleUpdate).getTime()) {
        console.log("Date given has already been scheduled");
        return;
    }
    //Will only run the update once per day
    while (userData.lastScheduleUpdate != dateString) { //catch up days between last schedule and today
        const currentDate = AddDays(new Date(userData.lastScheduleUpdate), 1); //schedule next day
        //increment dayCounter for all tasks in tasks
        for (const task of userData.tasks) {
            task.daysCounter += 1;
        }
        //add today's tasks from Scheduler
        const newTasks = ScheduleTasks(setup, currentDate);
        userData.tasks = userData.tasks.concat(newTasks);
        userData.lastScheduleUpdate = FormatDate(currentDate);
    }
};
const ClaimTask = (index) => {
    //add task's payout to balance and prevent user from being able to claim task again
};
