module.exports = (options) => {
    const {generateError, generateResponse} = require('../util/responses')(options);
    const {getNewsItemsPerSubscriber} = require('../services/subscriber')(options);
    const {getNewsItem} = require('../services/newsItem')(options);

    /**
     * Retrieve which news items have been sent to a given email
     *
     * @param {object} event The data coming from the API
     * @return {Response} The HTTP response object.
     */
    async function retrieveSentNewsItems(event) {
        const {email} = JSON.parse(event.body);

        try {
            const sentMessagesDetail = [];
            // Retrieve which news items an email has received. This returns ID's
            const newsItemList = await getNewsItemsPerSubscriber({email});

            // Obtain a promise list so we can wait for all the news items to be retrieved
            const newsItemPromiseList = newsItemList.map(async (newsItem) => {
                // Actually retrieve a newsItem
                const newsItemDetail = await getNewsItem(newsItem[0]);
                // And add it to the list the requester will receive
                sentMessagesDetail.push({content: newsItemDetail.content, date: newsItem[1], id: newsItem[0]});
            });

            await Promise.all(newsItemPromiseList);

            return generateResponse(200, sentMessagesDetail);
        } catch (err) {
            return generateError(500, err);
        }
    }

    return {
        retrieveSentNewsItems,
    };
};


