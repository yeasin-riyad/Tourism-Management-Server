const express=require('express')
const cors=require('cors')

require('dotenv').config()

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app=express()
const port=process.env.PORT || 5001;

// app.use(cors({
//   origin:["http://localhost:5173/","https://tourism-management-21134.web.app/"]
// }))

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
    // await client.connect();
    const tourismManagement = client.db("tourismManagement")
    const tourismSpots=tourismManagement.collection("touristSpots")
    
    const Countries=tourismManagement.collection("Countries")

    app.get("/",async(req,res)=>{
      res.send("server is running")
    })
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
    app.get('/countries',async(req,res)=>{
      const data=Countries.find()
      const result=await data.toArray()
      res.send(result)
    })

    app.get('/specificCountrie/:countryName',async(req,res)=>{
      const name=req.params.countryName;
      const query={countryName:name}
      const cursor = tourismSpots.find(query);
      const result=await cursor.toArray()
      res.send(result)
    })
    app.get('/touristSpot/:id',async(req,res)=>{
      const id=req.params?.id
      const query={_id:new ObjectId(id)}
      const result= await tourismSpots.findOne(query)
      res.send(result)

    })

    app.put('/touristSpot/:id',async (req,res)=>{
      const id=req.params.id;
      const query={_id:new ObjectId(id)}
      const options = { upsert: true };
      const updateUser=req.body;
      const updateDoc = {
        $set: {
          Image:updateUser.Image,
          spotName:updateUser.spotName,
          countryName:updateUser.countryName,
          location:updateUser.location,
          description:updateUser.description,
          avgCost:updateUser.avgCost,
          season:updateUser.season,
          travelTime:updateUser.travelTime,
          email:updateUser.email,
          name:updateUser.name
          
        },
      };
      const result = await tourismSpots.updateOne( query, updateDoc, options);
      res.send(result)
      console.log(result)

    })

    app.get('/myList/:name',async(req,res)=>{
      const Name=req.params.name
      const query={name:Name}
      const cursor = tourismSpots.find(query);
      const result=await cursor.toArray()
      res.send(result)
    })

    app.delete('/deleteDocument/:id',async(req,res)=>{
      const id=req.params.id
      const query= {_id :new ObjectId(id)}
      const result = await tourismSpots.deleteOne(query);
      res.send(result)

    })
    
    
    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
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