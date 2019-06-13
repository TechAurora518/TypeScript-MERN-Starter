import express from "express";
import compression from "compression";
import session from "express-session";
import lusca from "lusca";
import mongo from "connect-mongo";
import mongoose from "mongoose";
import passport from "passport";
import expressValidator from "express-validator";
import bluebird from "bluebird";
import errorHandler from "errorhandler";
import { MONGODB_URI, SESSION_SECRET } from "./util/secrets";
import { Response, Request, NextFunction } from "express";
import oauth2 from "./routes/oauth2";
import auth from "./routes/auth";
import article from "./routes/article";

// API keys and Passport configuration
import "./config/passport-consumer";

// Connect to MongoDB
const MongoStore = mongo(session);
const mongoUrl: string = MONGODB_URI;
(<any>mongoose).Promise = bluebird;
mongoose.set("useNewUrlParser", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);
mongoose.connect(mongoUrl, { useNewUrlParser: true }).then(
    () => {
        console.log("  MongoDB is connected successfully.");
    },
).catch(err => {
    console.error("  MongoDB connection error. Please make sure MongoDB is running. " + err);
    process.exit();
});

// Express configuration
const app = express();
app.set("server_port", process.env.SERVER_PORT);
app.set("origin_uri", process.env.ORIGIN_URI);
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(expressValidator());
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    store: new MongoStore({
        url: mongoUrl,
        autoReconnect: true
    })
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(lusca.xframe("SAMEORIGIN"));
app.use(lusca.xssProtection(true));
app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log(`[${req.method} ${req.originalUrl}] is called, body is ${JSON.stringify(req.body)}`);
    next();
});
app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.user = req.user;
    next();
});
if (process.env.NODE_ENV === "development") {
    app.use(errorHandler());
}

// Server rendering configuration
if (process.env.NODE_ENV === "production") {
    app.use(
        express.static("./client/build", { maxAge: 31557600000 })
    );
    app.use((req: Request, res: Response, next: NextFunction) => {
        if (req.originalUrl.startsWith("/api") ||
            req.originalUrl.startsWith("/auth") ||
            req.originalUrl.startsWith("/oauth2")) {
            next();
        } else {
            const options = {
                root: "./client/build/",
                dotfiles: "deny",
                headers: {
                    "x-timestamp": Date.now(),
                    "x-sent": true
                }
            };

            const fileName = "index.html";
            res.sendFile(fileName, options, function (err) {
                if (err) {
                    next(err);
                } else {
                    console.log("Sent:", fileName);
                }
            });
        }
    });
}

// Primary app routes.
app.use("/auth", auth); // Auth client routes
app.use("/oauth2", oauth2); // OAuth2 server routes
app.use("/api/article", article); // Article related routes

export default app;