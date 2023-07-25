const taskForm = document.querySelector("#form");
const taskUserName = document.querySelector("#userName");
const taskEmail = document.querySelector("#email");
const taskPassword = document.querySelector("#password");
const taskRePassword = document.querySelector("#rePassword");
const {ipcRenderer} = require('electron');


taskForm.addEventListener('submit', e => {
    e.preventDefault();
    if(taskPassword.value != taskRePassword.value){
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
    const message = `<p style="background-color: red; padding: 5px"> ${email_exist} </p>`
    document.getElementById('email-error').innerHTML = message;
    document.getElementById('userName-error').innerHTML = "";
    document.getElementById('password-repeat-error').innerHTML = "";
});

ipcRenderer.on("userName-exist", (e, args) => {
    const userName_exist = JSON.parse(args);
    const message = `<p style="background-color: red; padding: 5px"> ${userName_exist} </p>`
    document.getElementById('userName-error').innerHTML = message;
    document.getElementById('email-error').innerHTML = "";
    document.getElementById('password-repeat-error').innerHTML = "";
});

ipcRenderer.on("new-user-created", (e, args) => {
    const np = JSON.parse(args);
    console.log(np);
    window.location.href = "../log_in_page/log_in.html";
});

const cancelBtn = document.getElementById("cancelbtnID");
cancelBtn.addEventListener('click', () => {
    window.location.href = "../log_in_page/log_in.html";
});