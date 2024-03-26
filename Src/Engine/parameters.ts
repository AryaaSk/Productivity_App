const PayoutDamping = {
    "reverseExponential": (payout: number, daysPast: number) => {
        return Math.round(payout * Math.exp(-0.4 * daysPast));;
    }
}

//All inputs to payouts are normalised in the interval [0, 10]
const TaskPayout = (benefit: number, difficulty: number, time: number): number => {
    return Math.round(8*Math.exp(0.432 * benefit) + 5*Math.exp(0.432 * difficulty) + 52*time + 7);
}

const RewardPayout = (enjoyment: number, time: number): number => {
    return Math.round(8.809*Math.exp(0.46*enjoyment) + Math.max(30, 173.333*time - 108.333));
}

const GoalPayout = (accomplishment: number, time: number): number => {
    return Math.round(Math.max(0, 527.777*time - 277.777) + Math.max(0, 527.777*accomplishment - 277.777));
}