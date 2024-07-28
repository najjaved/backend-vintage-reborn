const jwt = require("jsonwebtoken");
const secret = require("../config/secretGenerator");

const isAuthenticated = async (req, res, next) => {

    try {
        // Get the token string from the authorization header - "Bearer eyJh5kp9..."
        const token = req.headers.authorization?.split(" ")[1];

        // Verify the token. Returns payload if the token is valid, otherwise throws an error
        const payload = jwt.verify(token, secret);
        console.log('payload decoded after token verification: ', payload);

        // Add the decoded payload to the request object as req.tokenPayload for use in next middleware or route
        req.tokenPayload = payload;
        next(); // to pass the request to the next middleware function or route
    }

    catch (error) {
        // the middleware will catch error and send 401 if:
        // 1. There is no token
        // 2. Token is invalid
        // 3. There is no headers or authorization in req (no token)
        res.status(401).json('Unauthorized: Token not provided or not valid')
    }
}

module.exports = { isAuthenticated }