// Function to generate best response data for heatmap
function generateBestResponseData(resolution = 100) {
    const { params, xAxis, yAxis } = getParameterValues();
    const initialState = parseInt(document.getElementById('initial-state').value);
    const targetState = parseInt(document.getElementById('target-state').value);
    const stateSpace = document.getElementById('state-space').value;
    
    // Create arrays for x and y values
    const xValues = Array.from({ length: resolution }, (_, i) => 
        paramRanges[xAxis].min + (paramRanges[xAxis].max - paramRanges[xAxis].min) * i / (resolution - 1));
    
    const yValues = Array.from({ length: resolution }, (_, i) => 
        paramRanges[yAxis].min + (paramRanges[yAxis].max - paramRanges[yAxis].min) * i / (resolution - 1));
    
    // Initialize result matrix (all zeros)
    const result = Array(resolution).fill().map(() => Array(resolution).fill(0));
    
    // Choose the appropriate strategy function
    const strategyFunction = stateSpace === 'wsls' ? wslsBestResponseStrategy : gtBestResponseStrategy;
    
    // Evaluate each point
    for (let i = 0; i < resolution; i++) {
        for (let j = 0; j < resolution; j++) {
            const xVal = xValues[i];
            const yVal = yValues[j];
            
            // Create a copy of params and update with current x and y values
            const currentParams = { ...params };
            currentParams[xAxis] = xVal;
            currentParams[yAxis] = yVal;
            
            // Get the best action for this state and parameters
            const bestAction = strategyFunction(
                currentParams.e, currentParams.d, currentParams.t, 
                currentParams.r, currentParams.p, currentParams.s, 
                initialState
            );
            
            // Check if the best action is the target
            if (bestAction === targetState) {
                result[j][i] = 1;  // Transpose to match x/y axes
            }
        }
    }
    
    return { xValues, yValues, result };
}

// Function to plot the best response heatmap
function plotBestResponseHeatmap() {
    const { params, xAxis, yAxis } = getParameterValues();
    const initialState = document.getElementById('initial-state').value;
    const targetState = document.getElementById('target-state').value;
    const stateSpace = document.getElementById('state-space').value;
    
    // Get the state labels for the current state space
    const initialStateLabel = stateLabels[stateSpace][initialState];
    const targetStateLabel = stateLabels[stateSpace][targetState]; 
    
    // Get the state space label
    const stateSpaceLabel = stateSpace === 'wsls' ? 'Win-Stay-Lose-Shift' : 'Grim-Trigger';
    
    // Generate data
    const { xValues, yValues, result } = generateBestResponseData();
    
    // Create a heatmap trace with binary colorscale
    const trace = {
        z: result,
        x: xValues,
        y: yValues,
        type: 'heatmap',
        colorscale: [
            [0, 'white'],
            [0.5, 'white'],
            [0.5, 'blue'],
            [1, 'blue']
        ],
        zmin: 0,
        zmax: 1,
        showscale: true,
        colorbar: {
            title: `Is ${targetStateLabel} a best response to ${initialStateLabel}?`,
            tickvals: [0, 1],
            ticktext: ['No', 'Yes']
        }
    };
    
    // Format other parameters for the title
    const otherParams = Object.entries(params)
        .filter(([key, _]) => key !== xAxis && key !== yAxis)
        .map(([key, value]) => `${key}=${value.toFixed(2)}`)
        .join(', ');
    
    // Create the layout
    const layout = {
        title: `Regions where ${targetStateLabel} is a best response to ${initialStateLabel} in ${stateSpaceLabel} State Space<br>(${otherParams})`,
        xaxis: {
            title: paramLabels[xAxis],
            range: [paramRanges[xAxis].min, paramRanges[xAxis].max]
        },
        yaxis: {
            title: paramLabels[yAxis],
            range: [paramRanges[yAxis].min, paramRanges[yAxis].max]
        },
        width: document.getElementById('plot').offsetWidth,
        height: document.getElementById('plot').offsetHeight
    };
    
    // Create the plot
    Plotly.newPlot('plot', [trace], layout);
}