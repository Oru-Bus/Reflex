/* By Oru-Bus - orubus.twitch@gmail.com */

const mongoose = require('mongoose');

mongoose.connect('', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.log(err))
