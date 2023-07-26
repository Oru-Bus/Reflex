/* By Oru-Bus - orubus.twitch@gmail.com */

const disconnectBtn = document.getElementById("disconnect");
const changeUserNameBtn = document.getElementById("changeUserName");
const changePassword = document.getElementById("changePassword");
const fs = require('fs');


disconnectBtn.addEventListener('click', () => {
    fs.unlink('./active_account/account/user_informations.json', err => {
        if (err) {
            console.log(err);
        };
    });
    window.location.href = '../../log_in_page/login.html';
});

changeUserNameBtn.addEventListener('click', () => {
    window.location.href = '../change_userName_page/change_userName.html';
});

changePassword.addEventListener('click', () => {
    window.location.href = '../change_password_page/change_password.html';
});