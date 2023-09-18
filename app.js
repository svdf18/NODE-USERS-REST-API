import express, { response } from "express";
import fs from "fs/promises";
import cors from "cors";
import connection from "./database.js";
import { kMaxLength } from "buffer";

const app = express();
const port = 3333;

app.use(express.json());
app.use(cors());

app.listen(port, () => {
  console.log(`App running on http://localhost:${port}`);
});

function readDataFromFile() {
  return fs.readFile("data.json").then(data => JSON.parse(data));
}

function writeDataToFile(data) {
  return fs.writeFile("data.json", JSON.stringify(data));
}

function sortUsersByName(users) {
  return users.slice().sort((a, b) => a.name.localeCompare(b.name));
}

// GET //

// Get all users from MySQL //
app.get("/users", (req, res) => {
  const query = 'SELECT * FROM `users` ORDER BY `name`';
  connection.query(query, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' }); 
    } else {
      res.json(results); 
    }
  });
});

// Get single user by ID from MySQL //
app.get("/users/:id", (req, res) => {
  const id = req.params.id;
  const query = 'SELECT * FROM `users` WHERE id = ?';
  const values = [id];

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: 'An error occurred' });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: 'User not found' });
      } else {
        res.json(results[0]);
      }
    }
  });
});

//using json data//

// app.get("/users", async (request, response) => {
//   const users = await readDataFromFile();
//   const sortedUsers = sortUsersByName(users);
//   console.log(sortedUsers);
//   response.json(sortedUsers);
// });

// POST //

//Post a new user using mysql//

app.post("/users", (req, res) => {
  const user = req.body;
  const query = "INSERT INTO users(image, email, name, title) VALUES (?, ?, ?, ?);";
  const values = [user.image, user.email, user.name, user.title];

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.error("Error inserting user:", err);
      res.status(500).json({ error: "An error occurred while creating the user." });
    } else {
      res.json(results);
    }
  });
});

//using json data//

// app.post("/users", async (request, response) => {
//   const newUser = { ...request.body, id: new Date().getTime() };

//   const users = await readDataFromFile();
//   users.push(newUser);

//   await writeDataToFile(users);
//   console.log(newUser);
//   response.json(users);
// });

// UPDATE //

//Update a user using mysql//

app.put("/users/:id", (req, res) => {
  const id = req.params.id;
  const user = req.body;
  const query = "UPDATE users SET image=?, email=?, name=?, title=? WHERE id=?;";
  const values = [user.image, user.email, user.name, user.title, id];

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.error("Error updating user:", err);
      res.status(500).json({ error: "An error occurred while updating the user." });
    } else {
      if (results.affectedRows === 0) {
        res.status(404).json({ error: "User not found" });
      } else {
        res.json(results);
      }
    }
  });
});


//using json data//

// app.put("/users/:id", async (request, response) => {
//   const id = parseInt(request.params.id);
//   const users = await readDataFromFile();

//   const userToUpdate = users.find(user => user.id === id);
//   const body = request.body;
//   console.log(body);

//   Object.assign(userToUpdate, body);
  
//   await writeDataToFile(users);
//   response.json(users);
// });

// DELETE //

// Delete a user using mysql //

app.delete("/users/:id", (req, res) => {
  const id = req.params.id;
  const query = "DELETE FROM users WHERE id=?;";
  const values = [id];

  connection.query(query, values, (err, results, fields) => {
    if (err) {
      console.error("Error deleting user:", err);
    } else {
      res.json(results);
    }
  });
});

//using json//

// app.delete("/users/:id", async (request, response) => {
//   const id = parseInt(request.params.id);
//   const users = await readDataFromFile();

//   const newUsers = users.filter(user => user.id !== id);
//   await writeDataToFile(newUsers);

//   response.json(newUsers);
// });

/// BEFORE REFACTOR

// app.get("/", (request, response) => {
//   response.send("Hello World");
// });

// app.get("/test", (request, response) => {
//   response.send("This is a test")
// });

// app.get("/users", async (request, response) => {
//   const data = await fs.readFile("data.json");
//   const users = JSON.parse(data);
//   response.json(users);
// });

// app.post("/users", async (request, response) => {
//   const newUser = request.body;
//   newUser.id = new Date().getTime();

//   const data = await fs.readFile("data.json");
//   const users = JSON.parse(data);

//   users.push(newUser);
//   console.log(newUser);
//   fs.writeFile("data.json", JSON.stringify(users));
//   response.json(users);
// });

// app.put("/users/:id", async (request, response) => {
//   const id = parseInt(request.params.id);
//   console.log(id);

//   const data = await fs.readFile("data.json");
//   const users = JSON.parse(data);

//   let userToUpdate = users.find(user => user.id === id);
//   const body = request.body;
//   console.log(body);
//   userToUpdate.image = body.image;
//   userToUpdate.mail = body.mail;
//   userToUpdate.name = body.name;
//   userToUpdate.title = body.title;

//   fs.writeFile("data.json", JSON.stringify(users));
//   response.json(users);
// });

// app.delete("/users/:id", async (request, response) => {
//   const id = parseInt(request.params.id);
//   console.log(id);

//   const data = await fs.readFile("data.json");
//   const users = JSON.parse(data);

//   let newUsers = users.filter(user => user.id !== id);
//   fs.writeFile("data.json", JSON.stringify(newUsers));

//   response.json(users);
// });