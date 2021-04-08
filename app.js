if(process.env.NODE_ENV !=="production"){
    require('dotenv').config();
}

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
const mongoSanitize = require('express-mongo-sanitize');
const helmet =require('helmet'); 
const campgroundRoute=require('./route/campground')
const userRoute = require('./route/user');
const session = require('express-session');
const reviewRoute=require('./route/reviewsRoute');
const MongoDBStore = require('connect-mongo');

app.engine('ejs',engine);
const dbUrl = process.env.DB_URL;
// const dbUrl='mongodb://localhost/yelp-camp';
const secret = process.env.SECRET;
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter:24 * 60 *60,
})
store.on("error",function (e) {
    console.log('session store error',e);
})
const sessionConfig={
    store,
    name:'__session',
    secret,
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+(1000*60*60*24*7),
        maxAge:1000*60*60*24*7,
        httpOnly:true,// this make it only accessible via http req
        // secure:true,
    },

}
const scriptSrcUrls = [
    
    "https://api.tiles.mapbox.com/",
    "https://api.mapbox.com/",
    "https://kit.fontawesome.com/",
    "https://cdnjs.cloudflare.com/",
    "https://cdn.jsdelivr.net/npm/",
    
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com/",
    "https://cdn.jsdelivr.net/npm/",
    "https://api.mapbox.com/",
    "https://api.tiles.mapbox.com/",
    "https://fonts.googleapis.com/",
    "https://use.fontawesome.com/",
];
const connectSrcUrls = [
    "https://api.mapbox.com/",
    "https://a.tiles.mapbox.com/",
    "https://b.tiles.mapbox.com/",
    "https://events.mapbox.com/",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/deku/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT! 
                "https://images.unsplash.com/",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);
app.use(mongoSanitize());
app.use(flash());
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(express.urlencoded({extended:true}));

mongoose.connect(dbUrl, {useNewUrlParser: true, useUnifiedTopology: true,useFindAndModify:false , useCreateIndex:true})
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
app.get('/',(req,res)=>{
    res.render('home');
})

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