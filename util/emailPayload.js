module.exports = (options) => {
    const {senderEmail, senderDomain} = options;

    /**
     * Generate a payload to send to AWS SES.
     *
     * @param {string} email The email address of the subscriber
     * @param {string} name The name of the subscriber
     * @param {string} content The actual message being sent
     * @return {object} An object containing a payload ready for AWS SES
     */
    function generateEmailParams({email, name, content}) {
        console.log(content);
        return {
            Source: senderEmail,
            Destination: {ToAddresses: [email]},
            ReplyToAddresses: [senderEmail],
            Message: {
                Body: {
                    Text: {
                        Charset: 'UTF-8',
                        Data: `Message for ${name} sent to email ${email} \nContent: ${content}`,
                    },
                },
                Subject: {
                    Charset: 'UTF-8',
                    Data: `You received a message from ${senderDomain}!`,
                },
            },
        };
    }

    return {
        generateEmailParams,
    };
};
