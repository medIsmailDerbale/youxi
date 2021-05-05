const express = require("express");
const morgan = require("morgan");

const AppError = require("./utils/appError");
const globalErrorHandler = require("./controllers/errorController");
const userRouter = require("./routes/userRoutes");
const productsRouter = require("./routes/productRoutes");
const categoriesRouter = require("./routes/categoryRoutes");

const app = express();

// 1) globale middlewares
app.use(morgan("dev"));

app.use(express.json({ limit: "10kb" }));

//static pages
// app.use(express.static(`${__dirname}/"static folder name"`));

// 2) routes
app.use("/api/v1/users", userRouter);
app.use("/api/v1/products", productsRouter);
app.use("/api/v1/categories", categoriesRouter);

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
