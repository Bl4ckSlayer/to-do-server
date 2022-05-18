const express = require("express");
const cors = require("cors");
require("dotenv").config();
const port = process.env.PORT || 8000;
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();

app.use(cors());
app.use(express.json());

// ToDoUser
// ZpaX4coZLUZ5v6Xg

const uri =
  "mongodb+srv://ToDoUser:ZpaX4coZLUZ5v6Xg@cluster0.5g1lk.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});
async function run() {
  try {
    console.log("DB Connected..");
    await client.connect();
    const tasksCollection = client.db("ToDo").collection("tasks");

    app.get("/task", async (req, res) => {
      const query = {};
      const cursor = tasksCollection.find(query);
      const tasks = await cursor.toArray();
      res.send(tasks);
    });

    app.post("/task", async (req, res) => {
      const task = req.body;
      const result = await tasksCollection.insertOne(task);
      res.send(result);
    });

    app.put("/task/:id", async (req, res) => {
      const id = req.params.id;
      const updatedTask = req.body;
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };
      const updatedDoc = {
        $set: {
          name: updatedTask.name,
          description: updatedTask.description,
          completed: updatedTask.completed,
        },
      };
      const result = await tasksCollection.updateOne(
        filter,
        updatedDoc,
        options
      );
      res.send(result);
    });

    app.delete("/task/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await tasksCollection.deleteOne(query);
      res.send(result);
    });
  } finally {
    // console.log('gg');
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Server Is Running..");
});

app.listen(port, () => {
  console.log("Listening..");
});
