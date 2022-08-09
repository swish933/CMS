const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const debug = require('debug')('app');
const chalk = require('chalk');
const morgan = require('morgan');
const passport = require('passport');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const fileUpload = require('express-fileupload');
const { globalVariables } = require('./config/configuration');
const expressLayouts = require('express-ejs-layouts');

require('dotenv').config();
const PORT = process.env.PORT || 3000;
const DB_URL = process.env.DB_URL;
const SECRET = process.env.SECRET;
const app = express();

app.set('view engine', 'ejs');
app.use(expressLayouts);
app.set('layout', 'layouts/dashboard');

app.use(methodOverride('_method'));
app.use(morgan('tiny'));
app.use(fileUpload());
app.use(express.json());
app.use(
	express.urlencoded({
		extended: false,
	})
);

// required for passport
require('./config/passport')(passport);

app.use(
	session({
		// secret for session
		secret: 'secretKey',
		saveUninitialized: false,
		resave: false,
		//store session on MongoDB using express-session + connect-mongo
		store: new MongoStore({
			url: DB_URL,
			collection: 'sessions',
		}),
	})
);

app.use(express.static(path.join(__dirname, 'public')));

// Init passport authentication
app.use(passport.initialize());
// persistent login sessions
app.use(passport.session());
// flash messages
app.use(flash());
app.use(globalVariables);

// Connect to MongoDB
mongoose
	.connect(DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => console.log('MongoDB successfully connected'))
	.catch((err) => debug(err));

const authRouter = require('./routes/authRouter');
const newsRouter = require('./routes/newsRouter');
const bannerRouter = require('./routes/bannerRouter');
const logoRouter = require('./routes/logoRouter');
const mediaRouter = require('./routes/mediaRouter');
const publishRouter = require('./routes/publishRouter');

app.use('/', authRouter);
app.use('/news', newsRouter);
app.use('/banner', bannerRouter);
app.use('/logo', logoRouter);
app.use('/media', mediaRouter);
app.use('/publish', publishRouter);

app.listen(PORT, () => {
	debug(`App listening on port ${chalk.green(PORT)}`);
});
