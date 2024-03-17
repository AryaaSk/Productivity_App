const AttachListenersAddGoal= () => {
    const LinkSliderToLabel = (sliderID: string, labelID: string) => {
        const slider = <HTMLInputElement>document.getElementById(sliderID)!;
        const label = document.getElementById(labelID)!;
        slider.addEventListener('input', () => {
            const isInteger = Number(slider.value) % 1 == 0;
            label.innerText = slider.value + (isInteger ? ".0" : "");
            UpdateGoalPayoutValue();
        });
    }

    LinkSliderToLabel("accomplishmentSlider", "accomplishmentValue");
    LinkSliderToLabel("timeSlider", "timeValue");

    const addGoalButton = document.getElementById("add")!;
    addGoalButton.onclick = () => {
        AddGoalFromUI();
    }
}

const UpdateGoalPayoutValue = () => {
    const accomplishment = Number((<HTMLInputElement>document.getElementById("accomplishmentSlider")!).value);
    const time = Number((<HTMLInputElement>document.getElementById("timeSlider")!).value);
    
    const payoutLabel = document.getElementById("payout")!;
    const payout = Math.round(Math.max(0, 527.777*time - 277.777) + Math.max(0, 527.777*accomplishment - 277.777));
    payoutLabel.innerText = `$${payout}`;

    return payout;
}



const AddGoalFromUI = () => {
    //get name
    const name = (<HTMLInputElement>document.getElementById("name")!).value;
    if (name.replaceAll(" ", "") == "") {
        alert("Cannot add a goal without a name!");
        return;
    }

    //get payout
    const payout = UpdateGoalPayoutValue();

    //add goal to setup and update user data
    const goal: Goal = { name: name, payout: payout };
    SETUP.goals.push(goal);

    ADD_USER_DATA_GOALS();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    //return back to setup screen
    location.href = "/Src/Setup/setup.html";
}



const MainAddGoal = () => {
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    AttachListenersAddGoal();
    UpdateGoalPayoutValue();
}
MainAddGoal();