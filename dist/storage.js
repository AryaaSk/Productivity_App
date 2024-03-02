"use strict";
const SETUP_KEY = "setup";
const USER_DATA_KEY = "userData";
const SaveData = (data, key) => {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
};
const GetData = (key) => {
    const defaultData = DEFAULTS[key];
    const json = localStorage.getItem(key);
    return json != null ? JSON.parse(json) : defaultData;
};
