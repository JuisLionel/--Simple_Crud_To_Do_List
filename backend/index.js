const express = require('express');
const app = express();
const cors = require("cors");

app.use(cors());
app.use(express.json());

app.listen(9000, () => {
    console.log("Server has started on port 9000")
})