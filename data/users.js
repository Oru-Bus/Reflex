const {model, Schema} = require('mongoose');
const bcrypt = require('bcryptjs')
const collectionName = "users";

const newUserSchema = new Schema({
    userName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
},
{
    collection: collectionName,
});

newUserSchema.pre('save', async function (next) {
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(this.password, salt);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    };
});

module.exports = model(' ', newUserSchema);