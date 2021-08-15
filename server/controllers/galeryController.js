'use strict';
const Galery = require('../models/galery');
const Photo= require('../models/photo');
const addPhoto =  (req, res) => {
    const date= req.body.date;
    var photos=[Object];
    photos= req.body.photos;
                Galery.findOne({date}).then((gal)=>{
                    if(gal != null){
                        photos.forEach((one)=>{
                            var photo = new Photo({
                                url:one
                            });
                            photo.save().then(newPhoto=>{
                        Galery.findByIdAndUpdate(gal._id,{
                            $push: {
                                photos:{
                                    $each:[newPhoto],
                                    $position:0
                                } 
                            }
                        }).exec((err,docs)=>{
    
                        })
                    })
                })
                    }else{
                        const temp= new Galery({
                            date:date
                        });
                        temp.save().then((gal)=>{
                            photos.forEach((one)=>{
                                var photo = new Photo({
                                    url:one
                                });
                                photo.save().then(newPhoto=>{
                            Galery.findByIdAndUpdate(gal._id,{
                                $push: {
                                    photos:{
                                        $each:[newPhoto],
                                        $position:0
                                    } 
                                }
                            }).exec((err,docs)=>{
        
                            })
                        })
                    })
    
                 })
    
             }
        }).then(()=>res.json({status:200})
        )
        .catch((e)=>{
            res.json({status:400})
        })    
    }
const getGalery =  (req, res) => {
        Galery.find({}).populate('photos').exec((err, docs)=>{
                if(err){
                    return res.json({status: 404})
                }else{
                    docs.sort((a,b)=>a.date-b.date);
                   return res.json({status:200, day:docs})
                }
            });  
}

const deletePhoto=  (req,res)=>{
    const id= req.params.Gid;
    const photoID=req.params.Pid
  Galery.findById(id).then((gal)=>{

      if(gal!=null){
        Galery.findByIdAndUpdate(id,{
            $pullAll: {
                photos: [photoID]
            }
        },{new:true}).then(()=> res.json({status:200}))
        .catch((e)=>{
            res.json({status:400})
        })
      }
  }).catch((e)=>{
        res.json({status:404})
    })
}

const deleteGalery=  (req,res)=>{
    Galery.findById(req.params.id).then((gal)=>{
      gal.remove().then(()=>{
          res.json({status:200})
      })
    })
      .catch((e)=>{
          res.json({status:404})
      })
  }

module.exports = {
    addPhoto,
    getGalery,
    deletePhoto,
    deleteGalery
}