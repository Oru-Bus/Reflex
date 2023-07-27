/* By Oru-Bus - orubus.twitch@gmail.com */

const taskForm = document.querySelector("#form");
const taskUserName = document.querySelector("#userName");
const taskEmail = document.querySelector("#email");
const taskPassword = document.querySelector("#password");
const taskRePassword = document.querySelector("#rePassword");
const {ipcRenderer} = require('electron');
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

taskForm.addEventListener('submit', e => {
    e.preventDefault();
    showLoadingPage();
    if(taskPassword.value != taskRePassword.value){
        hideLoadingPage(800, 1200, false);
        const message = `<p style="background-color: red; padding: 5px"> La répétition du mot de passe n'est pas bonne. </p>`
        document.getElementById('password-repeat-error').innerHTML = message;
        document.getElementById('email-error').innerHTML = "";
        document.getElementById('userName-error').innerHTML = "";
    }
    else {
        const users = {
            userName: taskUserName.value,
            email: taskEmail.value,
            password: taskPassword.value,
        };
        ipcRenderer.send('new-users', users);
    };
});

ipcRenderer.on("email-exist", (e, args) => {
    const email_exist = JSON.parse(args);
    hideLoadingPage(800, 1200, false);
    const message = `<p style="background-color: red; padding: 5px"> ${email_exist} </p>`
    document.getElementById('email-error').innerHTML = message;
    document.getElementById('userName-error').innerHTML = "";
    document.getElementById('password-repeat-error').innerHTML = "";
});

ipcRenderer.on("userName-exist", (e, args) => {
    const userName_exist = JSON.parse(args);
    hideLoadingPage(800, 1200, false);
    const message = `<p style="background-color: red; padding: 5px"> ${userName_exist} </p>`
    document.getElementById('userName-error').innerHTML = message;
    document.getElementById('email-error').innerHTML = "";
    document.getElementById('password-repeat-error').innerHTML = "";
});

ipcRenderer.on("new-user-created", (e, args) => {
    const np = JSON.parse(args);
    console.log(np);
    handleRedirect('../log_in_page/login.html', 2500, 3500);
});

const cancelBtn = document.getElementById("cancelbtnID");
cancelBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    handleRedirect('../log_in_page/login.html', 150, 400);
});

const loginLink = document.getElementById('loginLink');
loginLink.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    const linkHref = loginLink.getAttribute('href');
    handleRedirect(linkHref, 150, 400);
});