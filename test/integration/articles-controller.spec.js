const request = require('supertest')
const express = require('express')
const chai = require('chai')
const expect = chai.expect
chai.should()
const { find } = require('lodash')

const db = require('../../data/db')
const app = require('../../app')

const articlesListFixture = require('../fixtures/articlesList')
const courseListFixture = require('../fixtures/courseList')

describe('ArticleslistController', () => {

  beforeEach(() => { articlesListFixture.up() })
  afterEach(() => { articlesListFixture.down() })

  describe('When I add an article in a list  (POST /articles-lists)', () => {

    it('should reject with a 400 when article name is not given', () => {

      const mockCourseListId = 1

      return request(app)
        .post('/articles-lists')
        .send({ id: mockCourseListId })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing article name'
            }
          })
        })

    })

    it('should reject with a 400 when list id is not given', () => {

      const mockArticleName = 'bla'

      return request(app)
        .post('/articles-lists')
        .send({ name: mockArticleName })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing list id'
            }
          })
        })

    })

    it('should reject with a 400 when course list does not exist', () => {

      const mockCourseListId = 1337
      const mockArticleName = 'Anti dépresseur'

      return request(app)
        .post('/articles-lists')
        .send({ id: mockCourseListId, name: mockArticleName })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'List does not exist'
            }
          })
        })

    })

    it('should  succesfuly create an articles', () => {

      const mockCourseListId = 1
      const mockArticleName = 'Anti dépresseur'

      return request(app)
        .post('/articles-lists')
        .send({ id: mockCourseListId, name: mockArticleName })
        .then((res) => {
          res.status.should.equal(200)
          expect(res.body.data).to.be.an('object')

          const result = find(db.courseList, { id: mockCourseListId })
          const resultArticle = find(result.articles, { name: mockArticleName })
          resultArticle.should.not.be.empty
          resultArticle.should.eql({
            id: res.body.data.id,
            name: res.body.data.name,
            bought: false
          })
        })

    })

  })

  describe('When I print lists (GET /articles-lists)', () => {

    it('should reject with a 204 because articles list is empty', () => {

      articlesListFixture.down()

      return request(app)
        .get('/articles-lists')
        .send({ id: 1 })
        .then((res) => {
          res.status.should.equal(204)
        })

    })

    it('should validate with a 200 and send list of articles', () => {

      const mockCourseListId = 1

      return request(app)
        .get('/articles-lists')
        .send({ id: mockCourseListId })
        .then((res) => {
          res.status.should.equal(200)
          const findIdList = find(db.courseList, { id: mockCourseListId })
          expect(res.body.data).to.be.eql(findIdList.articles)
        })

    })

    it('should reject with a 400 because missing id', () => {

      return request(app)
        .get('/articles-lists')
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing list id'
            }
          })
        })

    })

  })

  describe('When I update articles lists (PUT /articles-lists)', () => {

    it('should update with a 200 after updating the wanted article', () => {

      const mockCourseListId = 1
      const mockArticleId = 2

      return request(app)
        .put('/articles-lists')
        .send({ idList: mockCourseListId, idArticle: mockArticleId })
        .then((res) => {
          res.status.should.equal(200)
          const findIdList = find(db.courseList, { id: mockCourseListId })
          const findIdArti = find(findIdList.articles, { id: mockArticleId })
          expect(res.body.data).to.be.eql(findIdArti)
        })

    })

    it('should reject with a 400 because missing article id', () => {

      const mockCourseListId = 1

      return request(app)
        .put('/articles-lists')
        .send({ idList: mockCourseListId })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing article id'
            }
          })
        })

    })

    it('should reject with a 400 because missing list id', () => {

      const mockArticleId = 2

      return request(app)
        .put('/articles-lists')
        .send({ idArticle: mockArticleId })
        .then((res) => {
          res.status.should.equal(400)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing list id'
            }
          })
        })

    })

    it('should reject with a 404 because missing course list', () => {

      const mockCourseListId = 20
      const mockArticleId = 2

      return request(app)
        .put('/articles-lists')
        .send({ idList: mockCourseListId, idArticle: mockArticleId })
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing list course'
            }
          })
        })

    })

    it('should reject with a 404 because missing article', () => {

      const mockCourseListId = 2
      const mockArticleId = 34

      return request(app)
        .put('/articles-lists')
        .send({ idList: mockCourseListId, idArticle: mockArticleId })
        .then((res) => {
          res.status.should.equal(404)
          res.body.should.eql({
            error: {
              code: 'VALIDATION',
              message: 'Missing article'
            }
          })
        })

    })

  })

})
