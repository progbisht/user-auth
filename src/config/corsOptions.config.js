
const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000']

export const corsOptions = {
    origin : (origin, callback) => {
        if( allowedOrigins.indexOf(origin) !== -1 || !origin ){
            callback(null, true);
        }
        else {
            callback(new Error("Not Allowed by CORS"));
        }
    },
    credentials: true,
    optionsSuccessStatus : 200
}

