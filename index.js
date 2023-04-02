const express = require("express")
const cors = require("cors")
require("dotenv").config();
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000;
const app = express();
const { MongoClient, ServerApiVersion } = require('mongodb');

// middle wares : 
app.use(cors());
app.use(express.json());

app.listen(port, () => {
    console.log(`This server running port on ${port}`);
})

const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASSWORD;

const uri = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.wfsi327.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function dbConnection() {
    try {
        await client.connect()
        console.log("Database connect")
    } catch (error) {
        console.log(error.name, error.message)
    }
}

dbConnection()

const Users = client.db("countriesist").collection("Users");

app.post('/addUser', async (req, res) => {
    try {
        const userData = req.body;
        const email = userData.email;
        const isAdded = await Users.findOne({ email: email })
        if (isAdded) {
            res.send({
                success: false,
                message: "User already added"
            })
        } else {
            const data = await Users.insertOne(userData)
            if (data.acknowledged) {
                res.send({
                    success: true,
                    message: "Successfully added the user"
                })
            } else {
                res.send({
                    success: false,
                    message: "Couldn't added the user"
                })
            }
        }
    } catch (error) {
        console.log(error.name, error.message)
        res.send({
            success: false,
            message: error.message
        })
    }
})