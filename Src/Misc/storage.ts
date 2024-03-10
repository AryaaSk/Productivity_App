const SETUP_KEY = "setup"
const USER_DATA_KEY = "userData"
const HISTORY_KEY = "history";

const DEFAULTS: { [k: string] : any } = {}
DEFAULTS[SETUP_KEY] = { tasks: [], rewards: [] };
DEFAULTS[USER_DATA_KEY] = { balance: 0, tasks: [], rewards: [], lastScheduleUpdate: FormatDate(new Date()) };
DEFAULTS[HISTORY_KEY] = [];

const SaveData = (data: any, key: string) => {
    const json = JSON.stringify(data);
    localStorage.setItem(key, json);
}

const GetData = (key: string) => {
    const defaultData = DEFAULTS[key]
    const json = localStorage.getItem(key);

    return json != null ? JSON.parse(json) : defaultData;
}

//Initialise global variables
const SETUP: Setup = GetData(SETUP_KEY);
const USER_DATA: UserData = GetData(USER_DATA_KEY); //load from local storage
const HISTORY: HistoryLog[] = GetData(HISTORY_KEY);

const TODAY_DATE = new Date();