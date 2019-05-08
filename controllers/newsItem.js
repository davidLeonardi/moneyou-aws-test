

module.exports = (options) => {
    const {generateError, generateResponse} = require('../util/responses')(options);
    const {putNewsItem, getNewsItem} = require('../services/newsItem')(options);

    /**
     * Creates a new News Item which will be persisted.
     *
     * @param {object} event The data coming from the API
     * @return {Response} The HTTP response object. Will return the News Item ID via HTTP if successful.
     */
    async function createNewsItem(event) {
        try {
            const data = await putNewsItem(event);
            return generateResponse(200, data);
        } catch (err) {
            return generateError(500, err);
        }
    }

    /**
     * Retrieves a new News Item by its ID
     *
     * @param {object} event The data coming from the API
     * @return {Response} The HTTP response object. Will return the News Item content via HTTP if successful.
     */
    async function retrieveNewsItem(event) {
        try {
            const data = await getNewsItem(event);
            return generateResponse(200, data);
        } catch (err) {
            return generateError(500, err);
        }
    }

    return {
        createNewsItem,
        retrieveNewsItem,
    };
};
