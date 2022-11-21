const express = require('express')
const router = express.Router()
const path = require('path')

//index.html
router.get('^/$|/index(.html)?', (req, res) => {
    //search for path (.. = root direcotory) ->views->index.html
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'))
})


module.exports = router