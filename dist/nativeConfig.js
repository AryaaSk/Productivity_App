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
    { iconSrc: "Assets//gearshape.svg", title: "Setup", path: "setup.html", subpaths: ["export.html", "addTask.html", "addReward.html"] },
];
InitTabBar();
