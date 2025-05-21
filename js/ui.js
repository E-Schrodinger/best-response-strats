// Function to update state selection dropdowns based on the selected state space
function updateStateDropdowns() {
    const stateSpace = document.getElementById('state-space').value;
    const initialStateSelect = document.getElementById('initial-state');
    const targetStateSelect = document.getElementById('target-state');
    
    // Store current selections
    const currentInitialState = initialStateSelect.value;
    const currentTargetState = targetStateSelect.value;
    
    // Clear existing options
    initialStateSelect.innerHTML = '';
    targetStateSelect.innerHTML = '';
    
    // Add new options with the appropriate labels
    for (let i = 0; i < 4; i++) {
        const initialOption = document.createElement('option');
        initialOption.value = i;
        initialOption.textContent = stateLabels[stateSpace][i];
        initialStateSelect.appendChild(initialOption);
        
        const targetOption = document.createElement('option');
        targetOption.value = i;
        targetOption.textContent = stateLabels[stateSpace][i];
        targetStateSelect.appendChild(targetOption);
    }
    
    // Restore selections if possible
    initialStateSelect.value = currentInitialState;
    targetStateSelect.value = currentTargetState;
}

// Function to create parameter sliders
function createSliders() {
    const slidersContainer = document.getElementById('sliders-container');
    const visualizationType = document.querySelector('input[name="visualization-type"]:checked').value;
    
    // Clear existing sliders
    slidersContainer.innerHTML = '';
    
    if (visualizationType === 'heatmap') {
        // For heatmap, create sliders for all parameters except x and y axes
        const xAxis = document.getElementById('x-axis').value;
        const yAxis = document.getElementById('y-axis').value;
        
        for (const param of ['t', 'r', 'p', 's', 'd', 'e']) {
            if (param !== xAxis && param !== yAxis) {
                createSlider(param, slidersContainer);
            }
        }
    } else {
        // For network graph, create sliders for all parameters
        for (const param of ['t', 'r', 'p', 's', 'd', 'e']) {
            createSlider(param, slidersContainer);
        }
    }
}

// Helper function to create a single slider
function createSlider(param, container) {
    const sliderContainer = document.createElement('div');
    sliderContainer.className = 'slider-container';
    
    const labelContainer = document.createElement('div');
    labelContainer.style.display = 'flex';
    labelContainer.style.justifyContent = 'space-between';
    
    const label = document.createElement('label');
    label.textContent = paramLabels[param];
    label.setAttribute('for', `${param}-slider`);
    
    const valueDisplay = document.createElement('span');
    valueDisplay.id = `${param}-value`;
    valueDisplay.className = 'value-display';
    valueDisplay.textContent = paramDefaults[param].toFixed(2);
    
    labelContainer.appendChild(label);
    labelContainer.appendChild(valueDisplay);
    
    const slider = document.createElement('input');
    slider.type = 'range';
    slider.id = `${param}-slider`;
    slider.min = paramRanges[param].min;
    slider.max = paramRanges[param].max;
    slider.step = 0.01;
    slider.value = paramDefaults[param];
    
    slider.addEventListener('input', function() {
        valueDisplay.textContent = Number(this.value).toFixed(2);
    });
    
    sliderContainer.appendChild(labelContainer);
    sliderContainer.appendChild(slider);
    container.appendChild(sliderContainer);
}

// Function to get current parameter values
function getParameterValues() {
    const visualizationType = document.querySelector('input[name="visualization-type"]:checked').value;
    
    const params = {
        t: paramDefaults.t,
        r: paramDefaults.r,
        p: paramDefaults.p,
        s: paramDefaults.s,
        d: paramDefaults.d,
        e: paramDefaults.e
    };
    
    // For heatmap, exclude x and y axis parameters
    if (visualizationType === 'heatmap') {
        const xAxis = document.getElementById('x-axis').value;
        const yAxis = document.getElementById('y-axis').value;
        
        // Update from sliders
        for (const param of ['t', 'r', 'p', 's', 'd', 'e']) {
            if (param !== xAxis && param !== yAxis) {
                const slider = document.getElementById(`${param}-slider`);
                if (slider) {
                    params[param] = parseFloat(slider.value);
                }
            }
        }
        
        return {
            params,
            xAxis,
            yAxis
        };
    } else {
        // For network graph, get all parameters
        for (const param of ['t', 'r', 'p', 's', 'd', 'e']) {
            const slider = document.getElementById(`${param}-slider`);
            if (slider) {
                params[param] = parseFloat(slider.value);
            }
        }
        
        return {
            params
        };
    }
}

// Function to update the UI based on the selected visualization type
function updateUI() {
    const visualizationType = document.querySelector('input[name="visualization-type"]:checked').value;
    const heatmapControls = document.querySelectorAll('.heatmap-controls');
    
    // Show/hide heatmap controls
    heatmapControls.forEach(control => {
        control.style.display = visualizationType === 'heatmap' ? 'block' : 'none';
    });
    
    // Update sliders
    createSliders();
}