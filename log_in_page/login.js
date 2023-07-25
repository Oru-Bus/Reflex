const {ipcRenderer} = require('electron');
const taskForm = document.querySelector("#form");
const taskUserName = document.querySelector("#userName");
const taskPassword = document.querySelector("#password");
const bcrypt = require("bcryptjs");
const fs = require('fs');


taskForm.addEventListener("submit", async (e) => {
    e.preventDefault();
  
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
                window.location.href = '../active_account/home_page/home.html'
            } else {
                const message = `<p style="background-color: red; padding: 5px"> Le mot de passe ne correspond pas. </p>`;
                document.getElementById('userName-error').innerHTML = "";
                document.getElementById('password-error').innerHTML = message;
            };
        };
    });
});

ipcRenderer.on("user-no-exist", (e, args) => {
    const message = JSON.parse(args);
    document.getElementById('userName-error').innerHTML = message;
    document.getElementById('password-error').innerHTML = "";
});