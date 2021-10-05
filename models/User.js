const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');

const UserSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'Хэрэглэгчийн нэрийг оруулна уу'],
    },
    email: {
        type: String,
        required: [true, "Хэрэглэгчийн цахим хаягыг оруулах ёстой."],
        unique: true,
        match: [
            /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            "Цахим хаяг буруу байна."
        ]
    },
    role: {
        type: String,
        required: [true, "Хэрэглэгчийн эрхийг оруулах ёстой."],
        enum: ['user', 'operator'],
        default: "user",
    },

    password: {
        type: String,
        minlength: 4,
        required: [true, "Хэрэглэгчийн нууц үгийг оруулах ёстой."],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,

    createdAt: {
        type: Date,
        default: Date.now,
    },
    }, 
);

UserSchema.pre('save', async function (next) {

    // нууц үг өөрчлөгдөөгүй бол дараагийн алхам руу шилжих
    if(!this.isModified("password"))
        next();

    // Нууц үг өөрчдөгдсөн эсвэл шинэ нууц үг бүртгэж байгаа бол
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.getJWT = function () {
    const token = jsonwebtoken.sign (
        { id: this._id, role: this.role },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN, 
    });
    return token;
};

UserSchema.methods.checkPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

UserSchema.methods.generatePassToken = function () {
    const token = jsonwebtoken.sign (
        { id: this._id, role: this.role },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN, 
    });
    return token;
};

UserSchema.methods.generatePasswordChangeToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;

    return resetToken;
};


module.exports = mongoose.model("User", UserSchema);