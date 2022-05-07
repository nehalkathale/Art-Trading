const express = require('express')
const morgan = require('morgan')
const methodOverride = require('method-override')
const session = require('express-session');
const flash = require('connect-flash');
const mongoose = require('mongoose');
const MongoStore = require('connect-mongo');
require ('./models/tradeModels');
require('./models/offerModels');
require('./models/userModels');
require('./models/watchListModels')
const tradeRoutes = require('./routes/tradesRoutes');
const mainRoute = require('./routes/mainRoutes');
const userRoute = require('./routes/userRoutes');
const tradeRequestRoute = require('./routes/tradeRequestRoutes')
const app = express()

let port = 3000
let host = 'localhost'
app.set('view engine','ejs');
mongoose.connect('mongodb://localhost:27017/demos', 
                {useNewUrlParser: true, useUnifiedTopology: true,})
.then(()=>{
    //start app
    app.listen(port, host, ()=>{
        console.log('Server is running on port', port);
    });
})
.catch(err=>console.log(err.message));
app.use(session({
    secret : 'skjdfksdfbhddhfuo',
    resave : false,
    saveUninitialized : false,
    cookie : {maxAge:60*60*1000},
    store : new MongoStore({mongoUrl : 'mongodb://localhost:27017/demos'})
}));
app.use(flash());
app.use((request,response,next)=>{
    response.locals.user = request.session.user||null;
    response.locals.successMessages = request.flash('success');
    response.locals.errorMessages = request.flash('error')
    next();
})
app.use(express.static('public'));
app.use(express.urlencoded({
    extended :true,
}))
app.use(morgan('tiny')); 
app.use(methodOverride('_method'));
app.get('/',(request, response) =>{
    response.render('index');
})

app.use('/trades',tradeRoutes);
app.use('/index', mainRoute);
app.use('/user', userRoute);
app.use('/tradeRequest', tradeRequestRoute);


app.use((request, response, next) =>{
    let error = new Error('Server cannot locate ' + request.url);
    error.status = 404;
    next(error)
})

app.use((error,request,response,next)=>{
    console.log(error.stack);
    if(!error.status){
        error.status = 500;
        error.message = ("Internal Server Error");
    }
    response.status(error.status);
    response.render('error',{error : error});
});
