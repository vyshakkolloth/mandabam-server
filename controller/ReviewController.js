const ReviewModel= require("../Model/reviewModal")

const postReview= async(req,res)=>{
    try {
        // console.log(req.body.data)
        const id=  req?.userId
        const{venueid,rating,reviewText,spending}=req.body.data

        const check= await ReviewModel.findOne({venueId:venueid})
        console.log(check,"565")
        if(check){
            check.reviews.push({
                userid: req?.userId, // Assuming you have userId in the request
                rating:rating,
                text: reviewText,
                amount: spending,
            })
           const result= await check.save()
        //    console.log(result,"4545");
        res.status(200).json({message:"data fine"})

        }else{
            const newReviewDocument = new ReviewModel({
                venueId: venueid,
                reviews: [
                  {
                    userid: id,
                    rating: rating, // Add other fields as needed
                    text: reviewText,
                    amount: spending,
                  },
                ],
              });
              const result = await newReviewDocument.save();
            // await ReviewModel.create({userid:id,venueId:venueid,text:reviewText,amount:spending})

            res.status(200).json({message:"data fine"})
        }
        
       
        
    } catch (error) {
        res.status(500).json({message:"server Eroor",error})
        console.log(error)
        
    }
}

const getReview= async(req,res)=>{
    try {
        // console.log(req.params)
        const id=req.params.id
        if(id){
            const result=await ReviewModel.findOne({venueId:id}).populate({path:"reviews.userid",select:"name photo"}).exec();
            // console.log(result)
            res.status(200).json({message:"hello",result})
        }else{
            res.status(404).json({message:"requset page not found"})
        }

        
        
    } catch (error) {
        res.status(500).json({message:"server Eroor",error})
        console.log(error)
        
    }
}
module.exports={postReview,getReview}