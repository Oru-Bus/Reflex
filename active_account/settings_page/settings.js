/* By Oru-Bus - orubus.twitch@gmail.com */

const changeInfoButtons = document.querySelectorAll(".changeInfo");
const fs = require('fs');
const changePasswordLink = "../change_password_page/change_password.html";
const changeUserNameLink = "../change_userName_page/change_userName.html";
const {ipcRenderer} = require('electron');
const userInfos = require('../account/user_informations.json');


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

changeInfoButtons.forEach((button) => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        showLoadingPage();
        const infoBtn = button.getAttribute("id");
        let redirectLink;
        console.log(infoBtn);
        if (infoBtn === "changeUserName") {
            redirectLink = changeUserNameLink;
            console.log(redirectLink);
        } else if (infoBtn === "changePassword") {
            redirectLink = changePasswordLink;
            console.log(redirectLink);
        };
        handleRedirect(redirectLink, 150, 400);
    });
});

const disconnectBtn = document.getElementById("disconnect");
disconnectBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    fs.unlink('./active_account/account/user_informations.json', err => {
        if (err) {
            console.log(err);
        };
    });
    handleRedirect('../../log_in_page/login.html', 2500, 3500);
});

const deleteAccountBtn = document.getElementById("deleteAccount");
deleteAccountBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showLoadingPage();
    const user = userInfos.userName;
    ipcRenderer.send('delete-account', user);
    handleRedirect('../../log_in_page/login.html', 2500, 3500);
});

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