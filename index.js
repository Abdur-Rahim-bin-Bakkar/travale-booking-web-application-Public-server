const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);
const dotenv = require("dotenv")
dotenv.config()

const express = require('express')
const app = express()
const cors = require("cors")
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

app.use(express.json())
app.use(cors())

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
app.get('/', (req, res) => {
    res.send('Hello World!')
})
let dbCollection = null;
let bookingCollection = null;
async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const db = client.db('wanderlust')
        dbCollection = db.collection('destinations')
        bookingCollection = db.collection('bookings')



        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
        console.error(error);
    }
}
run()
app.get('/destination', async(req, res) => {
    const data = await dbCollection.find().toArray()
    // console.log(data)

    res.send(data)
    // console.log('get hocche')

})
app.get('/destination/:id', async(req, res) => {
    const id = req.params.id;
    const data = await dbCollection.findOne({_id:new ObjectId(id)})
    // console.log(data)

    res.send(data)
    // console.log('get hocche')

})
app.patch('/destination/:id',async(req,res)=>{
    const id = req.params.id;
    console.log(id)
    const result = await dbCollection.updateOne( {_id: new ObjectId(id)},{$set:req.body})
    res.send(result)
    // console.log('hit hocche')
})
app.delete('/destination/:id',async(req,res)=>{
    const id = req.params.id;
    const result = await dbCollection.deleteOne({_id:new ObjectId(id)})
    res.send(result)
    console.log('delete hocche')
})
app.post('/destination',async (req, res) => {
    const newDestination = req.body;
    const result = await dbCollection.insertOne(newDestination)
    res.send(result)
    // console.log(result, 'result hocche')

})
app.post('/booking', async(req,res)=>{
    const newBooking = req.body;
    const result = await bookingCollection.insertOne(newBooking)
    res.send(result)
})

app.listen(port, () => {
    console.log(`server is running on port ${port}`)
})