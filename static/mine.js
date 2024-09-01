document.addEventListener('DOMContentLoaded', function() {
    // Static test data
    const years = ['2019', '2020', '2021', '2022', '2023'];
    const coalProductionData = [1, 2, 2.5, 3, 2.8]; // Million tonnes
    const carbonEmissionData = [1500, 2500, 2000, 2800, 2600]; // kg CO2
    const gasEmissionsData = {
        NO2: [12, 14, 15, 13, 16],
        CO2: [850, 900, 950, 870, 920],
        CO: [22, 24, 23, 25, 26],
        CH4: [18, 20, 19, 21, 20]
    };

    // Initialize Charts
    const ctxCoalVsCarbon = document.getElementById('carbon-emission-graph').getContext('2d');
    const ctxGasEmissions = document.getElementById('tree-count-graph').getContext('2d');

    // Create Coal Production vs Carbon Emission Chart
    new Chart(ctxCoalVsCarbon, {
        type: 'line',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'Coal Production (million tonnes)',
                    data: coalProductionData,
                    fill: false,
                    borderColor: 'rgba(75, 192, 192, 1)',
                    tension: 0.1
                },
                {
                    label: 'Carbon Emission (kg CO2)',
                    data: carbonEmissionData,
                    fill: false,
                    borderColor: 'rgba(255, 99, 132, 1)',
                    tension: 0.1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'SI Units'
                    }
                }
            }
        }
    });

    // Create Gas Emissions Bar Chart
    new Chart(ctxGasEmissions, {
        type: 'bar',
        data: {
            labels: years,
            datasets: [
                {
                    label: 'NO2 (kg)',
                    data: gasEmissionsData.NO2,
                    backgroundColor: 'rgba(255, 206, 86, 0.2)',
                    borderColor: 'rgba(255, 206, 86, 1)',
                    borderWidth: 1
                },
                {
                    label: 'CO2 (kg)',
                    data: gasEmissionsData.CO2,
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                },
                {
                    label: 'CO (kg)',
                    data: gasEmissionsData.CO,
                    backgroundColor: 'rgba(255, 99, 132, 0.2)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                },
                {
                    label: 'CH4 (kg)',
                    data: gasEmissionsData.CH4,
                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Emissions (kg)'
                    }
                }
            }
        }
    });
});
