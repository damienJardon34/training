const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();

app.use(express.json());

mongoose.connect('mongodb+srv://damienjardon:wyn1Srw3vygqDfR2@cluster0.21c5n.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use('/images', express.static(path.join(__dirname, 'images')));

const stuffRoutes = require('./routes/stuff');
app.use('/api/stuff', stuffRoutes);

const userRoutes = require('./routes/user');
app.use('/api/auth', userRoutes);


module.exports = app;