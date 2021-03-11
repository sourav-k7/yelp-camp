const express=require('express');
const app=express();
const path=require('path');
const mongoose=require('mongoose');
const ExpressError=require('./utils/ExpressError')
const methodOverride=require('method-override');
const engine = require('ejs-mate');
const flash = require('connect-flash');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User = require('./models/user');

const campgroundRoute=require('./route/campground')
const userRoute = require('./route/user');
const session = require('express-session');
const reviewRoute=require('./route/reviewsRoute');
app.engine('ejs',engine);
const sessionConfig={
    secret:'password',
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:1000*60*60*24*7,
        httpOnly:true,
    },

}
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost/yelp-camp', {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false , useCreateIndex:true})
.then(()=>{
    console.log("connected to database");
})
.catch((e)=>{
    console.log("error");
    console.log(e);
})

app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname,'public')));
app.set('view engine','ejs');
app.set('views',path.join(__dirname,'views'));


app.use((req,res,next)=>{
    res.locals.currentUser=req.user; 
   res.locals.success= req.flash('success');
   res.locals.error=req.flash('error');
   next();
})

app.use('/',userRoute);
app.use('/campground',campgroundRoute);
app.use('/campground/:id/reviews',reviewRoute);

app.all('*',(req,res,next)=>{
    next(new ExpressError('Page Not Found',404));
})
app.use((err,req,res,next)=>{
    const {statusCode=500} = err;
    if(!err.message)err.message='Something Went Wrong';
    res.status(statusCode).render('error',{err});
})
app.listen(3000,()=>{
    console.log("listening on port 3000");
})