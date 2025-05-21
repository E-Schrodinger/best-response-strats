// Function to generate visualization based on current settings
function generateVisualization() {
    const visualizationType = document.querySelector('input[name="visualization-type"]:checked').value;
    
    if (visualizationType === 'heatmap') {
        plotBestResponseHeatmap();
    } else {
        plotBestResponseNetwork();
    }
}

// Initialize the page
function initialize() {
    // Set up event listeners
    document.getElementById('x-axis').addEventListener('change', createSliders);
    document.getElementById('y-axis').addEventListener('change', createSliders);
    document.getElementById('state-space').addEventListener('change', function() {
        // Update state dropdowns and re-generate visualization when state space changes
        updateStateDropdowns();
        generateVisualization();
    });
    
    // Add event listeners for visualization type toggle
    document.querySelectorAll('input[name="visualization-type"]').forEach(radio => {
        radio.addEventListener('change', function() {
            updateUI();
            // Don't auto-generate to avoid performance issues - let user click the button
        });
    });
    
    document.getElementById('generate-btn').addEventListener('click', generateVisualization);
    
    // Initialize state dropdowns
    updateStateDropdowns();
    
    // Initialize UI based on default visualization type
    updateUI();
    
    // Generate an initial visualization
    generateVisualization();
}

// Start the app when the page loads
window.addEventListener('load', initialize);