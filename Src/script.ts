//Will save to local storage wherever the global variable has been used (do not save to local storage if setup parameter is being used)
const SETUP: Setup = GetData(SETUP_KEY);
const USER_DATA: UserData = GetData(USER_DATA_KEY); //load from local storage
const HISTORY: HistoryLog[] = GetData(HISTORY_KEY);

let CURRENT_DATE: Date;

const Main = () => {
    CURRENT_DATE = new Date();

    CatchUpUserData(USER_DATA, SETUP, CURRENT_DATE); //will modify both user data and setup
    SaveData(SETUP, SETUP_KEY);
    SaveData(USER_DATA, USER_DATA_KEY)

    console.log(SETUP);
    console.log(USER_DATA);
    console.log(HISTORY);

    DisplayTasksPage();
    AttachTabBarListeners();
}
Main();