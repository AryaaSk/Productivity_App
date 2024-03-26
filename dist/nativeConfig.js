"use strict";
if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    LoadDarkMode();
}
else {
    //do nothing since native is in light mode by default
}
TAB_BAR_CONFIG = [
    { iconSrc: "Assets//checkmark.svg", title: "Tasks", path: "tasks.html" },
    { iconSrc: "Assets//cart.svg", title: "Rewards", path: "rewards.html" },
    { iconSrc: "Assets//trophy.svg", title: "Goals", path: "goals.html" },
    { iconSrc: "Assets//gearshape.svg", title: "Setup", path: "setup.html", subpaths: ["/Src/Migration/export.html", "addTask.html", "addGoal.html", "addReward.html"] },
];
InitTabBar();
