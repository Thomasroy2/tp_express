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

      return request(app)
        .post('/course-lists')
        .then((res) => {
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

      const mockListName = 'Toto'

      return request(app)
        .post('/course-lists')
        .send({ name: mockListName })
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

    it('should succesfuly create a courseList', () => {

      const mockListName = 'My New List'

      return request(app)
        .post('/course-lists')
        .send({ name: mockListName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')
          res.body.data.name.should.equal(mockListName)

          const findIdList = find(db.courseList, { name: mockListName } )
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

      return request(app)
        .delete('/course-lists')
        .then((res) => {
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

      const mockListName = 'Yalala?'

      return request(app)
        .delete('/course-lists')
        .send({ name: mockListName })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Name not found'
            }
          })
        })

    })

    it('should succesfuly delete a courseList', () => {

      const mockListName = 'Toto'

      return request(app)
        .delete('/course-lists')
        .send({ name: mockListName })
        .then((res) => {
          res.status.should.equal(200)

          const findNameInResponse = find(res.body.data, { name: mockListName } )
          expect(findNameInResponse).to.be.undefined

          const findNameInDb = find(db.courseList, { name: mockListName } )
          expect(findNameInDb).to.be.undefined
        })

    })

  })

  describe('When I print lists (GET /course-lists)', () => {

    it('should reject with a 204 because list is empty', () => {

      courseListFixture.down()

      return request(app)
        .get('/course-lists')
        .then((res) => {
          res.status.should.equal(204)
        })

    })

    it('should succesfuly print all list', () => {

      return request(app)
        .get('/course-lists')
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.eql(db.courseList)
        })

    })

  })

})
