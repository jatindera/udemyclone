import express from 'express';
import cors from 'cors';
import { readdirSync } from 'fs';
const morgan = require('morgan');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
import csrf from 'csurf';
import cookieParser from 'cookie-parser';

const csrfProtection = csrf({ cookie: true });
const app = express();

// connect to mongodb
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}
).catch(err => {
    console.log('Error connecting to MongoDB: ', err.message);
}
);


// apply middleware
const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: false
}
app.use(cors(corsOptions));
app.use(express.json())
app.use(morgan('dev'));
// custom middleware with next()
app.use((req, res, next) => {
    console.log('This is a custom middleware');
    next();
}
);
app.use(cookieParser());
// CSRF protection
app.use(csrfProtection);

// routes
readdirSync('./routes').forEach(file => {
    const route = require(`./routes/${file}`);
    app.use("/api", route);
}
);


app.get('/api/csrfToken', (req, res) => {
    res.json({ csrfToken: req.csrfToken() });
}
);



// port
const port = process.env.PORT || 8000;

// start server
app.listen(port, () => {
    console.log(`Server started on port ${port}`);
}
);