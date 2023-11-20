const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/urlshortener', { useNewUrlParser: true, useUnifiedTopology: true, serverSelectionTimeoutMS: 30000 });

const urlSchema = new mongoose.Schema({
  originalUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: null },
});

// Creating an index on the shortUrl field for optimization
urlSchema.index({ shortUrl: 1 }, { unique: true });

module.exports = mongoose.model('Url', urlSchema);
