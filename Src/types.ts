//User data stores the user's schedule, e.g. upcoming tasks
//However a task doesn't have a specific date attached to it, but rather a pattern
//It is the job of the scheduler to schedule the tasks that need to be completed on a day

interface UserData {
    balance: number;
    tasks: Task[];
    rewards: Reward[];
}

interface Task {
    name: string;
    payout: number;
}

interface Reward {
    name: string;
    cost: number;
}