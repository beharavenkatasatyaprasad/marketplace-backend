const express = require("express");
const app = express();
const bodyParser = require('body-parser');
const cors = require("cors");
const mongodb = require("mongodb");
const mongoClient = mongodb.MongoClient;
app.use(bodyParser.json());
app.options("*", cors());
app.use(cors());
const url = 'mongodb+srv://satya:O55CfaDpoJml36sU@cluster0.f4mtj.mongodb.net/voiz?retryWrites=true&w=majority';

mongoClient.connect(url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, function (err, db) {
    if (err) throw err;
    console.log("Database Connected!");
    db.close();
});

app.get("/", (req, res) => {
    res.send(`Hello from server`);
    res.end();
});

app.get("/getData", async (req, res) => {
    try {
        let client = await mongoClient.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        let db = client.db("voiz");
        let data = db.collection("data");
        data.find({}).toArray((err, result) => {
            if (err) throw err;
            if (result) {
                 res.status(202).json({
                    result
                })
            }
        })
    } catch (err) {
        console.log(err);
         res.status(500).json({
            message: 'Internal Server Error'
        });
    }
});

app.post("/postData", async (req, res) => {
    const {
        name,
        experience,
        description,
        qualification,
        age,
        gender,
        status,
        picture,
        email,
        mbl
    } = req.body;
    let validationErrors = []
    if (!name) {
        validationErrors.push('name field is required !!!')
    }
    if (!experience) {
        validationErrors.push('experience field is required !!!')
    }
    if (!description) {
        validationErrors.push('description field is required !!!')
    }
    if (!qualification) {
        validationErrors.push('qualification field is required !!!')
    }
    if (!gender) {
        validationErrors.push('gender field is required !!!')
    }
    if (!status) {
        validationErrors.push('status field is required !!!')
    }
    if (!email) {
        validationErrors.push('email field is required !!!')
    }
    if (!picture) {
        validationErrors.push('picture field is required !!!')
    }
    if (!age) {
        validationErrors.push('age field is required !!!')
    }
    if (!mbl) {
        validationErrors.push('mobile number field is required !!!')
    }
    if (validationErrors.length === 0) {
        try {
            let client = await mongoClient.connect(url, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            let db = client.db("voiz");
            let data = db.collection("data");
            data.insertOne({
                name: name,
                experience: experience,
                description: description,
                qualification: qualification,
                age: age,
                gender: gender,
                status: status,
                picture: picture,
                email: email,
                mbl: mbl
            }, (err, result) => {
                if (err) throw err;
                if (result) {
                    return res.status(202).json({
                        message: 'success'
                    });
                }
            });
        } catch (err) {
            console.log(err);
            res.status(500).json({
                message: 'Internal Server Error'
            });
        }
    }else{
        res.status(404).json({
            message: validationErrors
        });
    }
});

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on port ${port} 🔥`));
