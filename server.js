require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const flash= require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override')
app.use(flash())
app.use(session({
  secret:process.env.SESSION_SECRET,
  resave:false,
  saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(express.urlencoded({extended:false}))
app.use(methodOverride('_method'))
const initializePassport = require('./passport-config');

initializePassport(
  passport,
  email=>users.find(user=>user.email==email),
  id=>users.find(user=>user.email==email)
  )
//view engine
app.set('view engine','ejs');

let users = [];
//PORT
const PORT = process.env.PORT || 3300;

//Route
app.get('/',checkAuthentication,(req,res)=>{

    res.render('index',{
        name:"Mg Mg"
    })
})

app.get('/register',(req,res)=>{
    res.render('register');
})

app.post('/register',async (req,res)=>{
  try{
    const hashedPassword =await bcrypt.hash(req.body.password,10);
    users.push({
        id:new Date().toISOString,
        name:req.body.name,
        email:req.body.email,
        password:hashedPassword
    });
    res.redirect('/login');
  }
  catch{
    res.redirect('/register')
  }

})

app.get('/login',(req,res)=>{
    res.render('login');
})
app.post('/login',passport.authenticate('local',{
  successRedirect:'/',
  failureRedirect:'/login',
  failureFlash:true
}))

app.delete('/logout',(req,res)=>{
  req.logOut()
  req.redirect('/login')
})
function checkAuthentication(req,res,next){
  if(req.isAuthenticated()){
      //req.isAuthenticated() will return true if user is logged in
      next();
  } else{
      res.redirect("/login");
  }
}
app.listen(PORT,()=>{
    console.log(`Your app is running at ${PORT}`);
})