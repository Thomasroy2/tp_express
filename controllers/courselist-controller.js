const express = require('express')
const router = express.Router()
const { find, remove , findAll } = require('lodash')
const uuid = require('../utils/guid')

const db = require('../data/db')
const courseListCollection = db.courseList

router.post('/', (req, res, next) => {
  if (!req.body.name) {
    res.status(400)
    return res.json({
      error: {
        code: 'VALIDATION',
        message: 'Missing name'
      }
    })
  }

  const name = req.body.name

  // Check for name uniqueness
  const result = find(courseListCollection, { name })
  if (result) {
    res.status(400)
    return res.json({
      error: {
        code: 'VALIDATION',
        message: 'Name should be unique'
      }
    })
  }

  const newCourseList = {
    id: uuid.generateUid(),
    name
  }

  courseListCollection.push(newCourseList)

  res.json({
    data: newCourseList
  })
})
router.delete('/',(req,res,next)=>{
  if (!req.body.name){
    res.status(400)
    return res.json({
      error: {
        code: 'VALIDATION',
        message: 'Missing name'
      }
    })
  }
  const name = req.body.name

  const result = find(courseListCollection, { name })

  if (!result) {
    res.status(400)
    return res.json({
      error: {
        code: 'VALIDATION',
        message: 'Name not found'
      }
    })
  }
  remove(courseListCollection, {name})

  res.json({
  })
})
router.get('/',(req,res,next)=>{
  if (courseListCollection.length == 0)
  {
    res.status(204)
  }
  res.json({
    data: courseListCollection
  })
  
})
module.exports = router