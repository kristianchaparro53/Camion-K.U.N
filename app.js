const express = require('express')
const bodyParser = require('body-parser');
const app = express()
const dotenv = require("dotenv");
const path = require("path");
const cors = require('cors');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash')
const connectDb = require('./Database/connection');
// Routes
const routes = require("./routes/routes");
const routesDb = require("./routes/db.routes")

dotenv.config()
connectDb()

// Middlewares
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "src", "views"));
app.use(express.static(path.join(__dirname, 'src/public')));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(cors());
app.use(cookieParser());
app.use(session({
    secret:'keyboard car',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false}
}));
app.use(flash());

// Routes
app.use("/", routes);
app.use("/db", routesDb);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`server running on: http://localhost:${PORT}`)
})