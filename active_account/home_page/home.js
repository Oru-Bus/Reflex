/* By Oru-Bus - orubus.twitch@gmail.com */

const userInfos = require('../account/user_informations.json');
const {MongoClient} = require("mongodb");
const {Chart, Legend, Title} = require('chart.js/auto');


document.getElementById('hello-user').innerHTML = "Bonjour " + userInfos.userName;

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
        plugins: {
            legend: {
                display: false
            }
        },
        elements: {
            point: {
                radius: 2
            }
        }
    }
});

function updateChartWithData(data, label) {
    lineChart.data.datasets[0].data = data;
    lineChart.data.labels = label;
    lineChart.update();
};

const startBtn = document.getElementById("startArduino");
startBtn.addEventListener('click', () => {
    var now = new Date();
    var year   = now.getFullYear();
    var month    = ('0'+(now.getMonth()+1)).slice(-2);
    var day    = ('0'+now.getDate()   ).slice(-2);
    var hour   = ('0'+now.getHours()  ).slice(-2);
    var minute  = ('0'+now.getMinutes()).slice(-2);
    const docName = (year+"_"+month+"_"+day+"_"+hour+"_"+minute);
    
    const url = 'mongodb+srv://Orubus:MfoVIG3zuGOriLjN@reflex.zly0zm0.mongodb.net/?retryWrites=true&w=majority';

    const client = new MongoClient(url);
    async function run() {
        try {
            const database = client.db("Reflex");
            const collection = database.collection(userInfos.userName);

            const doc = {
                documentName: docName,
            };
            await collection.insertOne(doc);
            console.log("Doc insert");
        } finally {
            await client.close();
        };
    };

    run().catch(console.dir);

    const predefinedLabel = [1, 2, 3, 4, 5, 6, 7];
    const predefinedData = [0.256, 0.2151, 0.8484, 0.4564, 0.7816, 0.987, 0.254];
    updateChartWithData(predefinedData, predefinedLabel);
});