"use strict";
const PopulateRewards = (rewards) => {
    //will use same template as tasks for now, however later I will differentiate rewards
    const container = document.getElementById("rewardContainer");
    container.innerHTML = "";
    for (const [i, reward] of rewards.entries()) {
        const rewardElement = document.createElement("div");
        rewardElement.className = "reward";
        rewardElement.innerHTML =
            `<div><h3>${reward.name}</h3></div>`;
        const claimButton = document.createElement("button");
        claimButton.innerText = `$${reward.cost}`;
        claimButton.onclick = () => { ClaimReward(i); };
        rewardElement.append(claimButton);
        container.append(rewardElement);
    }
};
