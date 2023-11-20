// controllers/urlController.js
const shortid = require('shortid');
const urlModel = require('../models/url');

// Helper function to validate URLs
function isValidUrl(str) {
  // Implement your URL validation logic here
  return true;
}

// Controller for URL shortening
async function shortenUrl(req, res) {
  const { url, alias, expiresAt } = req.body;

  // Validate URL
  if (!isValidUrl(url)) {
    return res.status(400).json({ error: 'Invalid URL' });
  }

  // Check if alias is available
  try {
    const existingUrl = await urlModel.findOne({ shortUrl: alias }).maxTimeMS(30000);
    if (existingUrl) {
      return res.status(400).json({ error: 'Alias is already taken' });
    }

    // Generate short URL
    const shortUrl = alias || shortid.generate();

    // Save to MongoDB
    const newUrl = new urlModel({
      originalUrl: url,
      shortUrl,
      expiresAt: expiresAt ? new Date(expiresAt) : null,
    });

    await newUrl.save();

    // Construct the complete redirect URL
    const redirectUrl = `${req.protocol}://${req.get('host')}/${shortUrl}`;

    // Return both original and shortened URLs
    res.json({
      originalUrl: url,
      shortUrl,
      redirectUrl,
    });
  } catch (error) {
    // Handle the timeout error
    if (error.name === 'MongooseError' && error.message.includes('buffering timed out')) {
      return res.status(500).json({ error: 'Database operation timed out' });
    }

    // Handle other errors
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Controller for URL redirection
async function redirectUrl(req, res) {
    const { shortUrl } = req.params;
  
    // Find the original URL in the database
    const url = await urlModel.findOne({ shortUrl });
  
    if (!url || (url.expiresAt && url.expiresAt < new Date())) {
      return res.status(404).json({ error: 'URL not found' });
    }
  
    // Log redirection
    console.log(`Redirected ${shortUrl} to ${url.originalUrl}`);
  
    // Redirect to the original URL
    res.redirect(url.originalUrl);
  }
  

  

module.exports = {
  shortenUrl,
  redirectUrl,
};
