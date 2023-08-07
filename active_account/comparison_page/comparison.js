/* By Oru-Bus - orubus.twitch@gmail.com */

const {Chart, Legend, Title} = require('chart.js/auto');


function showLoadingPage() {
    isLoading = true;

    const loadingPage = document.createElement('iframe');
    loadingPage.src = "../../loading_page/loading.html";
    loadingPage.style.position = "fixed";
    loadingPage.style.top = "0";
    loadingPage.style.left = "0";
    loadingPage.style.width = "100%";
    loadingPage.style.height = "100%";
    loadingPage.style.border = "none";
    document.body.appendChild(loadingPage);
};

function getRandomSeconds(minSeconds, maxSeconds) {
    return Math.floor(Math.random() * (maxSeconds - minSeconds + 1)) + minSeconds;
};

function hideLoadingPage(minSeconds, maxSeconds, handle) {
    if (isLoading) {
        if (handle) {
            var randomSeconds = getRandomSeconds(minSeconds, maxSeconds);
            return randomSeconds;
        } else {
            var randomSeconds = getRandomSeconds(minSeconds, maxSeconds);
        }
        setTimeout(() => {
            const loadingPage = document.querySelector('iframe[src="../../loading_page/loading.html"]');
            if (loadingPage) {
                loadingPage.remove();
                isLoading = false;
            }
        }, randomSeconds);
    };
};

function handleRedirect(location, minSeconds, maxSeconds) {
    const randomSeconds = hideLoadingPage(minSeconds, maxSeconds, true);
    setTimeout(() => {
        window.location.href = location;
    }, randomSeconds);
};

const homeLink = document.getElementById('homeLink');
homeLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    const linkHref = homeLink.getAttribute('href');
    handleRedirect(linkHref, 150, 400);
});

const comparisonLink = document.getElementById('comparisonLink');
comparisonLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    const linkHref = comparisonLink.getAttribute('href');
    handleRedirect(linkHref, 150, 400);
});

const tutoLink = document.getElementById('tutoLink');
tutoLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    const linkHref = tutoLink.getAttribute('href');
    handleRedirect(linkHref, 150, 400);
});

const settingsLink = document.getElementById('settingsLink');
settingsLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    const linkHref = settingsLink.getAttribute('href');
    handleRedirect(linkHref, 150, 400);
});

const ctx = document.getElementById('chart');
const lineChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
        datasets: [{
            label: "",
            data: [],
            fill: false,
            borderWidth: 2.5
        }]
    },
    options: {
        scales: {
            y: {
                beginAtZero: true,
                stacked: false
            }
        },
        elements: {
            point: {
                radius: 2
            }
        }
    }
});