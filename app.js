const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const rateLimit = require("express-rate-limit");
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const hpp = require("hpp");
const cors = require("cors");
const compression = require("compression");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productRoutes");
const categoriesRouter = require("./routes/categoryRoutes");
const viewRouter = require("./routes/viewRoutes");
const panierRouter = require("./routes/panierRouter");
const orderRoute = require("./routes/orderRoute");

const app = express();

app.use(express.json({ limit: "10kb" }));

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) globale middlewares
app.use(morgan("dev"));
app.use(cookieParser());

//static pages
app.use(express.static(path.join(__dirname, "public")));

// test middlewear
app.use((req, res, next) => {
  next();
});

// CORS CONFIG
// app.use(function (req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Methods", "GET,PATCH,DELETE,POST");
//   res.header("Access-Control-Allow-Headers", "*");
//   res.header("Access-Control-Allow-Credentials", "true");
//   next();
// });

app.use(compression());

app.use(cors());

// // security modules
app.use(helmet());

// // limit request from same API
// const limiter = rateLimit({
//   max: 100,
//   windowMs: 60 * 60 * 1000,
//   message: "too many requests from this IP please try again in an hour!",
// });
// app.use("/api", limiter);

// // data sanitization against NoSQL query injection
// app.use(mongoSanitize());
// // data sanitization XSS
// app.use(xss());
// //prevent parameter pollution
// app.use(
//   hpp({
//     whitelist: [
//       "duration",
//       "ratingsQuantity",
//       "ratingsAverage",
//       "maxGroupSize",
//       "difficulty",
//       "price",
//     ],
//   })
// );

// 2) routes
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoriesRouter);
app.use("/api/v1/cart", panierRouter);
app.use("/api/v1/order", orderRoute);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
