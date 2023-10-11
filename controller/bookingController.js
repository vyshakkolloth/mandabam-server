const Razorpay = require("razorpay");
const crypto = require("crypto");

const BookingModel = require("../Model/bookingModel");

const booking = async (req, res) => {
  try {
    const id = req?.userId;
    const { venueId, data } = req.body;
    const { name, email, guest, type, Phone, date, rooms, time } = data;
    //   console.log(req.body);

    //   const existingBooking =await BookingModel.findOne({venueId})
    //   console.log(existingBooking,"ee")
    //   if(existingBooking){
    // 	existingBooking.booking.push({
    // 		userId:id,
    // 		name,
    // 		email,
    // 		guest,
    // 		type,
    // 		Phone,
    // 		date,
    // 		room: rooms,
    // 		time,
    // 	  });
    // 	  const result=  await existingBooking.save();
    // 	console.log("already ther",result)
    //   }else{

    // 	await BookingModel.create({
    // 		venueId,

    // 		booking: [
    // 		  {
    // 			userId:id,
    // 			name,
    // 			email,
    // 			guest,
    // 			type,
    // 			Phone,
    // 			date,
    // 			room: rooms,
    // 			time,
    // 		  },
    // 		],
    // 	  });

    // 	console.log("new data added")
    //   }

    const result = await BookingModel.create({
      venueId,
      userId: id,
      name,
      email,
      guest,
      type,
      Phone,
      room: rooms,
      time,
      date,
    });
	if(result){
		res.json({ status: 200, message: "all good", auth: true });
	}else{
		res.json({ status: 200, message: "some error", auth: true });
	}


    
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error });
  }
};

const acceptEnquire = async (req, res) => {
  try {
    const { id, amount } = req.body.data;
    const result = await BookingModel.findByIdAndUpdate(id, {
      $set: { status: true, amount: amount },
    });

    // console.log(id,amount,"accept")
    if (result) {
      console.log("erer");
      res.status(200).json({ message: "accepted" });
    } else {
      res.status(203).json({ message: "non authority informaion" });
    }
  } catch (error) {
    console.log(error, "accept error");
    res.status(500).json({ message: "server error accept Enquire", error });
  }
};
const paymentCreate = async (req, res) => {
  // console.log(req.body.data,"dfdfdf")
  // res.status(200).json({message:"dfdfdf"})
  try {
    const instance = new Razorpay({
      key_id: process.env.RAZO,
      key_secret: process.env.RAZOKEY,
    });

    const options = {
      amount: req.body?.data.amount * 100,
      currency: "INR",
      receipt: crypto.randomBytes(10).toString("hex"),
    };

    instance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error), "1st";
        return res.status(500).json({ message: "Something Went Wrong!" });
      }
      res.status(200).json({ data: order });
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};

const paymentVerify = async (req, res) => {
  try {
    // console.log("hello")
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body.data;
    const { id } = req.body;
    console.log(id);
    const sign = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac("sha256", process.env.RAZOKEY)
      .update(sign.toString())
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      await BookingModel.findByIdAndUpdate(id, {
        $set: { payment: true, paymentId: razorpay_payment_id },
      });

      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(error);
  }
};
const bookedVenue = async (req, res) => {
  try {
    const id = req?.userId;
    const data = await BookingModel.find({ userId: id, payment: true })
      .populate({
        path: "venueId",
        select: "name image", // Replace fieldName1 and fieldName2 with the actual fields you want to retrieve
      })
      .exec();
    if (data) {
      res.status(200).json({ message: "data found", data });
    } else {
      res.status(203).json({ message: "no data" });
    }
  } catch (err) {
    res.status(500).json({ message: "Internal Server Error!" });
    console.log(err);
  }
};

module.exports = {
  booking,
  bookedVenue,
  acceptEnquire,
  paymentCreate,
  paymentVerify,
};
