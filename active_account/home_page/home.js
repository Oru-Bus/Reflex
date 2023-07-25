const userInfos = require('../account/user_informations.json');
const {MongoClient} = require("mongodb");


document.getElementById('hello-user').innerHTML = "Bonjour " + userInfos.userName;

const startBtn = document.getElementById("startArduino");
startBtn.addEventListener('click', () => {
    var now = new Date();
    var year   = now.getFullYear();
    var month    = ('0'+(now.getMonth()+1)).slice(-2);
    var day    = ('0'+now.getDate()   ).slice(-2);
    var hour   = ('0'+now.getHours()  ).slice(-2);
    var minute  = ('0'+now.getMinutes()).slice(-2);
    const docName = (year+"_"+month+"_"+day+"_"+hour+"_"+minute);
    
    const url = 'mongodb+srv://Orubus:MfoVIG3zuGOriLjN@reflex.zly0zm0.mongodb.net/?retryWrites=true&w=majority';

    const client = new MongoClient(url);
    async function run() {
        try {
            const database = client.db("Reflex");
            const collection = database.collection(userInfos.userName);

            const doc = {
                documentName: docName,
            };
            await collection.insertOne(doc);
            console.log("Doc insert");
        } finally {
            await client.close();
        };
    };

    run().catch(console.dir);
});