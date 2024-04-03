/* By Oru-Bus - orubus.twitch@gmail.com */

const { app, dialog, BrowserWindow, ipcMain} = require('electron');
const path = require('path');
require('./data/dataBase');
const Users = require('./data/users');
const bcrypt = require("bcryptjs");
const {MongoClient} = require("mongodb");


function createWindow() {
    const win = new BrowserWindow({
        autoHideMenuBar: false,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false,
        },
    });
  
    // win.setMenuBarVisibility(false);
  
    win.loadFile('log_in_page/login.html');
  
    win.on('close', function(e) {
        const choice = dialog.showMessageBoxSync(this, {
            type: 'question',
            buttons: ['Oui', 'Non'],
            title: 'Reflex',
            message: "Êtes-vous sûr de vouloir fermer l'application ?",
        });
        if (choice === 1) {
            e.preventDefault();
        };
    });
};

app.whenReady().then(() => {
    createWindow();
  
    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        };
    });
});

ipcMain.on('new-users', async (e, args) => {
    const userName_exist = await Users.findOne(
        {userName: args.userName}
    );
    const userEmail_exist = await Users.findOne(
        {email: args.email}
    );

    if (userEmail_exist) {
        const email_exist = "Cet email n'est pas disponible.";
        e.reply("email-exist", JSON.stringify(email_exist));
    } else if (userName_exist) {
        const user_exist = "Cet identifiant n'est pas disponible.";
        e.reply("userName-exist", JSON.stringify(user_exist));
    } else {
        const newUser = new Users(args);
        const userSaved = await newUser.save();
        const url = '';
        const databasename = 'Reflex';
        MongoClient.connect(url).then((client) => {
            const connect = client.db(databasename);
            const collection = connect.createCollection(args.userName);
        }).catch((err) => {
            console.log(err.Message);
        });
        e.reply("new-user-created", JSON.stringify(userSaved));
    };
});

ipcMain.on("log-in", async (e, args) => {
    const userInfo = await Users.findOne(
        {userName: args.userName}
    );
    if(userInfo){
        e.reply("get-user", JSON.stringify(userInfo));
    } else {
        const message = `<p style="background-color: red; padding: 5px"> Cet identifiant ne correspond à aucun compte. </p>`;
        e.reply("user-no-exist", JSON.stringify(message));
    };
});



ipcMain.on('change-userName', async (e, args) => {
    const userName_exist = await Users.findOne(
        {userName: args.newUserName}
    );

    if (userName_exist) {
        const userNameExist = "Cet identifiant n'est pas disponible.";
        e.reply("userName-exist", JSON.stringify(userNameExist));
    } else {
        await Users.updateOne(
            {userName: args.actualUserName},
            {$set : {userName : args.newUserName}}
        );
        const message = "Le nouvel identifiant a bien été enregistré.";
        e.reply("userName-changed", JSON.stringify(message));
    }
});

ipcMain.on('change-password', async (e, args) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(args.newPassword, salt);
    args.newPassword = hashedPassword;

    await Users.updateOne(
        {userName: args.userName},
        {$set : {password : args.newPassword}}
    );
    const message = "Le nouveau mot de passe a bien été enregistré.";
    e.reply("password-changed", JSON.stringify(message));
});

ipcMain.on('delete-account', async (e, args) => {
    const user = args;
    await Users.deleteOne(
        {userName: user}
    );
    const url = '';
    const databasename = 'Reflex';
    MongoClient.connect(url).then(async (client) => {
        const connect = client.db(databasename);
        await connect.collection(user).drop();
    }).catch((err) => {
        console.log(err);
    });
});

ipcMain.on('verif-nbr-doc-in-collection', async (e, args) => {
    const user = args;
    const url = '';
    const databasename = 'Reflex';
    var over30 = false;
    MongoClient.connect(url).then(async (client) => {
        const connect = client.db(databasename).collection(user);
        const nbrOfDocuments = await connect.countDocuments({});
        if (nbrOfDocuments >= 30) {
            over30 = true;
            await connect.deleteOne();
            e.reply("document-can-be-created", JSON.stringify(over30));
        } else {
            e.reply("document-can-be-created", JSON.stringify(over30));
        };
    }).catch((err) => {
        console.log(err);
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

ipcMain.on("choose-encrypted-file", async (e, args) => {
    dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [{ extensions: [args] }]
    }).then(result => {
        if (!result.canceled) {
            const filePath = result.filePaths[0];
            e.reply("encrypted-file-path", JSON.stringify(filePath));
        };
    }).catch(err => {
        console.error('Erreur lors de la sélection du fichier :', err);
    });
});
