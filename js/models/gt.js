// Grim-Trigger best response strategy function
function gtBestResponseStrategy(e, d, t, r, p, s, currentState) {
    // Convert tuple state to integer if needed
    if (Array.isArray(currentState)) {
        if (currentState[0] === 0 && currentState[1] === 0) currentState = 0;
        else if (currentState[0] === 0 && currentState[1] === 1) currentState = 1;
        else if (currentState[0] === 1 && currentState[1] === 0) currentState = 2;
        else if (currentState[0] === 1 && currentState[1] === 1) currentState = 3;
        else return null; // Invalid state
    }
    
    // State 0 {0, 0} transitions
    if (currentState === 0) {
        // 0→0 transition
        if (p + r === s + t || e * (p + r) + 2 * s < 2 * p + e * (s + t)) {
            return 0;
        }
        // 0→3 transition
        else if (p + r !== s + t && 2 * p + e * (s + t) < e * (p + r) + 2 * s) {
            return 3;
        }
        else {
            return null;
        }
    }
    
    // State 1 {0, 1} transitions
    else if (currentState === 1) {
        // 1→0 transition
        const cond_1_0_part1 = (s === 0);
        const cond_1_0_part2 = (e * (p + r) + 2 * t < 2 * p + e * (s + t) && 
                          2 * p + e * (s + d * s + t + d * t) > 
                          2 * s + e * (p + r + d * s) + d * (e**2) * t);
        const cond_1_0_part3 = (e * (p + r) + 2 * t >= 2 * p + e * (s + t) && 
                          2 * (r - t) + e * (-p - r + s + t) + 
                          d * (-1 + e) * (2 * (-1 + e) * p + 2 * t - e * (s + t)) < 0);
        
        if (cond_1_0_part1 || cond_1_0_part2 || cond_1_0_part3) {
            return 0;
        }
        
        // 1→1 transition
        const lowerBound = safeDivision(((-2 + e) * p + 2 * s + e * (r - s - t)), 
                                ((-1 + e) * (2 * (-1 + e) * p - (-2 + e) * s - e * t)));
        const upperBound = safeDivision((-2 * r + e * (p + r - s - t) + 2 * t), 
                                ((-1 + e) * (2 * (-1 + e) * p + 2 * t - e * (s + t))));
        
        if (lowerBound < d && d < upperBound) {
            return 1;
        }
        
        // 1→3 transition
        const cond_1_3_part1 = (s !== 0);
        const cond_1_3_part2 = (d < safeDivision((-2 * r + e * (p + r - s - t) + 2 * t), 
                                     ((2 - 3 * e + e**2) * (s - t))) && 
                     2 * r + e * (s + t) < e * (p + r) + 2 * s);
        const cond_1_3_part3 = (2 * (1 + d + d * e**2) * p + e * (s + 3 * d * s + t + d * t) < 
                     e * (p + 4 * d * p + r) + 2 * (1 + d) * s + d * e**2 * (s + t) &&
                     e * (p + r) + 2 * s <= 2 * r + e * (s + t));
        
        if (cond_1_3_part1 && (cond_1_3_part2 || cond_1_3_part3)) {
            return 3;
        }
        
        return null;
    }
    
    // State 2 {1, 0} transitions
    else if (currentState === 2) {
        // 2→0 transition
        const cond_2_0_part1 = (s === 0 && 
                     e * (p + r - t) + 2 * t + 
                     d * (-1 + e) * (2 * (-1 + e) * p - (-2 + e) * t) > 2 * r);
        
        const cond_2_0_part2_subA = (e * (p + r) + 2 * t >= 2 * p + e * (s + t) || 
                         2 * s + d * e**2 * s + e * (p + r + d * t) < 
                         2 * p + e * (s + d * s + t + d * e * t));
        
        const cond_2_0_part2_subB = (e * (p + r) + 2 * t < 2 * p + e * (s + t) ||
                         e * (p + r - s - t) + 2 * t + 
                         d * (-1 + e) * (2 * (-1 + e) * p + 2 * t - e * (s + t)) > 2 * r);
        
        const cond_2_0_part2 = (s !== 0 && cond_2_0_part2_subA && cond_2_0_part2_subB);
        
        if (cond_2_0_part1 || cond_2_0_part2) {
            return 0;
        }
        
        // 2→2 transition
        const lowerBound = safeDivision((2 * (r - t) + e * (-p - r + s + t)),
                                ((-1 + e) * (2 * (-1 + e) * p + 2 * t - e * (s + t))));
        const upperBound = safeDivision(((-((-2 + e) * p) - 2 * s + e * (-r + s + t))), 
                                ((-1 + e) * (2 * (-1 + e) * p - (-2 + e) * s - e * t)));
        
        if (lowerBound < d && d < upperBound) {
            return 2;
        }
        
        // 2→3 transition
        // Part 1: 2p == s+t && s != 0 && ...
        const d_bound_2_3 = safeDivision((2 * (r - t) + e * (-p - r + s + t)), 
                              ((2 - 3 * e + e**2) * (s - t)));
        
        const cond_2_3_part1_subA = (d > d_bound_2_3 || 2 * r + e * (s + t) > e * (p + r) + 2 * s);
        
        const cond_2_3_part1_subB = (2 * r + e * (s + t) <= e * (p + r) + 2 * s || 
                         ((-2 + 2 * d * (-1 + e)**2 + e) * p + 
                          e * (r + (-1 + 3 * d) * s + (-1 + d) * t) > 
                          2 * (-1 + d) * s + d * e**2 * (s + t)));
        
        const cond_2_3_part1 = (2 * p === s + t && s !== 0 && cond_2_3_part1_subA && cond_2_3_part1_subB);
        
        // Part 2: 2p != s+t && s != 0 && ...
        const cond_2_3_part2_subA = (e * (p + r) + 2 * s >= 2 * r + e * (s + t) || 
                         ((-2 + 2 * d * (-1 + e)**2 + e) * p + 
                          e * (r + (-1 + 3 * d) * s + (-1 + d) * t) > 
                          2 * (-1 + d) * s + d * e**2 * (s + t)));
        
        const cond_2_3_part2_subB = (e * (p + r) + 2 * s < 2 * r + e * (s + t) || 
                         2 * r + 2 * d * t + d * e**2 * t + e * (s + 3 * d * s + t) > 
                         d * e**2 * s + 2 * (d * s + t) + e * (p + r + 3 * d * t));
        
        const cond_2_3_part2 = (2 * p !== s + t && s !== 0 && cond_2_3_part2_subA && cond_2_3_part2_subB);
        
        // Part 3: s == 0 && ...
        const cond_2_3_part3 = (s === 0 && 
                     ((-2 + 2 * d * (-1 + e)**2 + e) * p + e * (r + (-1 + d - d * e) * t) > 0));
        
        if (cond_2_3_part1 || cond_2_3_part2 || cond_2_3_part3) {
            return 3;
        }
        
        return null;
    }
    
    // State 3 {1, 1} transitions
    else if (currentState === 3) {
        // 3→0 transition
        if (p + r === s + t || 2 * r + e * (s + t) < e * (p + r) + 2 * t) {
            return 0;
        }
        
        // 3→3 transition
        else if (p + r !== s + t && e * (p + r) + 2 * t < 2 * r + e * (s + t)) {
            return 3;
        }
        
        return null;
    }
    
    else {
        return null;  // Invalid state
    }
}