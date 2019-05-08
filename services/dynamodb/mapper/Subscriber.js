const {
    DynamoDbSchema,
    DynamoDbTable,
} = require('@aws/dynamodb-data-mapper');
const v4 = require('uuid/v4');

/**
 * A Subscriber DynamoDB schema definition
 */
class Subscriber {}

Object.defineProperties(Subscriber.prototype, {
    [DynamoDbTable]: {
        value: 'Subscribers',
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
            },
            email: {
                type: 'String',
                indexKeyConfigurations: {
                    emailIndex: 'HASH',
                },
            },
            name: {
                type: 'String',
            },
            sentMessages: {
                type: 'List',
                memberType: {
                    type: 'Tuple', members: [
                        {type: 'String'},
                        {type: 'Date'},
                    ],
                },
            },
        },
    },
});

module.exports = {Subscriber};
