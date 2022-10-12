const mongoose = require("mongoose")
const uniqueValidator = require("mongoose-unique-validator")
const bcrypt = require("bcryptjs")

const UserSchema = mongoose.Schema({
    first_name: {
        type: String, lowercase: true, required: [true, 'First Name can not be blank'], match: [/^[a-zA-Z\\s]*$/, 'First Name is invalid']
    },
    last_name: {
        type: String, lowercase: true, required: [true, 'Last Name can not be blank'], match: [/^[a-zA-Z\\s]*$/, 'Last Name is invalid']
    },
    email: {
        type: String, lowercase: true, required: [true, 'Email can not be blank'], match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, 'Email is invalid']
    },
    phone: {
        type: String,
        unique: true,
        required: [true, 'Phone Number can not be blank']
    },
    userTypeId: {
        type: Number,
        required: [true, 'User Type Id can not be blank']
    },
    password: {
        type: String,
        required: [true, 'Password can not be blank']
    },
    confirmPassword: {
        type: String
    },
    is_active: {
        type: Boolean, default: true
    }
}, {
    timestamps: true
});


UserSchema.plugin(uniqueValidator, { message: `Error, expected {PATH} to be unique that is {VALUE}` })

UserSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        try {
            this.password = await bcrypt.hash(this.password, 10);
            this.confirmPassword = undefined;
        } catch (error) {
            console.log(error);
        }
    }
    next();
});

UserSchema.statics.isExists = async function isExists(emailId) {
    const user = await this.findOne({ email: emailId });
    return user ? true : false;
}

const User = mongoose.model('user', UserSchema);

module.exports = { User };

