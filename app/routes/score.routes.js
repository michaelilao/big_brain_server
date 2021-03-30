module.exports = (app) => {
    const score = require('../controllers/score.controller.js')

    app.post('/api/score/addscore', score.addscore)
    app.get('/api/score/getscore/:username/', score.getscore)
    app.get('/api/score/getaveragescores', score.getaveragescores)

}