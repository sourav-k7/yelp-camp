const mongoose=require('mongoose');
const Review =require('./review');
const User =require('./user');
const Schema=mongoose.Schema;

const campGroundSchema=new Schema({
    title:String,
    price:Number,
    description:String,
    location:String,
    image:String,
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
});

campGroundSchema.post('findOneAndDelete',async function(doc){
   if(doc) {
       await Review.deleteMany({_id:{$in:doc.reviews}},);
   }
})

module.exports=mongoose.model('Campground',campGroundSchema);