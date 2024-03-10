const PayoutDamping = {
    "reverseExponential": (payout: number, daysPast: number) => {
        return Math.round(payout * Math.exp(-0.4 * daysPast));;
    }
}