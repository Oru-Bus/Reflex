/* By Oru-Bus - orubus.twitch@gmail.com */

const userInfos = require('../account/user_informations.json');
const {MongoClient} = require("mongodb");
const {Chart, Legend, Title} = require('chart.js/auto');
var dbUrl = 'mongodb+srv://Orubus:BwtRdt1D8TQ7MZnk@reflex.zly0zm0.mongodb.net/?retryWrites=true&w=majority';
const { saveAs } = require('file-saver');
const CryptoJS = require('crypto-js');
const {SerialPort, ReadlineParser} = require('serialport');
const { set } = require('mongoose');


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
let reflexStopped = false;
var elapsedTime = 0;
let seconds = 0;
let isPortOpen = false;
let timeIntervals = [];
var docName = "";
var doc = "";
var nbrBuzzList = [];
var reflexTimeList = [];
let port;

function openSerialPort() {
    port = new SerialPort({ path: 'COM3', baudRate: 115200 }, (err) => {
        if (err) {
            console.error('Erreur lors de l\'ouverture de la connexion série :', err);
        };
    });
};

function closeSerialPort() {
    port.close((err) => {
        if (err) {
            console.error('Erreur lors de la fermeture de la connexion série :', err);
        } else {
            console.log("Port close");
        };
    });
};

function displayChrono() {
    elapsedTime = Date.now() - startTime;
    seconds = Math.floor(elapsedTime / 1000);
    const milliseconds = elapsedTime % 1000;
    if (seconds >= 60) {
        stopChrono();
        console.log("60 secondes écoulées");
    } else {
        const formattedTime = `${seconds.toString().padStart(2, '0')} : ${milliseconds.toString().padStart(3, '0')}`;
        chronoElement.textContent = formattedTime;
        verifDataInPort();
    };
};

function verifDataInPort() {
    if (!isPortOpen) {
        openSerialPort();
        console.log("vérif data");
        port.on('data', (data) => {
            const receivedData = data.toString().trim();
            if (reflexStopped) {
                closeSerialPort();
                setTimeout(function() {
                    stopReflex();
                    isPortOpen = false;
                }, 150);
            } else if (receivedData === 'LED_OFF') {
                console.log('La LED s\'est éteinte.');
                addData();
                closeSerialPort();
                setTimeout(function() {
                    isPortOpen = false;
                }, 150);
            };
        });
        port.on('error', (error) => {
            console.error('Erreur de communication série :', error);
            isPortOpen = false;
        });
        isPortOpen = true;
    };
};

function stopChrono() {
    clearInterval(timeIntervals);
    chronoElement.textContent = "60 : 000"; 
    reflexStopped = true;
    verifDataInPort();
};

function callDisplayChrono() {
    timeIntervals = setInterval(function() {
        displayChrono();
        if (reflexStopped) {
            clearInterval(timeIntervals);
        };
    }, 50);
};

function startReflex() {
    openSerialPort();
    port.write('start', (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture sur le port série :', err);
        } else {
            closeSerialPort();
        }
    });
    reflexStopped = false;
};

function stopReflex() {
    openSerialPort();
    port.write('stop', (err) => {
        if (err) {
            console.error('Erreur lors de l\'écriture sur le port série :', err);
        } else {
            closeSerialPort();
        };
    });
    console.log("Reflex stoppé");
};

const startBtn = document.getElementById("startReflex");
startBtn.addEventListener('click', async () => {
    startReflex();
    setTimeout(function() {
        startTime = Date.now();
        reflexStopped = false;
        callDisplayChrono();
        lastClickTime = Date.now();
        nbrBuzzList = [];
        reflexTimeList = [];
        docName = "";
        doc = "";

        var now = new Date();
        var year   = now.getFullYear();
        var month    = ('0'+(now.getMonth()+1)).slice(-2);
        var day    = ('0'+now.getDate()   ).slice(-2);
        var hour   = ('0'+now.getHours()  ).slice(-2);
        var minute  = ('0'+now.getMinutes()).slice(-2);
        docName = (year+"_"+month+"_"+day+"_"+hour+"_"+minute);


        const client = new MongoClient(dbUrl);
        async function run() {
            try {
                const database = client.db("Reflex");
                const collection = database.collection(userInfos.userName);

                const doc = {
                    documentName: docName,
                    numberOfBuzz: 0,
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
    }, 4000);
});

let lastClickTime = Date.now();
function formatTime(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const remainingMilliseconds = milliseconds % 1000;
    return `${seconds}.${remainingMilliseconds.toString().padStart(3, '0')}`;
};

function addData() {
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
};

const stopBtn = document.getElementById("stopReflex");
stopBtn.addEventListener('click', async () => {
    stopChrono();
});

const exportData = document.getElementById("exportData");
exportData.addEventListener('click', () => {
    if (!doc) {
        alert("Aucune donnée à exporter.");
        return;
    }
    const dataToExport = JSON.stringify(doc);
    const test = new Blob([dataToExport], { type: 'text/plain' });
    saveAs(test, 'avant.txt');
    const secretKey = CryptoJS.enc.Utf8.parse(CryptoJS.lib.WordArray.random(256 / 8));
    const encryptedDatas = CryptoJS.AES.encrypt(dataToExport, secretKey.toString()).toString();
    const blob = new Blob([encryptedDatas], { type: 'text/plain' });
    saveAs(blob, docName+'.txt');
    const client = new MongoClient(dbUrl);
    async function run() {
        try {
            const database = client.db("Reflex");
            const collection = database.collection(userInfos.userName);
            const secretKeyDocument = await collection.findOne(
                {documentName: "secretKeys"}
            );
            if (secretKeyDocument) {
                await collection.updateOne(
                    {documentName: "secretKeys"},
                    {$set: {[docName]: secretKey}}
                )
            } else {
                const keyDoc = {
                    documentName: "secretKeys",
                }
                await collection.insertOne(keyDoc);
                await collection.updateOne(
                    {documentName: "secretKeys"},
                    {$set: {[docName]: secretKey}}
                )
            };
        } finally {
            await client.close();
        };
    };
    run().catch(console.dir);
});