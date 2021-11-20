const { CustomError } = require("../helpers/error");

const errorHandlerMiddleWare = (err,req,res,next) => {
   console.log(err);
   if (err instanceof CustomError) {
      return res.status(err.statusCode).json({msg: err.message});
   }
   return res.status(500).json({msg: err});
};
module.exports = errorHandlerMiddleWare;