const STORAGE_KEY = "userData"

const SaveUserData = (data: UserData) => {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
}

const GetUserData = (): UserData => {
    const defaultUserData = { balance: 0, tasks: [], rewards: [] };
    const userDataJSON = localStorage.getItem(STORAGE_KEY);

    return userDataJSON != null ? JSON.parse(userDataJSON) : defaultUserData
}