// Function to compute all best responses for network graph
function computeAllBestResponses() {
    const { params } = getParameterValues();
    const stateSpace = document.getElementById('state-space').value;
    
    // Choose the appropriate strategy function
    const strategyFunction = stateSpace === 'wsls' ? wslsBestResponseStrategy : gtBestResponseStrategy;
    
    // Compute best responses for all states
    const bestResponses = [];
    
    for (let state = 0; state < 4; state++) {
        const response = strategyFunction(
            params.e, params.d, params.t, params.r, params.p, params.s, state
        );
        
        if (response !== null) {
            bestResponses.push({
                from: state,
                to: response
            });
        }
    }
    
    return bestResponses;
}

// Function to plot the best response network graph
function plotBestResponseNetwork() {
    const { params } = getParameterValues();
    const stateSpace = document.getElementById('state-space').value;
    
    // Get the state space label
    const stateSpaceLabel = stateSpace === 'wsls' ? 'Win-Stay-Lose-Shift' : 'Grim-Trigger';
    
    // Compute best responses
    const bestResponses = computeAllBestResponses();
    
    // Define node positions (square layout)
    const nodePositions = [
        {x: 0, y: 0},   // (0,0) - All D
        {x: 1, y: 0},   // (0,1) - Anti-WSLS/GT
        {x: 0, y: 1},   // (1,0) - WSLS/GT
        {x: 1, y: 1}    // (1,1) - All C
    ];
    
    // Create nodes
    const nodes = {
        x: nodePositions.map(p => p.x),
        y: nodePositions.map(p => p.y),
        mode: 'markers+text',
        marker: {
            size: 30,
            color: ['red', 'orange', 'green', 'blue']
        },
        text: Array.from({length: 4}, (_, i) => shortStateLabels[stateSpace][i]),
        textposition: 'bottom center',
        hoverinfo: 'text',
        hovertext: Array.from({length: 4}, (_, i) => stateLabels[stateSpace][i]),
        type: 'scatter'
    };
    
    // Create edges
    const edges = [];
    
    for (const response of bestResponses) {
        const fromPos = nodePositions[response.from];
        const toPos = nodePositions[response.to];
        
        // Don't draw self-loops as arrows (handled separately)
        if (response.from !== response.to) {
            // Calculate arrow positions with slight curve for aesthetics
            const midX = (fromPos.x + toPos.x) / 2;
            const midY = (fromPos.y + toPos.y) / 2;
            
            // Adjust for potential bidirectional edges
            const hasBidirectional = bestResponses.some(r => 
                r.from === response.to && r.to === response.from
            );
            
            // If bidirectional, curve the edges
            const curveFactor = hasBidirectional ? 0.2 : 0;
            
            // Perpendicular vector to create curve
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            const perpX = -dy;
            const perpY = dx;
            
            const controlX = midX + perpX * curveFactor;
            const controlY = midY + perpY * curveFactor;
            
            // Create annotation for the arrow
            edges.push({
                x: [fromPos.x, controlX, toPos.x],
                y: [fromPos.y, controlY, toPos.y],
                mode: 'lines',
                line: {
                    width: 2,
                    color: 'black',
                    shape: hasBidirectional ? 'spline' : 'linear'
                },
                hoverinfo: 'none',
                type: 'scatter'
            });
        }
    }
    
    // Add self-loops as separate traces
    for (const response of bestResponses) {
        if (response.from === response.to) {
            const pos = nodePositions[response.from];
            
            // Create a loop above the node
            const loopSize = 0.15;
            const loopX = [
                pos.x, 
                pos.x + loopSize, 
                pos.x, 
                pos.x - loopSize, 
                pos.x
            ];
            const loopY = [
                pos.y, 
                pos.y + loopSize, 
                pos.y + loopSize * 2, 
                pos.y + loopSize, 
                pos.y
            ];
            
            edges.push({
                x: loopX,
                y: loopY,
                mode: 'lines',
                line: {
                    width: 2,
                    color: 'black',
                    shape: 'spline'
                },
                hoverinfo: 'none',
                type: 'scatter'
            });
        }
    }
    
    // Create arrowhead annotations
    const annotations = [];
    
    for (const response of bestResponses) {
        // Skip self-loops for annotations, handled separately
        if (response.from !== response.to) {
            const fromPos = nodePositions[response.from];
            const toPos = nodePositions[response.to];
            
            // Check if bidirectional
            const hasBidirectional = bestResponses.some(r => 
                r.from === response.to && r.to === response.from
            );
            
            // Calculate vector from -> to
            const dx = toPos.x - fromPos.x;
            const dy = toPos.y - fromPos.y;
            
            // Normalize and scale to avoid overlapping with nodes
            const length = Math.sqrt(dx*dx + dy*dy);
            const scale = 0.8; // Reduce length to avoid overlapping
            const normalizedDx = dx / length * scale;
            const normalizedDy = dy / length * scale;
            
            // Adjust for potential bidirectional edges
            const curveFactor = hasBidirectional ? 0.2 : 0;
            
            // Perpendicular vector to create curve
            const perpX = -dy;
            const perpY = dx;
            
            // Calculate arrow endpoint with curve adjustment
            const endX = fromPos.x + normalizedDx + perpX * curveFactor;
            const endY = fromPos.y + normalizedDy + perpY * curveFactor;
            
            annotations.push({
                x: toPos.x,
                y: toPos.y,
                xref: 'x',
                yref: 'y',
                axref: 'x',
                ayref: 'y',
                ax: endX,
                ay: endY,
                showarrow: true,
                arrowhead: 3,
                arrowsize: 1.5,
                arrowwidth: 2,
                standoff: 15  // Distance from the end of the arrow to the point
            });
        }
    }
    
    // Format parameter values for the title
    const paramsString = Object.entries(params)
        .map(([key, value]) => `${key}=${value.toFixed(2)}`)
        .join(', ');
    
    // Create the layout
    const layout = {
        title: `Best Response Network for ${stateSpaceLabel} State Space<br>(${paramsString})`,
        showlegend: false,
        xaxis: {
            range: [-0.2, 1.2],
            zeroline: false,
            showgrid: false,
            showticklabels: false,
            fixedrange: true
        },
        yaxis: {
            range: [-0.2, 1.2],
            zeroline: false,
            showgrid: false,
            showticklabels: false,
            fixedrange: true,
            scaleanchor: 'x',
            scaleratio: 1
        },
        annotations: annotations,
        hovermode: 'closest',
        width: document.getElementById('plot').offsetWidth,
        height: document.getElementById('plot').offsetHeight
    };
    
    // Combine all traces
    const allTraces = [nodes, ...edges];
    
    // Create the plot
    Plotly.newPlot('plot', allTraces, layout);
}