const passportLocal = require("passport-local");

const passport = require('passport')

const loginService = require("../services/patientLoginService");


let LocalStrategy = passportLocal.Strategy;

let initPassportPatientLocal = () => {
    passport.use(new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    },
        async (req, email, password, done) => {
            try {
                await loginService.findUserByEmail(email).then(async (user) => {
                    if (!user) {
                        return done(null, false, req.flash("errors", `This user email "${email}" doesn't exist`));
                    }
                    if (user) {
                        let match = await loginService.comparePassword(password, user);
                        if (match === true) {
                            return done(null, user, null)
                        } else {
                            return done(null, false, req.flash("errors", match)
                            )
                        }
                    }
                });
            } catch (err) {
                console.log(err);
                return done(null, false, { message: err });
            }
        }));

};

passport.serializeUser((user, done) => {
    done(null, user.patient_id);
});

passport.deserializeUser((id, done) => {
    loginService.findUserById(id).then((user) => {
        return done(null, user);
    }).catch(error => {
        return done(error, null)
    });
});

module.exports = initPassportPatientLocal;