// Main controller used to send email.
// Email is sent using AWS SES, and there is one domain set up and validated to send email from.
// That is set up in the console, and currently is mediavitamin.com, which I own.
// Adding SMS sending capability would involve integrating AWS SNS, and the implementation is similar.
// As sending SMS to a dutch number is not free, I'm not including this in the current implementation.

const aws = require('aws-sdk');
const ses = new aws.SES();

module.exports = (options) => {
    const {generateError, generateResponse} = require('../util/responses')(options);
    const {generateEmailParams} = require('../util/emailPayload')(options);
    const {createUniqueSubscriber, registerNewsItem, checkIfNewsItemHasBeenSentAlready} = require('../services/subscriber')(options);
    const {getNewsItem} = require('../services/newsItem')(options);

    /**
     * Send a message to someone.
     *
     * @param {object} event The data coming from the API
     * @return {Response} The HTTP response object.
     */
    async function sendEmail(event) {
        const {newsItemId, email, name} = JSON.parse(event.body);
        if (!newsItemId || !email || !name) {
            return generateError(500, new Error('invalid payload passed to sendEmail. Requires newsItemId, email, name'));
        }

        // Check if the specified email has already been sent
        return checkIfNewsItemHasBeenSentAlready({email, newsItemId})
            .then((hasBeenSent) => {
                if (hasBeenSent) {
                    throw new Error('This email has already been sent to this subscriber');
                }
                return Promise.resolve();
            })
            .then(() => {
                // Create a subscriber
                return createUniqueSubscriber({email, name});
            })
            .then(() => {
                return createUniqueSubscriber({email, name});
            })
            .then(() => {
                // Retrieve the content of the news item from storage
                return getNewsItem(newsItemId);
            })
            .then(({content}) => {
                // Prepare the payload for SES
                const emailParams = generateEmailParams({email, name, content});
                // And finally send the email
                return ses.sendEmail(emailParams).promise();
            })
            .then(() => {
                // Add this email to the list of sent newsitems in a subscriber entry
                return registerNewsItem({email: email, newsItemId: newsItemId});
            })
            .then((registerNewsItemResponse) => {
                // All went well! Return 200 success via HTTP
                return generateResponse(200, registerNewsItemResponse);
            })
            .catch((err) => {
                // Something broke! Return 500 failure via HTTP along with an error
                return generateError(500, err);
            });
    }

    return {
        sendEmail,
    };
};
