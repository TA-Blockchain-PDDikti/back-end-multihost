const PORT = 3000;
const express = require('express');
const cors = require('cors')
const app = express();

const router = require('./routes/index.js');

app.use(express.json())
app.use(cors())
app.use('/', router)

app.get('/tes', (req, res) => res.send('Hello World!'));

app.listen(PORT, () => console.log(`Express app running on port ${PORT}!`));
