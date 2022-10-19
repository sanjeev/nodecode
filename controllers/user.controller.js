const { User } = require('../models/user.model')
var bcrypt = require('bcryptjs');
const Joi = require("joi")
const jwt = require("jsonwebtoken")

function getStandardResponse(status, message, data) {
    return {
        status: status,
        message: message,
        data: data
    }
}
function validateUserForRegistration(user) {
    const schema = Joi.object({
        first_name: Joi.string().min(4).max(20).required(),
        last_name: Joi.string().min(4).max(20).required(),
        email: Joi.string().email().required(),
        phone: Joi.string().min(10).max(12).required(),
        userTypeId: Joi.number().min(1).max(10).required(),
        password: Joi.string().min(6).max(20).required(),
        confirmPassword: Joi.string().min(6).max(20).required()
    });

    const result = schema.validate(user);
    return result;
}

const addUser = async (req, res, next) => {
    const result = validateUserForRegistration(req.body);
    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    }

    const userData = result.value;

    if (userData.password != userData.confirmPassword) {
        res.status(400);
        return next(new Error("Password And Confirm Password not match"));
    }

    let isExists = await User.isExists(userData.email);
    if (!isExists) {
        let user = await new User(userData).save();
        res.json(user);
    } else {
        res.status(400);
        return next(new Error("Email already exists"));
    }
}

function validateLoginCredentials(credential) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).max(20).required(),
    });

    const result = schema.validate(credential);
    return result;
}

const loginUser = async (req, res, next) => {

    const result = validateLoginCredentials(req.body);
    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    }

    const { email, password } = result.value;
    const user = await User.findOne({ email });
    if (user) {
        const isMatch = bcrypt.compareSync(password, user.password);
        if (isMatch) {
            const payload = {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                userTypeId: user.userTypeId
            }

            const token = jwt.sign(payload, process.env.JWT_KEY);
            const data =
            {
                "token": token,
                "first_name": user.first_name,
                "last_name": user.last_name,
                "email": user.email,
                "userTypeId": user.userTypeId,
                "imageUrl": ''
            }

            return res.json(getStandardResponse(true, "Login Success !!", data));
            //return res.json({ message: "Login Success !!", token })
        } else {
            res.status(500);
            return next(new Error("Invalid Credential"));
        }
    } else {
        res.status(500);
        return next(new Error("Invalid Credential"));
    }
}

const updateUser = async (req, res, next) => {
    const loggedInUser = req.session.user;
    console.log("LoggedIn User : ", loggedInUser);

    const schema = Joi.object({
        first_name: Joi.string().min(4).max(20).required(),
        last_name: Joi.string().min(4).max(20).required(),
        phone: Joi.string().min(10).max(12).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        try {
            let user = await User.findById(loggedInUser.id);
            user = Object.assign(user, result.value);
            user = await user.save();
            res.json(user);
        } catch (error) {
            res.status(500);
            return next(new Error(error));
        }
    }
}

//http://localhost:5000/api/users?pagesize=2&page=3&sort=1
const getAllUser = async (req, res, next) => {
    const limit = Number.parseInt(req.query.pagesize) || 5;
    const page = Number.parseInt(req.query.page) || 1;
    const sort_by = req.query.sort;
    const skip = limit * (page - 1);
    const users = await User.find().sort({ first_name: sort_by }).skip(skip).limit(limit);
    let count = await User.countDocuments();
    res.json({ users, count });
}

const updateUserById = async (req, res, next) => {
    const schema = Joi.object({
        first_name: Joi.string().min(4).max(20).required(),
        last_name: Joi.string().min(4).max(20).required(),
        phone: Joi.string().min(10).max(12).required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const userId = req.params.id;
        let user = await User.findById(userId);
        user = Object.assign(user, result.value);
        user = await user.save();
        res.json(user);
    }
}

const deleteUser = async (req, res, next) => {
    const schema = Joi.object({
        is_active: Joi.boolean().required()
    });

    const result = schema.validate(req.body);

    if (result.error) {
        res.status(400);
        return next(new Error(result.error.details[0].message));
    } else {
        const userId = req.params.id;
        let user = await User.findById(userId);
        user = Object.assign(user, result.value);
        user = await user.save();
        res.json(user);
    }
}

module.exports = { addUser, loginUser, updateUser, getAllUser, updateUserById, deleteUser };