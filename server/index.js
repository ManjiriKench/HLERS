const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet());
app.use(cors());
app.use(express.json({limit: '10kb'}));

mongoose.connect(process.env.MONGODB_URI).then(() => {
    console.log('MongoDB connected successfully');
})
.catch((error) => {
    console.log('MongoDB connection error:', error.message);
    process.exit(1);
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'HLERS server is running'});
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});