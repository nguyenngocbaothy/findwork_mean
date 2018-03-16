const { verify } = require('../lib/jwt');

// check is has token and verify object idUser in token
function mustBeUser(req, res, next) {
    const { token } = req.headers;
    if (!token) return res.status(400).send({ success: false, message: 'Invalid token.' });
    verify(token)
    .then(obj => {
        req.idUser = obj._id;
        next();
    })
    .catch(() => res.status(400).send({ success: false, message: 'Invalid token.' }))
}

module.exports = { mustBeUser };