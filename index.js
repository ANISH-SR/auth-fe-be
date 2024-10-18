const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "anishlikestoskii";
const PORT = 3000;

const app = express();

app.use(express.json());

const users = [];

function logger(req,res,next){
    console.log(req.method + " request came");
    next();
}

app.post("/signup",logger, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username === username);

    if (user) {
        res.json({
            message: "Account already exists."
        })
    }
    users.push({
        username: username,
        password: password
    });

    res.json({
        message: "You are signed up"
    })

})

app.post("/signin",logger, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user_exists = users.find(u => u.username === username && u.password === password);

    if (user_exists) {

        const token = jwt.sign({
            username: username,
        }, JWT_SECRET);

        res.json({
            token: token
        });

    }
    else {
        res.json({
            message: "Credentials are incorrect"
        })
    }

})

function auth(req,res,next){
    const token = req.headers.token;
    const decoded_info = jwt.verify(token, JWT_SECRET);

    if(decoded_info.username) {
        req.username = decoded_info.username;

        next();
    }
    else{
        res.json({
            message:"You are not logged in"
        })
    }
}


app.get("/me", logger, auth ,(req, res) => {
    const found_user = users.find(u => u.username === req.username);          //we modified the req object in the auth middleware above

    if (found_user) {
        res.json({
            username: found_user.username,
            password: found_user.password
        });
    }
    else {
        res.json({
            message: "Token invalid"
        })
    }
})

app.listen(PORT, () => {
    console.log(`Currently up and running on ${PORT}.`);
});