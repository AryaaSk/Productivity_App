const MAX_EARNING_RANGE = 3000; //'maximum' credits earnable a day

interface DayProfile {
    date: string;
    creditsEarned: number;
    tasks: { name: string, summary: string }[];
}

const GenerateProgress = (history: HistoryLog[]) => {
    if (history.length == 0) {
        return [];
    }
    //History contains a list of all tasks completed in ascending order of time
    //If a user completes 10 tasks a day for around 1 year; history will have 3650 items
    //The order of magnitude is in the 1000s to 10000s; so performance shouldn't be a large roadblock

    //concept: user sees how much money they've made per day over a long period of time
    //this would provide a nice overview of the trends and behaviour, but also possibly highlight price inflation

    //starting from day1 of history to current date, create a 'profile' for each day with the date, money earned and tasks completed
    const dayProfiles: DayProfile[] = [];
    const currentProfile: DayProfile = { date: history[0].date, creditsEarned: 0, tasks: [] };
    const PushCurrentToMain = () => {
        dayProfiles.push(JSON.parse(JSON.stringify(currentProfile)));
        currentProfile.date = FormatDate(AddDays(new Date(currentProfile.date), 1)); //using assumption that history logs are in time-ascending order
        currentProfile.creditsEarned = 0;
        currentProfile.tasks = [];
    }

    let i = 0;
    while (i < history.length) {
        const log = history[i];
        if (log.date != currentProfile.date) {
            PushCurrentToMain()
        }

        if (log.date == currentProfile.date) {
            currentProfile.creditsEarned += log.payout;
            currentProfile.tasks.push({ name: log.taskName, summary: log.summary });
            i += 1
        }
        else {} //current profile needs to iterate through dates until it reaches the date of the log
    }
    PushCurrentToMain(); //final date wouldn't have been pushed

    //add remaining dates until current date (stored globally)
    while (currentProfile.date != FormatDate(AddDays(TODAY_DATE, 1))) {
        PushCurrentToMain();
    }

    return dayProfiles;
}



const UpdateEarningRange = () => {
    const earningRangeLabel = document.getElementById("earningRange")!;
    earningRangeLabel.innerText = `$0 → $${MAX_EARNING_RANGE}+`;
}
const UpdateProgressView = (profiles: DayProfile[]) => {
    const section = document.getElementById("progress")!;
    section.innerHTML = "";

    for (const day of profiles) {
        const cell = document.createElement("div");
        cell.className = "cell";

        //determine cell's colour as a percentage of the way along EARNING_RANGE, and then convert this percentage into a colour using css gradient
        //https://stackoverflow.com/questions/61124976/determine-color-based-on-percentage-gradient
        const percentage = Math.min((day.creditsEarned / MAX_EARNING_RANGE) * 100, 100); //use max as it's technically possible to go over max earning range
        cell.style.backgroundPosition = `${percentage}% 0`;

        //when a cell is clicked, give a small report to user
        cell.onclick = () => { CellReport(day); };
        
        section.append(cell);
    }
}

const CellReport = (profile: DayProfile) => {
    //in future I may convert this into a dedicated screen, but for now I'll just use alert
    let tasksSubreport = "";
    for (const task of profile.tasks) {
        tasksSubreport += `• ${task.name}: ${task.summary}\n`;
    }
    if (profile.tasks.length == 0) {
        tasksSubreport = "No tasks completed on this date";
    }

    let report = "";
    report += `${ConvertToFullDate(profile.date)}\n`
    report += `Credits Earned: $${profile.creditsEarned}\n\n`
    report += "Tasks\n";
    report += `${tasksSubreport}`;

    alert(report);
}


const MainProgress = () => {
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    UpdateEarningRange();
    const profiles = GenerateProgress(HISTORY);
    UpdateProgressView(profiles);
}
MainProgress();