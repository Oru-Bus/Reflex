/* By Oru-Bus - orubus.twitch@gmail.com */

const userInfos = require('../account/user_informations.json');
const {MongoClient} = require("mongodb");
const {Chart, Legend, Title} = require('chart.js/auto');
var dbUrl = 'mongodb+srv://Orubus:MfoVIG3zuGOriLjN@reflex.zly0zm0.mongodb.net/?retryWrites=true&w=majority';

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

function updateChartWithData(data, label, fileName) {
    lineChart.data.datasets[0].data = data;
    lineChart.data.labels = label;
    if (fileName != ""){
        lineChart.data.datasets[0].label = fileName;
    };
    lineChart.update();
};

const chronoElement = document.getElementById('chrono');
let startTime;
let timeIntervals = [];
var docName = "";
var doc = "";
var nbrBuzzList = [];
var reflexTimeList = [];
function displayChrono() {
    const elapsedTime = Date.now() - startTime;
    const seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;
    if (seconds >= 60) {
        stopChrono();
    } else {
        const formattedTime = `${seconds.toString().padStart(2, '0')} : ${milliseconds.toString().padStart(3, '0')}`;
        chronoElement.textContent = formattedTime;
    }
};

function stopChrono() {
    clearInterval(timeIntervals);
    chronoElement.textContent = "60 : 000";
    docName = "";
    doc = "";
};

const startBtn = document.getElementById("startArduino");
startBtn.addEventListener('click', () => {
    startTime = Date.now();
    timeIntervals = setInterval(displayChrono, 1);
    lastClickTime = Date.now();
    nbrBuzzList = [];
    reflexTimeList = [];

    var now = new Date();
    var year   = now.getFullYear();
    var month    = ('0'+(now.getMonth()+1)).slice(-2);
    var day    = ('0'+now.getDate()   ).slice(-2);
    var hour   = ('0'+now.getHours()  ).slice(-2);
    var minute  = ('0'+now.getMinutes()).slice(-2);
    docName = (year+"_"+month+"_"+day+"_"+hour+"_"+minute);
    timeIntervals.length = 0;

    const client = new MongoClient(dbUrl);
    async function run() {
        try {
            const database = client.db("Reflex");
            const collection = database.collection(userInfos.userName);

            const doc = {
                documentName: docName,
                numberOfBuzz: 0,
                time: [],
            };
            await collection.insertOne(doc);
            console.log("Doc insert");
        } finally {
            await client.close();
        };
    };
    run().catch(console.dir);

    const predefinedLabel = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20];
    const predefinedData = [];
    const dataFileName = docName;
    updateChartWithData(predefinedData, predefinedLabel, dataFileName);
});

let lastClickTime = Date.now();
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const remainingMilliseconds = milliseconds % 1000;
    return `${seconds}.${remainingMilliseconds.toString().padStart(3, '0')}`;
};

const addData = document.getElementById('addData');
addData.addEventListener('click', (e) => {
    e.preventDefault();
    const currentTime = Date.now();
    const elapsedTime = currentTime - lastClickTime;
    lastClickTime = currentTime;
    const client = new MongoClient(dbUrl);
    async function run() {
        try {
            const database = client.db("Reflex");
            const collection = database.collection(userInfos.userName);
            await collection.updateOne(
                {documentName : docName},
                { $inc: { numberOfBuzz: 1 },
                $push: { reflexTime: formatTime(elapsedTime) } }
            );
            doc = await collection.findOne(
                {documentName: docName}
            );
            if (doc.numberOfBuzz > 1) {
                for (let buzz = doc.numberOfBuzz; buzz < doc.numberOfBuzz+1; buzz++) {
                    nbrBuzzList.push(buzz);
                    reflexTimeList.push(doc.reflexTime[buzz-1]);
                };
            } else {
                for (let buzz = 1; buzz < doc.numberOfBuzz+1; buzz++) {
                    nbrBuzzList.push(buzz);
                    reflexTimeList.push(doc.reflexTime[buzz-1]);
                };
            };
        } finally {
            await client.close();
        };
    };
    run().catch(console.dir);

    const predefinedLabel = nbrBuzzList;
    const predefinedData = reflexTimeList;
    updateChartWithData(predefinedData, predefinedLabel, "");
});

const stopBtn = document.getElementById("stopArduino");
stopBtn.addEventListener('click', () => {
    stopChrono();
});