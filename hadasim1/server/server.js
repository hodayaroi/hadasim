const mongoose = require("mongoose");
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const PORT = 5000
const app = express();

// Apply body-parser middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Import controller function
const { newClient,deleteClientrById,updateClientById,getClientById, getAllClient } = require('./controllers/controller');
const { createCovid19Record,getAllCovid19Records}= require('./controllers/controllersCovud19')
// Define route for creating new client
app.post('/Client/newClient', newClient);
app.delete('/Client/deleteClient/:id', deleteClientrById);
app.put('/Client/updateClient',updateClientById)
app.get('/Client/getClient/:id',getClientById)
app.get('/Client/getClient',getAllClient)
app.post('/Covid19/newVaccination', createCovid19Record);
app.get('/Covid19/getCovid19',getAllCovid19Records)

// Define default route
app.get('/', (req, res) => {
    res.send('Hello from the server!');
});

// Connect to MongoDB
mongoose.connect(
    "mongodb+srv://hodayaroi:hr181201@cluster0.qds6shn.mongodb.net/test?retryWrites=true&w=majority"
)
.then(() => {
    console.log('Connected to MongoDB');
    // Start the server after successful connection
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})
.catch((err) => {
    console.error('Error connecting to MongoDB:', err);
});
