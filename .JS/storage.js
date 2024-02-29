"use strict";
const STORAGE_KEY = "userData";
const SaveUserData = (data) => {
    const json = JSON.stringify(data);
    localStorage.setItem(STORAGE_KEY, json);
};
const GetUserData = () => {
    const defaultUserData = { balance: 0, tasks: [], rewards: [] };
    const userDataJSON = localStorage.getItem(STORAGE_KEY);
    return userDataJSON != null ? JSON.parse(userDataJSON) : defaultUserData;
};
