document.addEventListener("DOMContentLoaded", function() {
    const canvas = document.getElementById("animalStatusChart");
    if (!canvas || typeof Chart === "undefined") return;

    const chartData = {
        labels: ["January", "February", "March", "April", "May", "June", "July"],
        datasets: [
            {
                type: 'bar',
                label: 'Available Animals',
                data: [40, 30, 30, 45, 45, 36, 15],
                backgroundColor: '#443e99',
                borderColor: '#443e99',
                borderWidth: 1
            },
            {
                type: 'line',
                label: 'Total Registered',
                data: [112, 96, 115, 85, 94, 123, 100],
                borderColor: '#dc3545',
                backgroundColor: '#dc3545',
                borderWidth: 3,
                tension: 0.1,
                fill: false
            }
        ]
    };

    window.animalStatusChart = new Chart(canvas, {
        type: 'bar',
        data: chartData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: "bottom"
                },
                title: {
                    display: true,
                    text: "Shelter Analytics: Monthly Overview"
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    stacked: false
                }
            }
        }
    });
});