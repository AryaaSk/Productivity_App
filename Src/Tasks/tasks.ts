const SETUP: Setup = GetData(SETUP_KEY);
const USER_DATA: UserData = GetData(USER_DATA_KEY); //load from local storage
const HISTORY: HistoryLog[] = GetData(HISTORY_KEY);

const TODAY_DATE = new Date();

const UpdateBalance = (balance: number) => {
    const element = document.getElementById("title")!;
    element.innerText = `Tasks - Current Balance: $${balance}`;
}

const Main = () => {
    //synchronise user data using setup
    SYNCHRONISE_USER_DATA(TODAY_DATE);

    console.log(SETUP);
    console.log(USER_DATA);
    console.log(HISTORY);

    //Display data
    UpdateBalance(USER_DATA.balance);
}
Main();