import Boom from 'boom';

exports.postUser = (req, res, next) => {

    const { password, confirmationPassword } = req.body;

    if (password === confirmationPassword) {

        next();
        return;

    }

    next(Boom.badData('password and confirmation password must match'));

};
