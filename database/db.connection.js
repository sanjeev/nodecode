const mongoose = require('mongoose')
const { DB_URL } = process.env;

const createConnection = async () => {
    try {
        const connection = await mongoose.connect(DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        if (connection) {
            console.log("Connection Successfully !!");
        }
    } catch (error) {
        console.log("Error : " + error);
        process.exit();
    }
};


module.exports = createConnection;