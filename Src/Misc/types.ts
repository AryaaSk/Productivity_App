//User data stores the user's schedule, e.g. upcoming tasks
//However a task doesn't have a specific date attached to it, but rather a pattern
//It is the job of the scheduler to schedule the tasks that need to be completed on a day

interface Schedule {
    //need to represent different possible scheduler options
    //e.g. every x days, on specific days in the week, or one-time
    mode: "periodic" | "specificDays" | "oneTime"
    data: number | number[] | string; //periodic repeat in days; days stored as numbers in array, e.g. [0, 3] for Sunday, Wednesday; date
    nextIteration: string //date in format dd/mm/yyyy, stores when next iteration is due
}

interface Task {
    name: string;
    payout: number;
    daysCounter: number; //0 on first day, 1 on second day...
}

interface Reward {
    name: string;
    cost: number;
}

interface Goal {
    name: string;
    payout: number;
}

//Setup stores all tasks, rewards and goals; UserData only stores tasks and rewards for today
//Goals do not actually need to be stored in UserData since they are not recurring and thus do not need to be scheduled - they are always one time
//However I will transfer them to userData for consistency
interface Setup {
    tasks: { task: Task, schedule: Schedule  }[];
    rewards: Reward[];
    goals: Goal[];
}

interface UserData {
    balance: number;
    tasks: Task[];
    rewards: Reward[];
    goals: Goal[];

    lastScheduleUpdate: string; //mm/dd/yyyy; this prevents user from making changes to setup and seeing them applied on the same day
    appVersion: number;
}

interface HistoryLog { //history of task completed, summary and payout
    taskName: string;
    summary: string;
    payout: number
    date: string; //mm/dd/yyyy
}