const bcrypt = require('bcrypt');
const fetch = require('node-fetch')
const Score = require('../models/score.model.js')

exports.addscore = async (req, res) => {
    if (!req.body) return res.status(400).send({
        message: "Missing data"
    });
    const username = req.body.username
    const score = req.body.score
    if (username == null) return res.status(403).json({ error: "Enter valid username" })
    if (score.length != 6) return res.status(403).json({ error: "Not enough Mini-game scores" })
    const newscore = new Score({
        username,
        score,
    });
    const createdScore = await newscore.save()
    if (!createdScore) return res.status(404).json("Could not add score")

    return res.status(200).json(createdScore)

}

exports.getscore = async (req, res) => {
    if (!req.params) {
        return res.status(400).send({ message: "Username can not be empty" });
    }
    if (req.params.username == null) return res.status(400).send({ message: "Username can not be empty" });
    const username = req.params.username
    const recentScore = await Score.find({ username }).sort({ createdAt: -1 }).limit(1)
    console.log(recentScore)
    if (!recentScore) return res.status(404).json("Score with that username does not exist")
    return res.status(200).json({ recentScore })
}

exports.getaveragescores = async (_, res) => {
    const allScores = await Score.find()
    if (!allScores) return res.status(404).json("Request could not be handled at this time")
    const avgMiniGameScores = [0, 0, 0, 0, 0, 0]
    const stdDeviation = [0, 0, 0, 0, 0, 0]
    const miniGameScores = [[],[],[],[],[],[]]
    //Calculating means
    allScores.forEach(playerScore => {
        numScores = allScores.length
        playerScore.score.forEach((score, index) => {
            avgMiniGameScores[index] += (score / numScores)
            miniGameScores[index].push(score)
        })
    });

    //Sum value - mean squared
    allScores.forEach(playerScore => {
        playerScore.score.forEach((score, index) => {
            stdDeviation[index] += Math.pow((score - avgMiniGameScores[index]), 2)
        })
    })

    //Calulating final score average
    const avgFinalScore = (avgMiniGameScores.reduce((a, b) => a + b, 0) / avgMiniGameScores.length).toFixed(2)

    //Trimming to 2 decimals
    stdDeviation.forEach((stdD, index) => {
        stdDeviation[index] = Math.sqrt(stdD / (allScores.length)).toFixed(2)
    })
    avgMiniGameScores.forEach((avg, index) => {
        avgMiniGameScores[index] = avg.toFixed(2)
    })

    return res.status(200).json({
        miniGameScores: miniGameScores,
        avgFinalScore: avgFinalScore,
        avgMiniGameScores: avgMiniGameScores,
        numUsers: allScores.length,
        stdDeviation: stdDeviation
    })
}