document.addEventListener('DOMContentLoaded', function() {
    // Initialize Charts
    const ctx1 = document.getElementById('salesChart').getContext('2d');
    const salesChart = new Chart(ctx1, {
        type: 'line',
        data: {
            labels: ['January', 'February', 'March', 'April', 'May'],
            datasets: [{
                label: 'Sales',
                data: [10, 20, 15, 25, 30],
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }]
        }
    });

    const ctx2 = document.getElementById('revenueChart').getContext('2d');
    const revenueChart = new Chart(ctx2, {
        type: 'bar',
        data: {
            labels: ['Product A', 'Product B', 'Product C'],
            datasets: [{
                label: 'Revenue',
                data: [3000, 5000, 2000],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                borderWidth: 1
            }]
        }
    });

    const ctx3 = document.getElementById('feedbackChart').getContext('2d');
    const feedbackChart = new Chart(ctx3, {
        type: 'pie',
        data: {
            labels: ['Positive', 'Neutral', 'Negative'],
            datasets: [{
                label: 'Feedback',
                data: [60, 25, 15],
                backgroundColor: ['rgba(75, 192, 192, 0.2)', 'rgba(153, 102, 255, 0.2)', 'rgba(255, 159, 64, 0.2)'],
                borderColor: ['rgba(75, 192, 192, 1)', 'rgba(153, 102, 255, 1)', 'rgba(255, 159, 64, 1)'],
                borderWidth: 1
            }]
        }
    });

    // Handle sidebar navigation
    const sections = document.querySelectorAll('.content-section');
    const buttons = document.querySelectorAll('.sidebar a');

    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.id.replace('-btn', '');
            sections.forEach(section => {
                section.classList.add('hidden');
            });
            document.getElementById(targetId).classList.remove('hidden');
        });
    });

    // Handle Dashboard link click
    document.getElementById('dashboard-btn').addEventListener('click', function(e) {
        e.preventDefault();
        sections.forEach(section => {
            section.classList.add('hidden');
        });
        document.getElementById('dashboard').classList.remove('hidden');
    });
});
