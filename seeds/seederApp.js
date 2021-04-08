const mongoose = require('mongoose');
const cities = require('./indianCities.json');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 130; i++) {
        const random200 = Math.floor(Math.random() * 100)+Math.floor(Math.random() * 100);
        const price = Math.floor(Math.random() * 20) + 10;
        const camp = new Campground({
            author:'60377b8fb210df0524a7037c',
            location: `${cities[random200].name}, ${cities[random200].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
             geometry : { 
              type : "Point",
              coordinates : [ cities[random200].lon,cities[random200].lat ],
            },
            
            images:  [
    {

      url: 'https://res.cloudinary.com/deku/image/upload/v1616411930/YelpCamp/jb20rosn2twyulp8kc2z.jpg',
      filename: 'YelpCamp/jb20rosn2twyulp8kc2z'
    },
    {
   
      url: 'https://res.cloudinary.com/deku/image/upload/v1616411915/YelpCamp/vrfducgaofjfxsxjzsgm.jpg',
      filename: 'YelpCamp/vrfducgaofjfxsxjzsgm'
    },
    {
      url: 'https://res.cloudinary.com/deku/image/upload/v1616411916/YelpCamp/sc7q8woctt2w87gic54a.jpg',
      filename: 'YelpCamp/sc7q8woctt2w87gic54a'
    }
  ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
            price
        })
        await camp.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})