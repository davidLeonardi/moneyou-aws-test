// Entry point for the Lambda handler. The exported functions are mapped in the serverless.yml definition

// We define some global options here.
// We do not want to access process.env from anywhere deeper than the entry point.
// From here on the values are passed.
const options = {
    senderEmail: process.env.SENDEREMAIL,
    senderDomain: process.env.SENDERDOMAIN,
};

// Import our modules and pass the global parameters we defined above
const {sendEmail} = require('./controllers/email')(options);
const {createNewsItem} = require('./controllers/newsItem')(options);
const {retrieveSentNewsItems} = require('./controllers/subscription')(options);

module.exports.sendEmail = sendEmail;
module.exports.createNewsItem = createNewsItem;
module.exports.retrieveSentNewsItems = retrieveSentNewsItems;
