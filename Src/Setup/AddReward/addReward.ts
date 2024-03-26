const AttachListenersAddReward = () => {
    const LinkSliderToLabel = (sliderID: string, labelID: string) => {
        const slider = <HTMLInputElement>document.getElementById(sliderID)!;
        const label = document.getElementById(labelID)!;
        slider.addEventListener('input', () => {
            const isInteger = Number(slider.value) % 1 == 0;
            label.innerText = slider.value + (isInteger ? ".0" : "");
            UpdateCostValue();
        });
    }
    LinkSliderToLabel("funSlider", "funValue");
    LinkSliderToLabel("timeSlider", "timeValue");

    const addRewardButton = document.getElementById("add")!;
    addRewardButton.onclick = () => {
        AddRewardFromUI();
    }
}

const UpdateCostValue = () => {
    const fun = Number((<HTMLInputElement>document.getElementById("funSlider")!).value);
    const time = Number((<HTMLInputElement>document.getElementById("timeSlider")!).value);
    
    const costLabel = document.getElementById("cost")!;
    const cost = RewardPayout(fun, time);
    costLabel.innerText = `$${cost}`;

    return cost;
}

const AddRewardFromUI = () => {
    //get name
    const name = (<HTMLInputElement>document.getElementById("name")!).value;
    if (name.replaceAll(" ", "") == "") {
        alert("Cannot add a reward without a name!");
        return;
    }

    //get cost
    const cost = UpdateCostValue();

    //add reward to setup and update user data
    const reward: Reward = { name: name, cost: cost };
    SETUP.rewards.push(reward);

    ADD_USER_DATA_REWARDS();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    //return back to setup screen
    location.href = "/Src/Setup/setup.html";
}

const MainAddReward = () => {
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);

    AttachListenersAddReward();
    UpdateCostValue();
}
MainAddReward();