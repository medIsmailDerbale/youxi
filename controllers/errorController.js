const AppError = require("../utils/appError");

const handleExpiredTokenError = (err) => {
  return new AppError("token expired please login again", 401);
};

const handleJsonWebTokenError = (err) => {
  return new AppError("Invalid token please login again", 401);
};

const handleValidationErrorDB = (err) => {
  const value = Object.values(err.errors).map((el) => el.properties.message);
  const message = `ivalid input data. ${value.join(". ")}`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate Field value: "${value}" please use another one`;
  return new AppError(message, 500);
};

const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}:${err.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProduction = (err, res) => {
  //operational error ,trusted we send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //Programming error we keep it to devs
  else {
    // 1) log the error
    console.error("ERROR 🤷‍♂️", err);
    // 2= send generic error
    res.status(500).json({
      status: "error",
      message: "something went wrong",
    });
  }
};

module.exports = (err, req, res, next) => {
  // console.log(err.stack);
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "production") {
    // eslint-disable-next-line node/no-unsupported-features/es-syntax
    let error = { ...err };

    if (error._message === "Validation failed")
      error = handleValidationErrorDB(error);

    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.kind === "ObjectId") error = handleCastErrorDB(error);
    if (error.name === "JsonWebTokenError")
      error = handleJsonWebTokenError(error);
    if (error.name === "TokenExpiredError")
      error = handleExpiredTokenError(error);
    // send error
    sendErrorDev(err, res);
  }
};
