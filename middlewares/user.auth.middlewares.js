const jwt = require("jsonwebtoken")
const { JWT_KEY } = process.env;

function userAuthMiddleware(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        let token = bearerToken.split(" ")[1];
        const payload = jwt.verify(token, JWT_KEY);
        req.session = {
            user: payload
        }
        next();
    }
    catch (error) {
        console.log(error);
        res.status(401);
        return res.json({ error: "Invalid Token" })
    }
}

function adminAuthMiddleware(req, res, next) {
    try {
        const bearerToken = req.headers.authorization;
        let token = bearerToken.split(" ")[1];
        const payload = jwt.verify(token, JWT_KEY);
        req.session = {
            user: payload
        }

        if (payload.userTypeId === 1) { //Admin
            return next();
        }

        res.status(401);
        return res.json({ error: "You are not authorized to access resourse!!" })

    }
    catch (error) {
        console.log(error);
        res.status(401);
        return res.json({ error: "Invalid Token" })
    }
}
module.exports = { userAuthMiddleware, adminAuthMiddleware }