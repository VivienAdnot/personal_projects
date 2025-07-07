import sha1 from 'sha1';
import { formatRdbResult } from 'services/utils';
import { DATABASE_NAME, USERS_TABLE_NAME } from './user.const';

export const hashPassword = plainPassword => sha1(plainPassword);

export const getAllUsers = () =>

    global.rethinkdb
    .db(DATABASE_NAME)
    .table(USERS_TABLE_NAME)
    .run();

export const getUserById = _user =>

    global.rethinkdb
    .db(DATABASE_NAME)
    .table(USERS_TABLE_NAME)
    .get(_user)
    .run();

export const getUserByEmail = email =>

    global.rethinkdb
    .db(DATABASE_NAME)
    .table(USERS_TABLE_NAME)
    .getAll(email, { index: 'email' })
    .run()
    .then(users => users[0]);

export const insertUser = (data) => {

    const newUser = {
        fullName: data.fullName,
        email: data.email,
        password: hashPassword(data.password)
    };

    return global.rethinkdb
    .db(DATABASE_NAME)
    .table(USERS_TABLE_NAME)
    .insert(newUser, { returnChanges: true })
    .run()
    .then(formatRdbResult);

};

