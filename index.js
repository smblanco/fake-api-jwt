const express = require('express');
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const dashboadRoutes = require('./routes/dashboard');
const verifyToken = require('./routes/validate-token');
require('dotenv').config();
const cors = require('cors');
var corsOptions = {
    credentials: true ,
    origin: 'https://localhost:8081', // Reemplazar con dominio
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}


const app = express();
app.use(cors(corsOptions));
// capturar body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

// Conexión a Base de datos



const uri = `mongodb+srv://${process.env.USR}:${process.env.PASSWORD}@cluster0.nhghk.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
//const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.ncdk5.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Base de datos conectada'))
.catch(e => console.log('error db:', e))

// import routes
const authRoutes = require('./routes/auth');

// route middlewares
app.use('/api/user', authRoutes);

app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'funciona!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})


app.use('/api/dashboard', verifyToken, dashboadRoutes);