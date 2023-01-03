const express = require('express');
const cors = require('cors');

const controllers = require('./controllers');

const app = express();

app.use(cors());
app.use(express.json());

controllers(app);

// const port = process.env.PORT || 3001;
const PORT = 4000;
app.listen(PORT, ()=>{
    console.log("Server running on port 4000");
});

module.exports = app;