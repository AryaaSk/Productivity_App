"use strict";
//This app can become highly optimized for producitivity by properly tuning different parameters
//These parameters will define how tasks and rewards change over time: this creates dynamic user incentives, and thus increases motivation to complete certain tasks
const DAILY_TAX = 1000;
const PayoutDamping = (payout, daysPast) => {
    //payout for completing a task will decrease as time increase; this motivates the user to complete tasks faster
    //damping function: e^(-0.4x)
    return Math.round(payout * Math.exp(-0.4 * daysPast));
};
