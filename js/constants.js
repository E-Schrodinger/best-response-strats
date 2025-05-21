// Parameter ranges and default values
const paramDefaults = {
    t: 1.0,
    r: 0.9,
    p: 0.5,
    s: 0.0,
    d: 0.5,
    e: 0.2
};

const paramRanges = {
    t: { min: 0.01, max: 1.0 },
    r: { min: 0.01, max: 1.0 },
    p: { min: 0.01, max: 1.0 },
    s: { min: 0.0, max: 1.0 },
    d: { min: 0.01, max: 0.99 },
    e: { min: 0.01, max: 0.99 }
};

const paramLabels = {
    t: "t - Temptation Payoff (D/C)",
    r: "r - Reward Payoff (C/C)",
    p: "p - Punishment Payoff (D/D)",
    s: "s - Sucker's Payoff (C/D)",
    d: "d - Discount Factor",
    e: "e - Exploration Rate"
};

// Define state labels for different state spaces
const stateLabels = {
    wsls: {
        0: "(0,0) - All D",
        1: "(0,1) - Anti-WSLS",
        2: "(1,0) - WSLS",
        3: "(1,1) - All C"
    },
    gt: {
        0: "(0,0) - All D",
        1: "(0,1) - Anti-GT",
        2: "(1,0) - GT",
        3: "(1,1) - All C"
    }
};

// Define shorter state labels for network diagram
const shortStateLabels = {
    wsls: {
        0: "All D",
        1: "Anti-WSLS",
        2: "WSLS",
        3: "All C"
    },
    gt: {
        0: "All D",
        1: "Anti-GT",
        2: "GT",
        3: "All C"
    }
};

// Convert state numbers to tuples
function stateToTuple(state) {
    switch (parseInt(state)) {
        case 0: return [0, 0];
        case 1: return [0, 1];
        case 2: return [1, 0];
        case 3: return [1, 1];
        default: throw new Error("Invalid state");
    }
}

// Safe division function to handle division by zero or very small numbers
function safeDivision(numerator, denominator) {
    try {
        if (Math.abs(denominator) < 1e-10) {
            return numerator >= 0 ? Infinity : -Infinity;
        }
        return numerator / denominator;
    } catch {
        return Infinity;
    }
}