// Import the required modules
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();

const PORT = 3001;

app.use(express.json());

app.use(express.static(path.join(__dirname, "public")));

const dataFilePath = path.join(__dirname, "data.json");

const readData = () => {
  if (!fs.existsSync(dataFilePath)) {
    return [];
  }
  const data = fs.readFileSync(dataFilePath);
  return JSON.parse(data);
};

const writeData = (data) => {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
};

// Handle GET request at the root route
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.htm"));
});

// Handle GET request to retrieve stored data
app.get("/data", (req, res) => {
  const data = readData();
  res.json(data);
});

// Handle POST request to save new data with a unique ID
app.post("/data", (req, res) => {
  const newData = { id: Date.now().toString(), ...req.body };
  const currentData = readData();
  currentData.push(newData);
  writeData(currentData);
  res.json({ message: "Data saved successfully", data: newData });
});

// Handle POST request at the /echo route
app.post("/echo", (req, res) => {
  // Respond with the same data that was received in the request body
  res.json({ received: req.body });
});

// Handle PUT request to update data by ID
app.put("/data/:id", (req, res) => {
  const data = readData();
  const index = data.findIndex((item) => item.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({message: "Data not found"});
  }
  data[index] = { id: req.params.id, ...req.body };
  writeData(data);
  res.json({ message: "You've updated the data!", data: data[index]});
});

// Handle DELETE request to delete data by ID
app.delete("/data/:id", (req, res) => {
  const data = readData();
  const index = data.findIndex((item) => item.id === req.params.id);
  if (index === -1) {
    return res.status(404).json({ message: "Data not found" });
  }
  data.splice(index, 1);
  writeData(data);
  res.json({ message: "Data deleted successfully", data: deletedItem[0]});
});

// Wildcard route to handle undefined routes
app.all("*", (req, res) => {
  res.status(404).send("Route not found");
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
