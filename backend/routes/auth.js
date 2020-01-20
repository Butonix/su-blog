const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');
const multer = require('multer');
const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const {User} = require('../models');
const path = require('path');
const {userinfo} = require('../passport/kakaoStrategy');

const router = express.Router();
router.post('/login',isNotLoggedIn, (req,res,next) => {
  passport.authenticate('local',(error,user,info) => {
    if(error) {
      res.status(500).json({
        message: error || 'Oops, something happened!',
      });
      console.log('loginerror');
      return next(error);
    }
    if(!user) {
      console.log('loginError');
      return res.status(500).json({
        message: error || info.message,
      });
    }
    return req.login(user, (loginError) => {
      if(loginError) {
        return (
          next(loginError),
          console.log('continue')
        );
      }
      return (
        res.json(user)
      )
    })
  })(req,res,next);
 
})

router.get('/facebook', passport.authenticate('facebook',{
  authType: 'rerequest', scope: ['public_profile', 'email']
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/home');
  }
);



router.post('/signup', async(req,res,next) => {
  const {email,password,Nickname} = req.body;
  const hash = await bcrypt.hash(password, 12);
  await User.create({
    email,
    password: hash,
    nick:Nickname,
  })
  return res.redirect('/');
})

router.get('/logout', (req,res) => {
  req.logout();
  req.session.destroy();
  res.send('logout');
});

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'profiles/')
  },
  filename(req, file, cb) {
  const ext = path.extname(file.originalname);  
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext); 
  },
  limits: { fileSize: 5 * 1024 * 1024 },
})

var upload = multer({ storage })

router.post('/profile/img',upload.single('img'), (req, res) => {
  console.log(req.file);
  if(req.file){
    res.json({ path: `${req.file.filename}` });
  }else {
    req.status("404").json("No file to Upload!")
  }
});

router.post('/profile/save', async(req,res) => {
  const {phone, img_path,id} = req.body;
  User.update({profile_img: img_path},{where: {email: id}})
  res.send(img_path);
})

router.get('/kakao', passport.authenticate('kakao'));
router.get('/kakao/callback', passport.authenticate('kakao', {
  failureRedirect: '/',
}), (req, res) => {
  res.redirect('http://localhost:3000/home');
});
module.exports = router;