const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://Orubus:MfoVIG3zuGOriLjN@reflex.zly0zm0.mongodb.net/Reflex?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(db => console.log("DB is connected"))
    .catch(err => console.log(err))