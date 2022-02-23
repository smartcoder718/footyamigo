const mongoose = require("mongoose");
const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", error => console.log(error));
mongoose.Promise = global.Promise;
