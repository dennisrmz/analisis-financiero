const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy ({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async(req, username, password, done) => {
    console.log(req.body);
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    if (rows.length > 0) {
        const user = rows[0];
        const validPassword = await helpers.matchPassword(password, user.password);
        if(validPassword){
            done(null, user, console.log('success Welcome' + user.username));
        }else{
            done(null, false, console.log( 'message incorrect Password'));
        }
    }else{
        return done(null, false, console.log('message The Username does not exists'));
    }
}));

passport.use('local.signup', new LocalStrategy ({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
},async(req, username, password, done)=>{
    console.log(req.body);
    const{ fullname, permiso } = req.body;
    const newUser = {
        username,
        password,
        fullname,
        permiso
    };
    newUser.password = await helpers.encryptPassword(password);
 const result = await pool.query('INSERT INTO users SET ?', [newUser]);
    newUser.id = result.insertId;
    return done(null, newUser);
})); 

passport.serializeUser((user, done) =>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    const rows = await pool.query('SELECT * FROM users where id = ?', [id]);
    done(null, rows[0]);
});
