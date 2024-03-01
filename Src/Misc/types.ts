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

//Setup stores all tasks and rewards, UserData only stores tasks and rewards for today
interface Setup {
    tasks: { schedule: Schedule, task: Task }[];
    rewards: Reward[];
}

interface UserData {
    balance: number;
    tasks: Task[];
    rewards: Reward[];

    lastScheduleUpdate: string; //mm/dd/yyyy; this prevents user from making changes to setup and seeing them applied on the same day
}

const DEFAULTS: { [k: string] : any } = {}
DEFAULTS[SETUP_KEY] = { tasks: [], rewards: [] };
DEFAULTS[USER_DATA_KEY] = { balance: 0, tasks: [], rewards: [], lastScheduleUpdate: FormatDate(new Date()) };