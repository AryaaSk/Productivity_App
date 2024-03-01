//Will save to local storage wherever the global variable has been used (do not save to local storage if setup parameter is being used)
const SETUP: Setup = GetData(SETUP_KEY);
const USER_DATA: UserData = GetData(USER_DATA_KEY); //load from local storage

//SETUP.tasks.push({ schedule: { mode: "oneTime", data: "03/04/2024", nextIteration: "03/04/2024" }, task: { name: "Revise Maths", payout: 300, daysCounter: 0 } })

const Main = () => {
    UpdateUserData(USER_DATA, SETUP, new Date('05/01/2024')); //will modify both user data and setup
    //UpdateUserData(USER_DATA, SETUP, new Date());
    SaveData(SETUP, SETUP_KEY);
    SaveData(USER_DATA, USER_DATA_KEY)

    console.log(SETUP);
    console.log(USER_DATA)

    UpdateTasks(USER_DATA.tasks)
}
Main();