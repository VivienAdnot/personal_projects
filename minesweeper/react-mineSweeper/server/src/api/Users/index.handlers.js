import Boom from 'boom';
import { generateJwtToken } from 'services/utils';
import {
    insertUser,
    getAllUsers,
    hashPassword,
    getUserByEmail
} from './index/user.model';


exports.getUsers = (req, res, next) =>

    getAllUsers()
    .then((result) => {

        res.data = result;
        next();

    })
    .catch(next);

exports.postUser = (req, res, next) => {

    const {
        fullName,
        email,
        password
    } = req.body;

    insertUser({
        fullName,
        email,
        password
    })
    .then(({ newVal: userCreated }) => {

        res.data = {
            token: generateJwtToken({ id: userCreated.id }),
            user: userCreated
        };

        next();

    })
    .catch(next);

};

exports.authenticateUser = (req, res, next) => {

    const { email, password } = req.body;

    getUserByEmail(email)
    .then((user) => {

        if (!user) throw new Error(Boom.unauthorized('email not found'));

        const hashedPassword = hashPassword(password);

        if (hashedPassword !== user.password) {

            throw new Error(Boom.unauthorized('wrong password'));

        }

        return user;

    })
    .then((user) => {

        res.data = {
            token: generateJwtToken({ id: user.id }),
            user
        };
        next();

    })
    .catch(next);

};
