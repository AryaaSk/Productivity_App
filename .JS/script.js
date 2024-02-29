"use strict";
const USER_DATA = GetUserData(); //load from local storage
const Main = () => {
    UpdateTasks(USER_DATA.tasks);
};
Main();
