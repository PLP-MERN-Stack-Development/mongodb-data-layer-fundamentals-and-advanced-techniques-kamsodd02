const mongoose = require('mongoose');
const uri = 'mongodb://localhost:27017/plp_bookstore';

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));
const { MongoClient } = require('mongodb');

// MongoDB connection URI and database/collection names
const mongoClientUri = 'mongodb://localhost:27017';
const dbName = 'plp_bookstore';
const collectionName = 'books';