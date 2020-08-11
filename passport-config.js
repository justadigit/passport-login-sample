const bcrypt = require('bcrypt')

const LocalStrategy = require('passport-local').Strategy

const initialize = (passport,getUserByEmail,getUserById)=>{
    async function authenticateUser(email,password,done){
        const user = getUserByEmail(email)
        if(!user){
            return done(null,false,{message:"No user with that email!"})
        }
    
        try{
            if(bcrypt.compare(password,user.password)){
                return done(null,user)
            }
            else{
                return done(null,false,{message:"Password Incorrect"})
            }
        }catch(err){
                return done(err)
        }
    }

    passport.use(new LocalStrategy({usernameField:'email'},authenticateUser))
    passport.serializeUser((user,done)=>done(null,user.id))
    passport.deserializeUser((id,done)=>done(null,getUserById(id)))
}

module.exports = initialize;