const express = require("express");

const jwt = require("jsonwebtoken");
const JWT_SECRET = "anishistrue"

const app = express();
const port = process.env.PORT || 3000;

const users = [];

app.use(express.json());

function logger(req,res,next){
    console.log(`${req.method} request came`);
    next();
}
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/index.html");

})

app.post("/signup", logger, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = users.find(u => u.username === username);

    if (user) {
        res.json({
            message: "The username already exists"
        })
    }
    else {
        users.push({
            "username": username,
            "password": password
        })

        res.json({
            message: "You are signed up"
        })

    }

    console.log(users);
})

app.post("/signin",logger, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user_found = users.find(u => u.username === username && u.password === password);

    if (user_found) {
        const token = jwt.sign({
            username: user_found.username,
        }, JWT_SECRET)

        res.json({
            token: token
        })
    }

    else {
        res.json({
            message: "Sorry, Incorrect Credentials"
        })
    }

})

function auth(req,res,next){
    const token = req.headers.token;
    const decoded_data = jwt.verify(token, JWT_SECRET);

    if(decoded_data.username){
        req.username = decoded_data.username;
        next();
    }else{
        res.json({
            message: "You are not logged in"
        })
    }
}

app.get("/me", logger, auth, (req, res) => {

    const current_user = req.username;
    const foundUser = users.find(u => u.username === current_user);
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
})

app.listen(port, () => {
    console.log(`The server is listening at ${port}`)
})
