/* By Oru-Bus - orubus.twitch@gmail.com */

const taskForm = document.querySelector("#form");
const taskUserName = document.querySelector("#userName");
const taskActualPassword = document.querySelector("#actualPassword");
const taskNewPassword = document.querySelector("#newPassword");
const {ipcRenderer} = require('electron');
const userInfos = require('../account/user_informations.json');
const bcrypt = require("bcryptjs");
const fs = require('fs');


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
cancelBtn.addEventListener('click', () => {
    window.location.href = "../settings_page/settings.html";
});