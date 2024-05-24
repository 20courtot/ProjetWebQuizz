const express = require('express')
const session = require('express-session');
const passport = require('./passport-config');
const app = express()
const cors = require('cors');
app.use(express.json());
app.use(cors())
const db = require('./models')

app.use(session({
    secret: 'caca', // Remplacez 'your_secret_key' par votre clé secrète
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session())

// Routes
const userRoutes = require('./routes/Users')
app.use("/users",userRoutes)
const quizzRoutes = require('./routes/Quizz')
app.use("/api",quizzRoutes)
const groupeRoutes = require('./routes/Groupes')
app.use("/api",groupeRoutes)
db.sequelize.sync().then(()=>{
    app.listen(3001, ()=> {
        console.log("server running on port 3001");
    });
})

