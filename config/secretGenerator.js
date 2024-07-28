const crypto = require("crypto")

const secret = crypto.randomBytes(24).toString("base64url")

module.exports = secret;