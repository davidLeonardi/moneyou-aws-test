# Moneyou AWS Test assignment

[Github Repo](https://github.com/davidleonardi/moneyou-aws-test)

## 1. About

### 1.1 Concept

This application serves the purpose of sending and managing emails to people.
Recipients are generally called "Subscribers" and Newsletters/Emails are generally called "NewsItems".

The idea is that in an email/message distribution environment, we want to create reusable messages which can be sent to multiple people. Once we send something, a log of the sent message is created, and can be retrieved for later use.

The flow is as follows:

- We can create a NewsItem, and the API responds with its ID.
- We can send this NewsItem by its ID to a Subscriber. A new subscriber will be created uniquely, and a log of the message being sent will be recorded along with a timestamp. The API will respond with the Subscriber ID.
- We can then retrieve which NewsItems have been sent to a given subscriber, by email, by requesting this from the API. It will respond with a list of messages that have been sent.

In this implementation multiple recipients are not implemented, but could be so with ease.
Furthermore, Unit tests are not implemented, but could be so with Mocks as well as with Mocha/Chai.

### 1.2 Stack

As of now we use the following frameworks/libraries/platforms:

- aws-sdk
- webpack
- babel
- yarn
- DynamoDb

## 2. Pre-requisites

- [JAVA](https://www.oracle.com/technetwork/java/javaee/downloads/jdk8-downloads-2133151.html) must be installed for dynamodb local support. Must follow this link and install the JDK. Apple/Darwin JAVA is not recent enough and will fail.
- [AWS serverless](https://serverless.com/framework/docs/getting-started/) must be installed to have access to the sls/serverless CLI tools. Steps for this are included below.
- node/11.10.1
- Create secrets.json file and paste contents of secrets.json.example
- Edit the unknown secrets.json variables.. or not.


```bash
sudo npm install -g serverless

serverless plugin install --name serverless-webpack
serverless plugin install --name serverless-dynamodb-local

yarn
serverless offline
```

### DynamoDB

We use DynamoDB (via AWS) to persist data

Install:

```bash
serverless dynamodb install
```

Start local instance:

```bash
    serverless dynamodb start
```

Migrate the db:

```bash
    serverless dynamodb migrate
```

## 3. Development

### 3.1 Conventions

- JS Google coding conventions (eslint settings)

### 3.2 Directories
```
├── /handler.js             # Main entry point
├── /dist/                  # Distribution build
├── /controllers/           # Holds various controllers, for example Email, NewsItem and Subscriptions
├── /services               # Handlers for services
│   └── /dynamodb/mapper/       # Data mapper entities for DynamoDB
├── /utils                  # Utils
│── secrets.json.example    # Template for secrets
└── package.json            # The list of 3rd party libraries and utilities
```

### 3.3 API endpoints

#### Create a new message to be sent to someone later

POST /newsItem/create

##### Parameters

- content {String} The textual content of the email we want to send

```JSON
{"content": "Let's still be in touch"}
```

Responds with the NewsItem ID

#### Send a new NewsItem to a given recipient

POST /email/send

##### Parameters

- email {String} The email address of the recipient
- name {String} The name of the recipient
- newsItemId {String} The UUID of the NewsItem we want to send

```JSON
{
    "email":"david.leonardi@gmail.com",
    "name":"David Leonardi",
    "newsItemId": "1cf6054e-7f8c-44ce-bd0d-771eea55dbd8"
}
```

Responds with the ID of the subscriber who received the message

#### List all messages sent to a given email address

POST /subscriber/listMessages

##### Parameters

- email {String} The email address we want to retrieve messages for

```JSON
{"email":"david.leonardi@gmail.com"}
```

Responds with a list of NewsItems and the send date

## 4. Commands

### Development
- `serverless offline` local development version
- `serverless webpack --out dist` test build

### Production
- `serverless deploy`

## 5. Todo
- Implement unit tests
- Implement test code coverage
- Implement IAM/Cognito authentication to authenticate users when they request emails that got sent to their email address
