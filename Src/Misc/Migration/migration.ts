//When making updates to the JSON schema (the data structure of SETUP, USER_DATA and HISTORY) I'll need to update older users to the new schema before the app can use the data at all
//Asssume storage.js has already been loaded

//Initialise global variables
const TODAY_DATE = new Date();

const SETUP: Setup = GetData(SETUP_KEY);
const USER_DATA: UserData = GetData(USER_DATA_KEY); //load from local storage
const HISTORY: HistoryLog[] = GetData(HISTORY_KEY);

//Apply migrations to this this data depending on the app version (stored in user data)
//Unlike an installed app, this PWA will always have the most recent version loaded; therefore there is no need to store the appVersion on the app locally, but rather we just need to store it as an attribute in the user's local storage
//Will check for version and then apply changes, in ascending order so multiple updates can be applied sequentially

if (USER_DATA.appVersion == undefined) {
    //user data created before migration was implemented;

    //Migration changes appVersion undefined -> 1:
    //Added attribute appVersion to userData
    USER_DATA.appVersion = 1;
    console.log("Updated to app version 1");
}

//Once all data is upto date, we can save the new data
SaveData(USER_DATA, USER_DATA_KEY);
SaveData(SETUP, SETUP_KEY);
SaveData(HISTORY, HISTORY_KEY)