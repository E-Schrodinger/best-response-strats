// Win-Stay-Lose-Shift best response strategy function
function wslsBestResponseStrategy(e, d, t, r, p, s, currentState) {
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
        // 0→0
        if (p + r === s + t || e * (p + r) + 2 * s < 2 * p + e * (s + t)) {
            return 0;
        }
        // 0→3
        else if (p + r !== s + t && 2 * p + e * (s + t) < e * (p + r) + 2 * s) {
            return 3;
        }
        else {
            return null;
        }
    }
    
    // State 1 {0, 1} transitions
    else if (currentState === 1) {
        try {
            // Calculate bounds for conditions
            const bound1Left = safeDivision(-2 * r + e * (p + r - s - t) + 2 * t, 2 * ((-1 + e) ** 2) * (p - r));
            const bound1Right = safeDivision((-2 + e) * p + 2 * s + e * (r - s - t), 2 * ((-1 + e) ** 2) * (s - t));
            
            // 1→0
            const cond10 = (bound1Left < d && d < bound1Right && 
                    ((p + r <= s + t) || (e * (p + r) + 2 * t > 2 * p + e * (s + t))));
            
            if (cond10) {
                return 0;
            }
            
            // 1→1
            if (e * (p + r - s - t) + 2 * t < 2 * (d * ((-1 + e) ** 2) * (p - r) + r)) {
                return 1;
            }
            
            // 1→2
            if (d > bound1Right) {
                return 2;
            }
            
            // 1→3
            const bound2Left = safeDivision((-2 + e) * p + 2 * s + e * (r - s - t), 2 * ((-1 + e) ** 2) * (p - r));
            const bound2Right = safeDivision(-2 * r + e * (p + r - s - t) + 2 * t, 2 * ((-1 + e) ** 2) * (s - t));
            
            const cond13 = (bound2Left < d && d < bound2Right && 
                    p + r !== s + t && 2 * r + e * (s + t) < e * (p + r) + 2 * s);
            
            if (cond13) {
                return 3;
            }
        }
        catch {
            // If any calculation fails, continue to next check
        }
        
        return null;
    }
    
    // State 2 {1, 0} transitions
    else if (currentState === 2) {
        try {
            // Calculate bounds for conditions
            const bound1Left = safeDivision(-(((-2 + e) * p) - 2 * s + e * (-r + s + t)), 2 * ((-1 + e) ** 2) * (s - t));
            const bound1Right = safeDivision(2 * (r - t) + e * (-p - r + s + t), 2 * ((-1 + e) ** 2) * (p - r));
            
            // 2→0
            const cond20 = (bound1Left < d && d < bound1Right && 
                    ((p + r <= s + t) || (e * (p + r) + 2 * t > 2 * p + e * (s + t))));
            
            if (cond20) {
                return 0;
            }
            
            // 2→1
            if (d < bound1Left) {
                return 1;
            }
            
            // 2→2
            if (2 * (r - t) + e * (-p - r + s + t) > 2 * d * ((-1 + e) ** 2) * (p - r)) {
                return 2;
            }
            
            // 2→3
            const bound2Left = safeDivision(2 * (r - t) + e * (-p - r + s + t), 2 * ((-1 + e) ** 2) * (s - t));
            const bound2Right = safeDivision(-(((-2 + e) * p) - 2 * s + e * (-r + s + t)), 2 * ((-1 + e) ** 2) * (p - r));
            
            const cond23 = (bound2Left < d && d < bound2Right && 
                    p + r !== s + t && 2 * r + e * (s + t) < e * (p + r) + 2 * s);
            
            if (cond23) {
                return 3;
            }
        }
        catch {
            // If any calculation fails, continue to next check
        }
        
        return null;
    }
    
    // State 3 {1, 1} transitions
    else if (currentState === 3) {
        // 3→0
        if (p + r === s + t || 2 * r + e * (s + t) < e * (p + r) + 2 * t) {
            return 0;
        }
        // 3→3
        else if (p + r !== s + t && e * (p + r) + 2 * t < 2 * r + e * (s + t)) {
            return 3;
        }
        else {
            return null;
        }
    }
    
    else {
        return null;  // Invalid state
    }
}