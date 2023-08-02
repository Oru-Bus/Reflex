/* By Oru-Bus - orubus.twitch@gmail.com */

const {ipcRenderer} = require('electron');
const taskForm = document.querySelector("#form");
const taskUserName = document.querySelector("#userName");
const taskPassword = document.querySelector("#password");
const bcrypt = require("bcryptjs");
const fs = require('fs');
let isLoading = false;


function showLoadingPage() {
    isLoading = true;

    const loadingPage = document.createElement('iframe');
    loadingPage.src = "../loading_page/loading.html";
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
            const loadingPage = document.querySelector('iframe[src="../loading_page/loading.html"]');
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

taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    showLoadingPage();
  
    const user = {
        userName: taskUserName.value,
        password: taskPassword.value,
    };
  
    ipcRenderer.send("log-in", user);
});

ipcRenderer.on("get-user", (e, args) => {
    const user = JSON.parse(args);
    bcrypt.compare(taskPassword.value, user.password, function(err, result) {
        if (err) {
            console.log(err);
        } else {
            console.log(result);
            if (result) {
                fs.writeFile('./active_account/account/user_informations.json', JSON.stringify(user, null, 2), err => {
                    if (err) {
                        console.log(err);
                    };
                });
                handleRedirect('../active_account/home_page/home.html', 2500, 3500);
            } else {
                hideLoadingPage(800, 1200, false);
                const message = `<p style="background-color: red; padding: 5px"> Le mot de passe ne correspond pas. </p>`;
                document.getElementById('userName-error').innerHTML = "";
                document.getElementById('password-error').innerHTML = message;
            };
        };
    });
});

ipcRenderer.on("user-no-exist", (e, args) => {
    const message = JSON.parse(args);
    hideLoadingPage(800, 1200, false);
    document.getElementById('password-error').innerHTML = "";
    document.getElementById('userName-error').innerHTML = message;
});

const signupLink = document.getElementById('signupLink');
signupLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    const linkHref = signupLink.getAttribute('href');
    handleRedirect(linkHref, 150, 400);
});