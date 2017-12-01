const { courseList } = require('../../data/db')
const courseListFixture = require('./courseList')

mockDataA = [
  { id: 1, name: 'legume' , bought: false },
  { id: 2, name: 'fruit' , bought: false }
]

module.exports = {
  up: () => {
    courseListFixture.up()
    courseList.forEach(
      (course) => {
        mockDataA.forEach(
          (mock) => {
            course.articles.push(mock)
          }
        )
      });
  },

  down: () => {
    courseList.forEach(
      (course) => {
        course.articles.splice(0)
      });
  }
}