const { loadNuxt, build } = require("nuxt");
const express = require("express");

const app = express();
require("dotenv").config();
const isDev = process.env.NODE_ENV !== "production";
const serverport = process.env.PORT || 3000;
const cors = require("cors");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const host = process.env.DBHOST;
const database = process.env.DBNAME;
const user = process.env.DBUSER;
const port = process.env.DBPORT;
const password = process.env.DBPASS;

const mongoose = require("mongoose");

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.connection.on("error", error => console.log(error));
mongoose.Promise = global.Promise;

if (process.env.DOMAIN == "macbook.local") {
  mongoose.set("debug", true);
}

const options = {
  host,
  port,
  user,
  password,
  database
};
//const MySQLStore = require('express-mysql-session')(session);
//const sessionStore = new MySQLStore(options);

var MongoDBStore = require("connect-mongodb-session")(session);

var store = new MongoDBStore({
  uri: process.env.MONGO_URL,
  collection: "sessions"
});

app.set("trust proxy", 1); // trust first proxy
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    proxy: true,
    resave: true,
    store,
    saveUninitialized: true,
    cookie: { secure: true }
  })
);

/*
function rawBody(req, res, next) {
	req.setEncoding('utf8');

	var data = '';

	req.on('data', function (chunk) {
		data += chunk;
	});

	req.on('end', function () {
		req.rawBody = data;

		next();
	});
}
app.use(rawBody);
*/
app.disable("x-powered-by");

function verifyRequest(req, res, buf, encoding) {
  // The raw body is contained in 'buf'
  console.log("I AM VERIFYING ");
  //console.log(buf.toString(encoding));
  req.rawBody = buf.toString(encoding);
}
app.use(
  express.json({
    limit: "32mb",
    verify: verifyRequest
  })
);
app.use(cookieParser());

app.use(express.urlencoded({ extended: true, verify: verifyRequest }));
app.use(cors());

var compression = require("compression");

app.use(compression());

app.use("/", require("./backend"));

async function start() {
  // We get Nuxt instance
  const nuxt = await loadNuxt(isDev ? "dev" : "start");

  // Render every route with Nuxt.js
  app.use(nuxt.render);

  // Build only in dev mode with hot-reloading
  if (isDev) {
    build(nuxt);
  }
  // Listen the server
  app.listen(serverport, "0.0.0.0");
  console.log("Server listening on `localhost:" + serverport + "`.");
}

start();
