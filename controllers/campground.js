const Campground=require('../models/campground');

module.exports.index = async (req,res)=>{
   const campground = await Campground.find({}); 
   res.render('campground/index',{campground});
};

module.exports.RenderNewForm = (req,res)=>{
    
    res.render('campground/new');
};

module.exports.CreateCampground = async (req,res)=>{
    const camp=new Campground(req.body.campground);
    camp.author=req.user._id; 
    await camp.save();
    req.flash('success','successfully made new campground');
    res.redirect(`/campground/${camp._id}`)
}
module.exports.showCampground = async (req,res)=>{
    const {id}=req.params;
    const camp = await Campground.findById(id).populate({path:'reviews',populate:{path:'author'}}).populate('author','username') ;
   if(!camp)
   {
       req.flash('error','campground not found');
       res.redirect('/campground');
   }

    // console.log(camp);
    res.render('campground/show',{camp});
}

module.exports.RenderEditForm = async(req,res)=>{
    const camp=await Campground.findById(req.params.id);
   if(!camp)
   {
       req.flash('error','campground not found');
       res.redirect('/campground');
   }
    res.render('campground/edit',{camp});
}

module.exports.updateCampground = async (req,res)=>{
    const {id}=req.params;
    
    await Campground.findByIdAndUpdate(id,{...req.body.campground},{runValidators:true});
    req.flash('success','Successfully Updated campground');
    res.redirect(`/campground/${id}`);
}

module.exports.deleteCampground = async(req,res)=>{
    await Campground.findByIdAndDelete(req.params.id);
    req.flash('success','Successfully Deleted Campground')
    res.redirect('/campground');
}