const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const jsonwebtoken = require('jsonwebtoken');
const crypto = require('crypto');

const OrganizationSchema = new mongoose.Schema({
    regNumber:{
        type: String,
        maxlength: 10,
        unique: true,
        required: [true, 'Байгууллагын регистерийн дугаар оруулна уу'],
    },
    role:{
        type: String,
        defalut: "organization",
    },
    name:{
        type: String,
        required: [true, 'Байгууллагын нэрийг оруулна уу'],
    },
    registeredDate:{
        type: Date,
        required: [true, 'Үүсэн байгуулагдсан огноо оруулна уу'],
    },
    type:{
        type: String,
        required: [true, 'Үйл ажиллагаа явуулж буй хэлбэр'],
    },
    isForProfit: {
        type: Boolean,
        required: [true, "Ашгийн байгууллага эсэх"]
    },
    address: {
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: [true, "Утасны дугаар оруулна уу?"]
    },
    mail:{
        type: String,
        required: [true, "Цахим хаяг оруулна уу?"]
    },
    password: {
        type: String,
        minlength: 4,
        required: [true, "Байгууллагын нууц үгийг оруулах ёстой."],
        select: false,
    },
    resetPasswordToken: String,
    resetPasswordExpired: Date,

    createdAt: {
        type: Date,
        default: Date.now,
    },
    }
);

OrganizationSchema.pre('save', async function (next) {
    // нууц үг өөрчлөгдөөгүй бол дараагийн алхам руу шилжих
    if(!this.isModified("password"))
        next();

    // Нууц үг өөрчдөгдсөн эсвэл шинэ нууц үг бүртгэж байгаа бол
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

OrganizationSchema.methods.getOrgJWT = function () {
    const token = jsonwebtoken.sign (
        { id: this._id, regNumber: this.regNumber, role: this.role},
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN,
    });
    return token;
};

OrganizationSchema.methods.checkPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

OrganizationSchema.methods.generatePassToken = function () {
    const token = jsonwebtoken.sign (
        { id: this._id, regNumber: this.regNumber, role: this.role },
        process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRESIN, 
    });
    return token;
};

OrganizationSchema.methods.generatePasswordChangeToken = function () {
    const resetToken = crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken = crypto
        .createHash('sha256')
        .update(resetToken)
        .digest('hex');
    
    this.resetPasswordExpired = Date.now() + 10 * 60 * 1000;

    return resetToken;
};


module.exports = mongoose.model("Organization", OrganizationSchema);