const express = require("express");
const cors = require("cors");
const app  = express();
require('dotenv').config();
const compressorRoute = require('./Routes/api.js');
const webRouter = require('./Routes/web.js');
app.use(express.static(path.join(__dirname, 'frontend')));
app.use('/', compressorRoute);
app.use('/', webRouter);
app.use(express.static('frontend'));
app.use(cors());

// const httpServer = server.createServer(app);

app.get('/health', (req, res) => {
    res.send('Server is running...');
});

app.listen(3031, () => {
    console.log(`Server started on port 3031`);
});
