const { courseList } = require('../../data/db')

mockData = [
  { id: 1, name: 'Toto', articles: []},
  { id: 2, name: 'Ma liste', articles: []}
]

module.exports = {
  up: () => {
    courseList.splice(0)
    courseList.push.apply(courseList, mockData)
  },

  down: () => {
    courseList.splice(0)
  }
}