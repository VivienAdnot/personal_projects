import Boom from 'boom';
import Promise from 'bluebird';
import { DATABASE_NAME, SCORES_TABLE_NAME } from './score.const';
import formatRdbResult from '../../../services/utils';
import { getUserById } from '../../Users/index/user.model';

export const insertScore = score =>

    global.rethinkdb
    .db(DATABASE_NAME)
    .table(SCORES_TABLE_NAME)
    .insert(score, { returnChanges: true })
    .run()
    .then(formatRdbResult);

export const getAllBestScores = () =>

    global.rethinkdb
    .db(DATABASE_NAME)
    .table(SCORES_TABLE_NAME)
    .orderBy('score')
    .limit(10)
    .run();

export const getBestScoresByUser = (_user) => {

    /* TBD */
    throw Error(Boom.notImplemented('getBestScores'));

};

export const enrichScores = (data) => {

    const scores = Array.isArray(data) ? data : [data];
    const _users = scores.map(score => score._user);

    return Promise.map(_users, _user => getUserById(_user))
    .then(users => scores.map(score => ({
        ...score,
        user: users.find(user => user.id === score._user)
    })))
    .then(enrichedScores => (
        Array.isArray(data) ? enrichedScores : enrichedScores[0]
    ));

};
