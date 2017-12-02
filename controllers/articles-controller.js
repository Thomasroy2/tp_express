const express = require('express')
const router = express.Router()
const { find, remove, findAll } = require('lodash')
const uuid = require('../utils/guid')

const db = require('../data/db')
const courseListCollection = db.courseList


router.post('/', (req, res, next) => {
    if (!req.body.name) {
        res.status(400)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'Missing article name'
            }
        })
    }
    if (!req.body.id) {
        res.status(400)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'Missing list id'
            }
        })
    }

    const id = req.body.id

    const findIdList = find(courseListCollection, { id })
    if (!findIdList) {
        res.status(400)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'List does not exist'
            }
        })
    }

    const newArticles = {
        id: uuid.generateUid(),
        name: req.body.name,
        bought: false
    }
    console.log(newArticles)
    findIdList.articles.push(newArticles)

    res.json({
        data: newArticles
    })
})
router.get('/', (req, res, next) => {
    if (!req.body.id) {
        res.status(400)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'Missing list id'
            }
        })
    }
    const id = req.body.id
    const findIdList = find(courseListCollection, { id })
    if (findIdList.articles.length == 0) {
        res.status(204)
    }
    res.json({
        data: findIdList.articles
    })

})
router.put('/', (req, res, next) => {
    if (!req.body.idList) {
        res.status(400)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'Missing list id'
            }
        })
    }
    if (!req.body.idArticle) {
        res.status(400)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'Missing article id'
            }
        })
    }
    const idList = req.body.idList
    const idArticle = req.body.idArticle
    const findIdList = find(courseListCollection, { id:idList })
    if (!findIdList) {
        res.status(404)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'Missing list course'
            }
        })
    }
    let findIdArti = find(findIdList.articles, { id:idArticle })
    if (!findIdArti) {
        res.status(404)
        return res.json({
            error: {
                code: 'VALIDATION',
                message: 'Missing article'
            }
        })
    }
    findIdArti.bought = true;
    res.json({
        data: findIdArti
    })

})

module.exports = router