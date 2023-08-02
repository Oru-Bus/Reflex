/* By Oru-Bus - orubus.twitch@gmail.com */

const taskForm = document.querySelector("#form");
const taskUserName = document.querySelector("#userName");
const taskActualPassword = document.querySelector("#actualPassword");
const taskNewPassword = document.querySelector("#newPassword");
const {ipcRenderer} = require('electron');
const userInfos = require('../account/user_informations.json');
const bcrypt = require("bcryptjs");
const fs = require('fs');

function showLoadingPage() {
    isLoading = true;

    const loadingPage = document.createElement('iframe');
    loadingPage.src = " ../../loading_page/loading.html";
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

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('password-error').innerHTML = "";
    document.getElementById('userName-error').innerHTML = "";
    if (userInfos.userName == taskUserName.value) {
        bcrypt.compare(taskActualPassword.value, userInfos.password, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result){
                    const user = {
                        userName: taskUserName.value,
                        newPassword: taskNewPassword.value
                    };
                    ipcRenderer.send('change-password', user);
                } else {
                    const message = `<p style="background-color: red; padding: 5px"> Le mot de passe ne correspond pas. </p>`;
                    document.getElementById('password-error').innerHTML = message;
                };
            };
        });
    } else {
        const message = `<p style="background-color: red; padding: 5px"> Cet identifiant ne correspond à aucun compte. </p>`;
        document.getElementById('userName-error').innerHTML = message;
    };
});

ipcRenderer.on("password-changed", (e, args) => {
    const message = JSON.parse(args);
    console.log(message);
    fs.unlink('./active_account/account/user_informations.json', err => {
        if (err) {
            console.log(err);
        };
    });
    window.location.href = "../../log_in_page/login.html";
});

const cancelBtn = document.getElementById("cancelbtnID");
cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    handleRedirect('../settings_page/settings.html', 150, 400);
});