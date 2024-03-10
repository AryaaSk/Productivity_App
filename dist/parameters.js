"use strict";
const PayoutDamping = {
    "reverseExponential": (payout, daysPast) => {
        return Math.round(payout * Math.exp(-0.4 * daysPast));
        ;
    }
};
