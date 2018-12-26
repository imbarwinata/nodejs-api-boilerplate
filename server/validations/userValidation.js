const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

module.exports = {
    validationPost() {
        return [
            body('email')
              .isEmail()
              .normalizeEmail(),
            body('text')
              .not().isEmpty()
              .trim()
              .escape(),
            sanitizeBody('notifyOnReply').toBoolean()
        ];
    }
}