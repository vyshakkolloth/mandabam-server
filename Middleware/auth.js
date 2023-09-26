const jwt =require( 'jsonwebtoken')


module.exports.adminProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
   
    if (!token) {
      res.send({ auth: false, status: "failed", message: "You need token" });
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log(err);
          res.json({
            auth: false,
            status: "failed",
            message: "failed to authenticate",
          });
        } else {
          // console.log(decoded);
          req.adminId = decoded.adminID;
          
          next();
        }
      });
    }
  } catch (error) {
    res.json({ auth: false, status: "failed", message: error.message });
  }
};
module.exports.venueProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.send({ auth: false, status: "failed", message: "You need token" });
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          // console.log(err);
          res.json({
            auth: false,
            status: "failed",
            message: "failed to authenticate",
          });
        } else {
          // console.log(decoded)
          req.Venue_id = decoded.UserId;
          next();
        }
      });
    }
  } catch (error) {
    res.json({ auth: false, status: "failed", message: error.message });
  }
};

module.exports.userProtect = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).send({ auth: false, status: "failed", message: "You need token" });
    } else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          console.log(err);
          res.json({
            auth: false,
            status: "failed",
            message: "failed to authenticate",
          })
        } else {
          // console.log(decoded)
          req.userId = decoded.User;
          next();
        }
      });
    }
  } catch (error) {
    res.json({ auth: false, status: "failed", message: error.message });
  }
};
