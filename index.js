require('dotenv').config();

const port = process.env.PORT || 5000;
const { application } = require("./server");

application.listen(port, () => {
    console.log(`listing on port ${port}`);
});
