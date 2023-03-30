require("dotenv").config();
const express = require("express");

const exceptionHandler = require('express-exception-handler')
exceptionHandler.handle()
const error = require('./middleware/error')

const bodyParser = require("body-parser");
const logger = require('pino')()


let server



console.log(`NODE_ENV=${process.env.NODE_ENV}`);


// const adminRoutes = require("./routes/admin.routes");
const messageRoutes2 = require("./routes/message2.routes");

//new
const instanceRoutes = require('./routes/instance.route')
const messageRoutes = require('./routes/message.route')
const groupRoutes = require('./routes/group.route')

// const connectDB = require("./config/db.config");

const path = require("path");
const fileUpload = require('express-fileupload-temp-file');


//mongo DB
// connectDB();

global.WhatsAppInstances = {}
global.sessionLoadCompleted = false;

//express
const app = express();

app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));




// app.use(express.static(path.join(__dirname, 'public')));

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/json
app.use(bodyParser.json());

// parse requests of content-type: application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({
  extended: true
}));

// for parsing multipart/form-data


// app.use(express.static('public'));

// default options
app.use(fileUpload({
  useTempFiles: true,
  safeFileNames: true,
  preserveExtension: true,
  //tempFileDir : '/uploads/'
  tempFileDir: `${__dirname}/uploads`
}));


//cors support
var cors = require("cors");
app.use(cors()); 

app.get("/", (req, res) => {
  res.json({ message: "API running..." });
  // res.render('qrcode' , { qrcode: "API running..." });
});

app.use(error.handler)


// Connecting Routes
app.use("/api/auth", require("./routes/auth.routes"));

app.use("/api/message", messageRoutes2);


const router = express.Router()
// app.use("/api/admin", adminRoutes);
router.get('/status', (req, res) => res.send('OK'))
app.use('/api/instance', instanceRoutes)
app.use('/api/message2', messageRoutes)
app.use('/api/group', groupRoutes)


const messageController = require("./controllers/message2.controller");

app.use('/api/send', messageController.sendAPI2);


//start server
const PORT = process.env.PORT || 5000;
server = app.listen(PORT, () => logger.info(`Server running on port ${PORT}`));

const exitHandler = () => {
  if (server) {
      server.close(() => {
          logger.info('Server closed')
          process.exit(1)
      })
  } else {
      process.exit(1)
  }
}

const unexpectedErrorHandler = (error) => {
  logger.error(error)
  exitHandler()
}

process.on('uncaughtException', unexpectedErrorHandler)
process.on('unhandledRejection', unexpectedErrorHandler)

process.on('SIGTERM', () => {
  logger.info('SIGTERM received')
  if (server) {
      server.close()
  }
})

require('./cron');

module.exports = app


// git reset --hard HEAD
// git stash
// git pull
// git stash pop
// pm2 start npm --name "dbm" -- run prod

// pm2 start backend/server.js --name "server" --watch

// pm2 start admin --name "admin" --watch

// pm2 start user --name "user" --watch

// npm run

// pm2 start npm --name "user" -- run user


//pm2 start npm --name "user" -- run user
//pm2 start npm --name "server" -- run server
//pm2 start npm --name "admin" -- run admin

//pm2 start backend/server.js --name "server" --exp-backoff-restart-delay=1000 --max-memory-restart 300M
//pm2 save
//pm2 resurrect
