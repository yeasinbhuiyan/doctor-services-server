const express = require('express');
const cors = require('cors');
const app = express()
require('dotenv').config()
const port = process.env.PORT || 5000


app.use(cors())
app.use(express.json())





const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.9xgdj4e.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db("doctorServices");
        const servicesCollection = database.collection("services");

        app.get('/services', async (req, res) => {

            const allServices = servicesCollection.find()
            const result = await allServices.toArray()
            res.send(result)


        })

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = {
                projection: { service_name: 1, service_price: 1, image_url: 1 },
            };
            const result = await servicesCollection.findOne(filter, options)
            res.send(result)

        })
















        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);




app.get('/', (req, res) => {

    res.send('this is doctors service server')
})

app.listen(port, () => {
    console.log(`This server running on ${port} port`)

})