const express = require("express");
const userRouter = require("./routers/user");
const infoRouter = require("./routers/info");
const connectdb = require("./config/db");

// connect to database
connectdb();

const app = express();
app.use(express.json());
app.use(userRouter);
app.use(infoRouter);

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`server started on port ${port}`));
