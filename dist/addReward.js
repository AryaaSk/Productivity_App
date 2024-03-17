"use strict";
const AttachListenersAddReward = () => {
    const LinkSliderToLabel = (sliderID, labelID) => {
        const slider = document.getElementById(sliderID);
        const label = document.getElementById(labelID);
        slider.addEventListener('input', () => {
            const isInteger = Number(slider.value) % 1 == 0;
            label.innerText = slider.value + (isInteger ? ".0" : "");
            UpdateCostValue();
        });
    };
    LinkSliderToLabel("funSlider", "funValue");
    LinkSliderToLabel("timeSlider", "timeValue");
    const addRewardButton = document.getElementById("add");
    addRewardButton.onclick = () => {
        AddRewardFromUI();
    };
};
const UpdateCostValue = () => {
    const fun = Number(document.getElementById("funSlider").value);
    const time = Number(document.getElementById("timeSlider").value);
    const costLabel = document.getElementById("cost");
    const cost = Math.round(8.809 * Math.exp(0.46 * fun) + Math.max(30, 173.333 * time - 108.333));
    costLabel.innerText = `$${cost}`;
    return cost;
};
const AddRewardFromUI = () => {
    //get name
    const name = document.getElementById("name").value;
    if (name.replaceAll(" ", "") == "") {
        alert("Cannot add a reward without a name!");
        return;
    }
    //get cost
    const cost = UpdateCostValue();
    //add reward to setup and update user data
    const reward = { name: name, cost: cost };
    SETUP.rewards.push(reward);
    ADD_USER_DATA_REWARDS();
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    //return back to setup screen
    location.href = "setup.html";
};
const MainAddReward = () => {
    SYNCHRONISE_USER_DATA(TODAY_DATE);
    SaveData(USER_DATA, USER_DATA_KEY);
    SaveData(SETUP, SETUP_KEY);
    AttachListenersAddReward();
    UpdateCostValue();
};
MainAddReward();
