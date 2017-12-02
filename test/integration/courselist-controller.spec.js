const request = require('supertest')
const chai = require('chai')
const expect = chai.expect
chai.should()


const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const courseListFixture = require('../fixtures/courseList')

describe('CourselistController', () => {
  beforeEach(() => { courseListFixture.up() })
  afterEach(() => { courseListFixture.down() })

  describe('When I create a courseList (POST /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).post('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })

    it('should reject when name is not unique', () => {
      return request(app)
        .post('/course-lists')
        .send({ name: 'Toto' })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name should be unique'
            }
          })
      })
    })

    it('should  succesfuly create a courseList', () => {
      const mockName = 'My New List'

      return request(app)
        .post('/course-lists')
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockName)

          const findIdList = find(db.courseList, { name: mockName } )
          findIdList.should.not.be.empty
          findIdList.should.eql({
            id: res.body.data.id,
            name: res.body.data.name
          })
        })
    })
  })
  describe('When I delete a courseList (DELETE /course-lists)', () => {
    it('should reject with a 400 when no name is given', () => {
      return request(app).delete('/course-lists').then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Missing name'
          }
        })
      })
    })
    it('should reject with a 400 when unknown name is given', () => {
      const mockName = 'Yalala?'
      return request(app).delete('/course-lists').send({ name: mockName }).then((res) => {
        res.status.should.equal(400)
        res.body.should.eql({
          error: {
            code: 'VALIDATION',
            message: 'Name not found'
          }
        })
      })
    })
    it('should  succesfuly delete a courseList', () => {
      const mockName = 'Toto'
      return request(app)
        .delete('/course-lists')
        .send({ name: mockName })
        .then((res) => {
          res.status.should.equal(200)
          const findIdList = find(db.courseList, { name: mockName } )
          expect(findIdList).to.be.undefined
        })
    })
  })
  describe('When I print lists (GET /course-lists)', () => {
    it('should reject with a 204 because list is empty', () => {
      courseListFixture.down()
      return request(app).get('/course-lists').then((res) => {
        res.status.should.equal(204)
      })
    })
    it('should reject with a 200 because print all list', () => {
      return request(app).get('/course-lists').then((res) => {
        res.status.should.equal(200)
        expect(res.body.data).to.be.eql(db.courseList)
      })
    })
  })
})
