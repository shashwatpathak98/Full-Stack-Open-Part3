const express = require("express");
const morgan = require("morgan");

const app = express();

app.use(express.json());
app.use(morgan('tiny'))

let phoneBook = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.post("/api/persons", (request, response) => {
  const body = request.body;
  if (!body.name) {
    return response.status(400).json({ error: "Person name is missing" });
  }
  if (!body.number) {
    return response.status(400).json({ error: "Person number is missing" });
  }

  const duplicateName = phoneBook.find((detail) => detail.name === body.name);
  if (duplicateName) {
    return response
      .status(400)
      .json({ error: `${body.name} already exists , name must be unique` });
  }

  const person = {
    id: Number(Math.floor(Math.random() * 100000)),
    name: body.name,
    number: body.number,
  };

  phoneBook = phoneBook.concat(person);
  response.json(person);
});

app.get("/", (request, response) => {
  response.send("<h1>Phoneboook</h1>");
});

app.get("/api/persons", (request, response) => {
  response.json(phoneBook);
});

app.get("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const phoneDetail = phoneBook.find((info) => info.id === id);

  if (phoneDetail) {
    response.json(phoneDetail);
  } else {
    response.json({ error: "Not found 404" });
  }
});

app.get("/info", (request, response) => {
  response.send(`<p>Phonebook has info for ${phoneBook.length} people </p> <p>
      ${new Date().toString()}`);
});

app.delete("/api/persons/:id", (request, response) => {
  const id = Number(request.params.id);
  const toDelete = phoneBook.find((person) => person.id === id);

  if (toDelete) {
    phoneBook = phoneBook.filter((per) => per.id !== id);
    response.json({ sucess: `${id} deleted` });
  } else {
    response.json({ error: "Person not found" });
  }
});

const PORT = 3023;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
