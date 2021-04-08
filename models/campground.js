const { string } = require('joi');
const mongoose=require('mongoose');
const Review =require('./review');
const User =require('./user');
const Schema=mongoose.Schema;
const ImageScheme = new Schema(
    {
        url:String,
        filename:String
    }
);
ImageScheme.virtual('cardImage').get(
    function () {
        return this.url.replace('/upload','/upload/w_600,h_400')
    }
);
ImageScheme.virtual('thumbnail').get(
    function () {
     return this.url.replace("/upload","/upload/w_200,h_150");
    }
);
const opts = {toJSON:{virtuals:true}};
const campGroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    geometry:{
        type:{
            type:String,
            enum:['Point'],
            required:true
        },
        coordinates:{
            type:[Number],
            required:true
        }
    },
    images:[
        ImageScheme
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User',
    },
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review',
        }
    ]
},opts);

campGroundSchema.post('findOneAndDelete',async function(doc){
   if(doc) {
       await Review.deleteMany({_id:{$in:doc.reviews}},);
   }
})
campGroundSchema.virtual('properties.popUp').get(function () {
    return  `<strong><a href="/campground/${this._id}" style="color:black">${this.title}</a></strong>
    <p>${this.description.substring(0,20)}...</p>`
})

module.exports=mongoose.model('Campground',campGroundSchema);