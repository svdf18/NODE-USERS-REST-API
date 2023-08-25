import express from "express";
import fs from "fs/promises";
import cors from "cors";

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

app.get("/users", async (request, response) => {
  const users = await readDataFromFile();
  const sortedUsers = sortUsersByName(users);
  console.log(sortedUsers);
  response.json(sortedUsers);
});

app.post("/users", async (request, response) => {
  const newUser = { ...request.body, id: new Date().getTime() };

  const users = await readDataFromFile();
  users.push(newUser);

  await writeDataToFile(users);
  console.log(newUser);
  response.json(users);
});

app.put("/users/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const users = await readDataFromFile();

  const userToUpdate = users.find(user => user.id === id);
  const body = request.body;
  console.log(body);

  Object.assign(userToUpdate, body);
  
  await writeDataToFile(users);
  response.json(users);
});

app.delete("/users/:id", async (request, response) => {
  const id = parseInt(request.params.id);
  const users = await readDataFromFile();

  const newUsers = users.filter(user => user.id !== id);
  await writeDataToFile(newUsers);

  response.json(newUsers);
});

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