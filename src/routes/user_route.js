const controller = require('../controllers/user_controller')

module.exports = function (app) {


  // For Front End
  app.get('/referrals/:id', controller.getAllReferralFriends)

  // For Admin Panel
  // Add New City
//   app.post('/api/cities', checkToken, controller.addCity)

//   // Get All City
//   app.get('/api/cities', checkToken, controller.getCities)

//   // Get City By Id
//   app.get('/api/cities/:id', checkToken, controller.getCityById)

//   // Update City By Id
//   app.put('/api/cities/:id', checkToken, controller.updateCity)

//   // Delete City By Id
//   app.delete('/api/cities/:id', checkToken, controller.deleteCity)
}