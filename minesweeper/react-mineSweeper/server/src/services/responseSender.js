const HTTP_CODE_OK = 200;
const HTTP_CODE_INTERNAL_SERVER_ERROR = 500;

exports.responseSender = (req, res) => {

    res.status(HTTP_CODE_OK).send(res.data);

};

exports.errorResponseSender = (err, req, res) => {

    res.status(HTTP_CODE_INTERNAL_SERVER_ERROR).send({
        message: err.message
    });

};
