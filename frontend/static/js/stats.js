import {nav} from "./nav.js";
import {checkAuth} from "./auth.js";
const API_BASE_URL = window.location.origin;
document.addEventListener("DOMContentLoaded", async () => {
 const usernamePlaceholder = document.getElementById("username-placeholder"); //Element in stats.html to display username and check if user is authenticated
const user = await checkAuth();
  if (!user) return;
 if (usernamePlaceholder) {
  usernamePlaceholder.textContent = user.username;
}
nav();
const username=user.username;
const response= await fetch (`${API_BASE_URL}/api/users/${username}/stats`,{
    credentials:"include"
});
const stats = await response.json();
 const phaseDistribution =
        stats.phase_distribution;

    const labels = Object.keys(
        phaseDistribution
    ).map(
        phase => `Phase ${phase}`
    );

    const values = Object.values(
        phaseDistribution
    );
const ctx = document.getElementById('phaseChart');
new Chart(ctx, {

    type: 'bar',

    data: {

        labels: labels,

        datasets: [{

            label: 'Vocabulary count',

            data: values,

            borderWidth: 1
        }]
    },

    options: {

        responsive: true,

        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
});