const {Subscriber} = require('./dynamodb/mapper/Subscriber');
const {DataMapper} = require('@aws/dynamodb-data-mapper');
const DynamoDB = require('aws-sdk/clients/dynamodb');


const client = new DynamoDB({region: 'us-east-1'});
const mapper = new DataMapper({client});

module.exports = (options) => {
    /**
     * Create a subscriber in DynamoDb
     *
     * @param {string} name The name of the subscriber
     * @param {string} email The email address of the subscriber
     * @return {Promise} A promise which resolves with the value of the newsItem requested
     */
    async function putSubscriber({name, email}) {
        const subscriber = Object.assign(new Subscriber(), {
            createdAt: new Date().toISOString(),
            name: name,
            email: email,
        });
        return mapper.put({item: subscriber}).then((data) => {
            return {id: data.id};
        });
    }

    /**
     * Generate a query object for the DynamoDb Data Mapper to retrieve a subscriber by email.
     *
     * @param {string} email The email address of the subscriber
     * @return {object} A query object for the datamapper
     */
    function generateDataMapperEmailQuery(email) {
        const query = {
            indexName: 'EmailIndex',
            valueConstructor: Subscriber,
            keyCondition: {
                email: email,
            },
        };
        return query;
    }

    /**
     * Retrieve a subscriber by Email
     *
     * @param {string} email The email address of the subscriber
     * @return {object} An object containing the subscriber profile data
     */
    async function getSubscriber({email}) {
        let subscriber = null;
        for await (const entry of mapper.query(generateDataMapperEmailQuery(email))) {
            subscriber = entry;
        }

        if (subscriber) {
            return subscriber;
        } else {
            console.log('didnt find subscriber');
            // Todo: improve handling of this. No return value is fishy.
        }
    }

    /**
     * Create a subscriber by Email and name. Every subscriber is unique and mapped by email, thus can only be created once.
     *
     * @param {string} name The name of the subscriber
     * @param {string} email The email address of the subscriber
     * @return {object} An object containing the subscriber profile data
     */
    async function createUniqueSubscriber({name, email}) {
        const existingSubscriber = await getSubscriber({email});
        if (existingSubscriber) {
            return existingSubscriber;
        }
        return putSubscriber({name, email});
    }

    /**
     * Link a NewsItem and a subscriber together. After we sent an email, store the key of the newsitem to the subscriber's list of messages
     *
     * @param {string} email The email address of the subscriber
     * @param {string} newsItemId The id of the newsItem
     * @return {object} An object containing the subscriber profile id
     */
    async function registerNewsItem({email, newsItemId}) {
        const existingSubscriber = await getSubscriber({email});
        if (existingSubscriber) {
            existingSubscriber.sentMessages = existingSubscriber.sentMessages || [];
            existingSubscriber.sentMessages.push([newsItemId, new Date().toISOString()]);
            return mapper.update(existingSubscriber).then((data) => {
                return {id: data.id};
            });
        }
    }


    /**
     * Retrieve all newsItems that got sent to a subscriber
     *
     * @param {string} email The email address of the subscriber
     * @return {object} An array containing the newsItems that got sent
     */
    async function getNewsItemsPerSubscriber({email}) {
        const existingSubscriber = await getSubscriber({email});
        if (existingSubscriber && existingSubscriber.sentMessages) {
            const {sentMessages} = existingSubscriber;
            return Promise.resolve(sentMessages);
        }
        return Promise.resolve([]);
    }

    /**
     * We want emails to be sent only once. If a subscriber has already received a message, don't send again.
     *
     * @param {string} email The email address of the subscriber
     * @param {string} newsItemId The id of the newsItem we are checking if it has been sent
     * @return {boolean} A bool indicating if the recipient has received this specific message already
     */
    async function checkIfNewsItemHasBeenSentAlready({email, newsItemId}) {
        const existingSubscriber = await getSubscriber({email});
        if (existingSubscriber && existingSubscriber.sentMessages) {
            return existingSubscriber.sentMessages.some((sentMessage) => {
                return sentMessage[0] == newsItemId;
            });
        }

        return false;
    }

    return {
        putSubscriber,
        getSubscriber,
        createUniqueSubscriber,
        registerNewsItem,
        checkIfNewsItemHasBeenSentAlready,
        // getNewsItemsPerSubscriberAsyncIterator,
        getNewsItemsPerSubscriber,
    };
};
