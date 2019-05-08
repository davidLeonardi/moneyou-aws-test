
const {
    DynamoDbSchema,
    DynamoDbTable,
} = require('@aws/dynamodb-data-mapper');
const v4 = require('uuid/v4');

/**
 * A NewsItem DynamoDB schema definition
 */
class NewsItem {}

Object.defineProperties(NewsItem.prototype, {
    [DynamoDbTable]: {
        value: 'NewsItems',
    },
    [DynamoDbSchema]: {
        value: {
            id: {
                type: 'String',
                keyType: 'HASH',
                defaultProvider: v4,
            },
            createdAt: {
                type: 'Date',
                keyType: 'RANGE',
            },
            content: {type: 'String'},
        },
    },
});

module.exports = {NewsItem};
