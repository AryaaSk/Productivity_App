//backend logic/storage
interface Task {
    name: string;
    payout: number
}
interface Reward {
    name: string;
    cost: number
}

const TASKS_STORAGE_KEY = "tasksJSON";
const REWARDS_STORAGE_KEY = "rewardsJSON";

export const GetJSONArrayFromLocal = (key: string) => {
    const json = localStorage.getItem(key);
    const data = json != null ? JSON.parse(json) : [];
    return data
}
export const SaveJSONToLocal = (key: string, data: any) => {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
}


export const GetState = () => {
    const tasks = GetJSONArrayFromLocal(TASKS_STORAGE_KEY)
    const rewards = GetJSONArrayFromLocal(REWARDS_STORAGE_KEY);

    return { tasks: tasks, rewards: rewards };
}