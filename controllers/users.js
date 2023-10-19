const User = require('../models/user');

module.exports.renderRegister = (req, res) => {
  res.render('users/register');
}

module.exports.registerUser = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    // register method is provided by passport-local-mongoose
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
      if (err) return next(err);
      req.flash('success', 'Welcome to Voyage Vibe!');
       res.redirect('/destinations');
    });
  } catch (e) {
    req.flash('error', e.message);
    res.redirect('register');
  }
}

module.exports.renderLogin = (req, res) => {
  res.render('users/login');
}

module.exports.loginUser = (req, res) => {
        req.flash('success', 'Welcome back!');
      const redirectUrl = res.locals.returnTo || '/destinations'; // update this line to use res.locals.returnTo now
      delete res.locals.returnTo;
      res.redirect(redirectUrl);
        //  after sign the value to a variable, delete the value from session
       
}

module.exports.logoutUser = (req, res, next) => {
    req.logout(function (err) {
        if (err) {
            return next(err);
        }
        req.flash('success', 'Goodbye!');
        res.redirect('/destinations');
    });
}