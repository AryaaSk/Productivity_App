"use strict";
const appearance = localStorage.getItem("appearance");
if (appearance == null || appearance == "light") {
    //do nothing since Native is in light mode by default
}
else {
    LoadDarkMode();
}
TAB_BAR_CONFIG = [
    { iconSrc: "Assets//checkmark.svg", title: "Tasks", path: "tasks.html" },
    { iconSrc: "Assets//cart.svg", title: "Rewards", path: "rewards.html" },
    { iconSrc: "Assets//gearshape.svg", title: "Setup", path: "setup.html" },
];
InitTabBar();
