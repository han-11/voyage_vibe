// warp async function to handle error for mongo validation
// when the function throw an error this catch function will catch the error and pass it the the error handler
module.exports = func => {
  return (req, res, next) => {
    func(req, res, next).catch(next);
  }
}