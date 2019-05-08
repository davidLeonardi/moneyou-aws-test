const {NewsItem} = require('./dynamodb/mapper/NewsItem');
const {DataMapper} = require('@aws/dynamodb-data-mapper');
const DynamoDB = require('aws-sdk/clients/dynamodb');

const client = new DynamoDB({region: 'us-east-1'});
const mapper = new DataMapper({client});

module.exports = (options) => {
    /**
     * Generates object describing an HTTP Success response
     *
     * @param {event} event The data from the API
     * @return {Response} The HTTP response object
     */
    async function putNewsItem(event) {
        const {content} = JSON.parse(event.body);
        const newsItem = new NewsItem();
        newsItem.createdAt = new Date();
        newsItem.content = content;
        return mapper.put({item: newsItem}).then((data) => {
            return {id: data.id};
        });
    }

    /**
     * Retrieves a News Item from DynamoDB
     *
     * @param {string} newsItemId The ID of the newsitem
     * @return {Promise} A promise which resolves with the value of the newsItem requested
     */
    async function getNewsItem(newsItemId) {
        return mapper.get(Object.assign(new NewsItem(), {id: newsItemId})).then((data) => {
            return data;
        });
    }

    return {
        putNewsItem,
        getNewsItem,
    };
}
;
