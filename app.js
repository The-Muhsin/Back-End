// app.js

const express = require('express');
const signUpRoutes = require('./src/routes/signUpRoutes');
const connectDB = require('./db/dbConnection');

const app = express();

app.use(express.json());
app.use('/api', signUpRoutes);

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
