
const express = require('express')
const { MongoClient } = require('mongodb');
const cors=require('cors');

const ObjectId=require('mongodb').ObjectId;
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.pszjp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
async function run() {
  try {
    await client.connect();
    const database = client.db("cycle");
    const userCollection = database.collection("user");
    const clientCollection = database.collection("client");
    const rivewCollection = database.collection("rivew");
    const loginCollection=database.collection("users");
  
   //get api
   app.get('/products',async (req,res)=>
   {
     const cursor=userCollection.find ({})
     const users=await cursor.toArray();
     res.send(users);
   })
   //load single item
   app.get('/products/:id', async (req,res)=>
   {
     const id =req.params.id;
     const query={_id: ObjectId(id)};
     const user =await userCollection.findOne(query);
     res.send(user);
   })
   //post in product collecion
   app.post('/products', async (req,res)=>
   {
     console.log('hi');
     const newUser = req.body;
     const result = await userCollection.insertOne(newUser);
      console.log('hitting the post',req.body);
      res.json(result);
   })

   app.delete('/products/:id' , async (req,res)=>
   {
     const id =req.params.id;
     const query ={_id : ObjectId(id)};
     const result =await userCollection.deleteOne(query);
     console.log(result);
     res.json(result);
     
   })


   //post api
   app.post('/rivew', async (req,res)=>
   {
     console.log('hi');
     const newUser = req.body;
     const result = await rivewCollection.insertOne(newUser);
      console.log('hitting the post',req.body);
      res.json(result);
   })
   //post api
   app.post('/client', async (req,res)=>
   {
     const newUser = req.body;
     const result = await clientCollection.insertOne(newUser);
      console.log('hitting the post',req.body);
      res.json(result);
   })
   app.put('/client/:id', async(req,res)=>
      {
        
        const id=req.params.id;
        
        const UpdateUser= req.body;
        const filter ={_id:ObjectId(id)};
        const option={upset:true}
        const updateDoc={
          $set:{
            
            status:'Shipped',
           

          },
        };
        const result= await clientCollection.updateOne(filter,updateDoc,option);
        res.send(result);
      })

      app.delete('/client/:id' , async (req,res)=>
      {
        const id =req.params.id;
        const query ={_id : ObjectId(id)};
        const result =await clientCollection.deleteOne(query);
        res.json(result);
        
      })

   //get reviw
   app.get('/rivew', async (req,res)=>
   {
    const cursor=rivewCollection.find ({})
     const users=await cursor.toArray();
     res.send(users);
   })
   //get users
   app.get('/users', async (req,res)=>
   {
    const cursor=loginCollection.find ({})
     const users=await cursor.toArray();
     res.send(users);
   })
   //get client order
   app.get('/client', async (req,res)=>
   {
    const cursor=clientCollection.find ({})
     const users=await cursor.toArray();
     res.send(users);
   })

   //get by email
   app.get('/client/:email' , async (req,res)=>
   {
     const userEmail =req.params.email;
     const query ={email:{$in :[userEmail]}};
   
     const result =await clientCollection.find(query).toArray();
     res.json(result);
     
   })
   //delete
   app.delete('/client/:id' , async (req,res)=>
   {
     const id =req.params.id;
     const query ={_id : ObjectId(id)};
     const result =await clientCollection.deleteOne(query);
     res.json(result);
     
   })


   //for users

   app.post('/users', async (req, res) => {
    const user = req.body;
    const result = await loginCollection.insertOne(user);
    //console.log(result);
    res.json(result);
});

app.put('/users', async (req, res) => {
    const user = req.body;
    const filter = { email: user.email };
    const options = { upsert: true };
    const updateDoc = { $set: user };
    const result = await loginCollection.updateOne(filter, updateDoc, options);
    res.json(result);
});

app.put('/users/admin', async (req,res)=>
{
  const user=req.body;
  const filter={email: user.email}
  const updateDoc={$set:{role:'admin'}};
  const result=await loginCollection.updateOne(filter,updateDoc);
  res.json(result);
})

app.get('/users/:email', async (req, res) => {
  const email = req.params.email;
  const query = { email: email };
  const user = await loginCollection.findOne(query);
  let isAdmin = false;
  if (user?.role === 'admin') {
      isAdmin = true;
  }
  res.json({ admin: isAdmin });
})

   

  

   

    //console.log(`A document was inserted with the _id: ${result.insertedId}`);
  } finally {
    //await client.close();
  }
}
run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`port is`,port)
})
//GlMujml9F8WJ0qFC
//commercial