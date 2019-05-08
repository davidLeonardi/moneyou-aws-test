module.exports = (options) => {
    const {senderDomain} = options;

    /**
     * Generates object describing an HTTP Success response
     *
     * @param {number} code The HTTP status code
     * @param {any} payload The data to return
     * @return {Response} The HTTP response object
     */
    function generateResponse(code, payload) {
        return {
            statusCode: code,
            headers: {
                'Access-Control-Allow-Origin': senderDomain,
                'Access-Control-Allow-Headers': 'x-requested-with',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(payload),
        };
    }

    /**
     * Generates object describing an HTTP ERROR response
     *
     * @param {number} code The HTTP status code
     * @param {any} err The data to return
     * @return {Response} The HTTP response object
     */
    function generateError(code, err) {
        console.log(err);
        return {
            statusCode: code,
            headers: {
                'Access-Control-Allow-Origin': senderDomain,
                'Access-Control-Allow-Headers': 'x-requested-with',
                'Access-Control-Allow-Credentials': true,
            },
            body: JSON.stringify(err.message),
        };
    }

    return {
        generateError,
        generateResponse,
    };
};
