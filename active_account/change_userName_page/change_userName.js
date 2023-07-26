/* By Oru-Bus - orubus.twitch@gmail.com */

const taskForm = document.querySelector("#form");
const taskActualUserName = document.querySelector("#actualUserName");
const taskNewUserName = document.querySelector("#newUserName");
const taskPassword = document.querySelector("#password");
const {ipcRenderer} = require('electron');
const userInfos = require('../account/user_informations.json');
const bcrypt = require("bcryptjs");
const fs = require('fs');


taskForm.addEventListener('submit', e => {
    e.preventDefault();
    document.getElementById('actualUserName-error').innerHTML = "";
    document.getElementById('newUserName-error').innerHTML = "";
    document.getElementById('password-error').innerHTML = "";
    if (userInfos.userName == taskActualUserName.value) {
        bcrypt.compare(taskPassword.value, userInfos.password, function(err, result) {
            if (err) {
                console.log(err);
            } else {
                if (result){
                    const user = {
                        actualUserName: taskActualUserName.value,
                        newUserName: taskNewUserName.value,
                    };
                    ipcRenderer.send('change-userName', user);
                } else {
                    const message = `<p style="background-color: red; padding: 5px"> Le mot de passe ne correspond pas. </p>`;
                    document.getElementById('password-error').innerHTML = message;
                };
            };
        });
    } else {
        const message = `<p style="background-color: red; padding: 5px"> Cet identifiant ne correspond pas au compte actuel. </p>`;
        document.getElementById('actualUserName-error').innerHTML = message;
    };
});

ipcRenderer.on("userName-exist", (e, args) => {
    const userName_exist = JSON.parse(args);
    const message = `<p style="background-color: red; padding: 5px"> ${userName_exist} </p>`
    document.getElementById('newUserName-error').innerHTML = message;
});

ipcRenderer.on("userName-changed", (e, args) => {
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
cancelBtn.addEventListener('click', () => {
    window.location.href = "../settings_page/settings.html";
});