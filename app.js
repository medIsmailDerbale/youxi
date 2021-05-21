const path = require("path");
const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productRoutes");
const categoriesRouter = require("./routes/categoryRoutes");
const viewRouter = require("./routes/viewRoutes");

const app = express();

app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// 1) globale middlewares
app.use(morgan("dev"));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

//static pages
app.use(express.static(path.join(__dirname, "public")));

// test middlewear
app.use((req, res, next) => {
  next();
});
// 2) routes
app.use("/", viewRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoriesRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
