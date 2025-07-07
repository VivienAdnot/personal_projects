import { insertScore, getAllBestScores, enrichScores } from './index/score.model';

exports.postScore = (req, res, next) => {

    const {
        _user,
        score
    } = req.body;

    insertScore({
        _user,
        score,
        createdAt: new Date()
    })
    .then(({ newVal: scoreCreated }) => {

        res.data = {
            score: scoreCreated
        };

        next();

    })
    .catch(next);

};

exports.getBestScores = (req, res, next) => {

    getAllBestScores()
    .then(bestScores => enrichScores(bestScores))
    .then((enrichedBestScores) => {

        res.data = enrichedBestScores;

        next();

    })
    .catch(next);

};
