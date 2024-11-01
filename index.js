const express = require("express");
const jwt = require("jsonwebtoken");
const JWT_SECRET = "anishistrue"
const app = express();
const port = process.env.PORT || 3000;
const users = [];

app.use(express.json());


app.post("/signup", (req, res) => {
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

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user_found = users.find(u => u.username === username && u.password === password);

    if (user_found) {
        const token = jwt.sign({
            username
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


app.get("/me", (req, res) => {
    const token = req.headers.token;
    const decoded_data = jwt.verify(token, JWT_SECRET);
    const new_username = decoded_data.username;

    const foundUser = users.find(u => u.username === new_username);
    if (foundUser) {
        res.json({
            username: foundUser.username,
            password: foundUser.password
        })
    }
})

app.listen(port, () => {
    console.log(`The server is listening at ${port}`)
})

