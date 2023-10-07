const ReportModule = require("../Model/ReportModel")


const postReport= async(req,res)=>{
    try {
        const id=  req?.userId
        // console.log(id,"hgh")
        const {text,venueid}=req.body.data
        const check= await ReportModule.findOne({venueId:venueid})
        if(check){
            check.Report.push({
                userid: req?.userId, // Assuming you have userId in the request
               
                text: text,
               
            })
           const result= await check.save()
        //    console.log(result,"4545");
        res.status(200).json({message:"data fine"})
    }else{
        const newReviewDocument = new ReportModule({
            venueId: venueid,
            Report: [
              {
                userid: id,
               
                text: text,
              
              },
            ],
          });
          const result = await newReviewDocument.save();
          return res.status(200).json({message:"data fine"})
        }
        




        
    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server error"})
    }
}


// admin report details
const getReports= async(req,res)=>{

    try {
        const result=await ReportModule.find().populate({path: "venueId",select: "name location type email mobile image"// Replace fieldName1 and fieldName2 with the actual fields you want to retrieve
}).populate('Report.userid', ['username', 'email']).exec();
        if(result){
            res.status(200).json({message:"data",result})
              
        }else{
            res.status(202).json({message:"not good"})
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({message:"server Error"})
    }
}

module.exports={
    postReport,getReports
}