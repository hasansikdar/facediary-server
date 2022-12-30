const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion } = require('mongodb');


// middleware
app.use(cors());
app.use(express.json())



const uri = `mongodb+srv://${process.env.USER_NAME}:${process.env.USER_PASSWORD}@cluster0.i9b8vs8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        const users = client.db('faceDiary').collection('users');
        const posts = client.db('faceDiary').collection('posts');
        app.post('/users', async (req, res) => {
            const userinfo = req.body;
            const result = await users.insertOne(userinfo);
            res.send(result);
        })
        app.put('/users', async (req, res) => {
            const email = req.query.email;
            const udpateinfo = req.body;
            const Name = udpateinfo?.name;
            const ProfileImage = udpateinfo?.profileImage;

            const filter = { email: email }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    name: Name,
                    profileImage: ProfileImage,
                }
            }
            const result = await users.updateOne(filter, updateDoc, options)
            res.send(result);
            console.log(Name, ProfileImage)
        })
        app.put('/users', async (req, res) => {
            const email = req.query.email;
            const filter = {email: email}
            console.log(email);
            const userinfo = req.body;
            const options = { upsert: true }
            const updateDoc = {
                $set: {
                    name: userinfo?.name,
                    email: userinfo?.email,
                }
            }
            const result = await users.updateOne(filter, updateDoc, options)
            res.send(result);
        })

        // post collection
        app.post('/posts', async(req, res) => {
            const postContent = req.body;
            const result = await posts.insertOne(postContent);
            res.send(result);
        })

        // post get
        app.get('/posts', async(req, res) => {
            const result = await posts.find().toArray();
            res.send(result);
        })


    }
    finally { }

}
run().catch(error => console.log(error))


app.get('/', (req, res) => {
    res.send('facediary is server is running...')
})

app.listen(port, (req, res) => {
    console.log('facediary server is running...');
})