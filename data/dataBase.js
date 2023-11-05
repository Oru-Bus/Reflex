/* By Oru-Bus - orubus.twitch@gmail.com */

const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Orubus:BwtRdt1D8TQ7MZnk@reflex.zly0zm0.mongodb.net/Reflex?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.log(err))