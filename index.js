const express=require('express')
const cors=require('cors')
require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express()
const port=process.env.PORT || 5001;

app.use(cors())
app.use(express.json())





const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.gx2sshg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

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
    await client.connect();
    const tourismManagement = client.db("tourismManagement")
    const tourismSpots=tourismManagement.collection("touristSpots")
    app.post('/touristSpot',async(req,res)=>{
      const touristSpot=req.body;
      const result = await tourismSpots.insertOne(touristSpot);
      res.send(result)
      console.log(result)


    })
    app.get('/touristSpot',async(req,res)=>{
     
      const data=tourismSpots.find()
      const result=await data.toArray()
   
      res.send(result)

    })
    app.get('/touristSpot/:id',async(req,res)=>{
      const id=req.params.id
      const query={_id:new ObjectId(id)}
      const result= await tourismSpots.findOne(query)
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




app.listen(port,()=>{
    console.log(`Simple crud is running on port ${port} `)
})