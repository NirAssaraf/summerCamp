'use strict';
const Event = require('../models/event');
const Day = require('../models/day');

const createEvent =  (req, res) => {
const date= req.body.date;
var events=[Object];
events= req.body.events;
            Day.findOne({date}).then((day)=>{
                if(day != null){
                    events.forEach((one)=>{
                        var event = new Event({
                            discription:one.discription,
                            startTime:one.startTime,
                            endTime:one.endTime
                        });
                        event.save().then(newEvent=>{
                    Day.findByIdAndUpdate(day._id,{
                        $push: {
                            events:{
                                $each:[newEvent],
                                $position:0
                            } 
                        }
                    }).exec((err,docs)=>{

                    })
                })
            })
                }else{
                    const day= new Day({
                        date:date
                    });
                    day.save().then((day)=>{
                        events.forEach((one)=>{
                            var event = new Event({
                                discription:one.discription,
                                startTime:one.startTime,
                                endTime:one.endTime
                            });
                            event.save().then(newEvent=>{
                        Day.findByIdAndUpdate(day._id,{
                            $push: {
                                events:{
                                    $each:[newEvent],
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

 const deleteEvent=  (req,res)=>{
    const date= req.params.Did;
    const eventID=req.params.Eid
  Day.findById(date).then((day)=>{

      if(day!=null){
        Day.findByIdAndUpdate(date,{
            $pullAll: {
                events: [eventID]
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
const deleteDay=  (req,res)=>{
    Day.findById(req.params.id).then((day)=>{
      day.remove().then(()=>{
          res.json({status:200})
      })
    })
      .catch((e)=>{
          res.json({status:404})
      })
  }

  const getAllEvents =  (req, res) => {

    var myCurrentDate=new Date();
    var myPastDate=new Date(myCurrentDate);
        myPastDate.setDate(myPastDate.getDate()-1);
    Day.find({ "date" : { $gt: myPastDate } } ).populate('events').exec((err, docs)=>{
                if(err){
                    console.log("not ok");
                    return res.json({status: 404})
                }else{
                    docs.sort((a,b)=>a.date-b.date);
                   return res.json({status:200, day:docs})
                }
            });  
 
}


module.exports = {
    createEvent,
    getAllEvents,
    deleteEvent,
    deleteDay
}