// controller.js

// Assuming you have a User model defined using Mongoose
const Client = require('../models/Client');
const User = require('../models/Client');

async function newClient(req, res) {
    try {
        // Extracting data from request body
        console.log(req.body)
        const { name, lastName,id, address, date, phone, mobilePhone } = req.body;

        const newClient = new User({
            name,
            lastName,
            id,
            address,
            date,
            phone,
            mobilePhone,
            positiveTestDate:"",
            recoveryDate:""
        });

        // Saving the new Client to the database
        await newClient.save();

        // Sending a response
        res.status(201).json({ message: 'New client created successfully', client: newClient });
    } catch (error) {
        // Handling errors
        console.error('Error creating new client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
const deleteClientrById = async (req, res) => {
    try {
        // Extracting the id parameter from the request URL
        const id = req.params.id;
        console.log(id);
        
        // Your logic to delete the client by id goes here
        
        let client = await Client.findByIdAndDelete(id);
        res.send("Client deleted!! " + client);
    } catch (error) {
        console.error('Error deleting client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const updateClientById = async (req, res) => {
    console.log("לעדכןןןןןן")
    try {
        const updateClient ={...req.body};
        const updatedClient = await Client.findOneAndUpdate({_id:req.body._id}, updateClient, {new:true})

        // Check if the client exists and return updated client
        if (!updatedClient) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Sending a response with the updated client
        res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
    } catch (error) {
        console.error('Error updating client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

// const updateClienithVaccine = async (req, res) => {
//     console.log("לעדכןןןןןן")
//     try {
//         const updateClient ={...req.body};
//         const updatedClient = await Client.findOneAndUpdate({_id:req.body._id}, updateClient, {new:true})

//         // Check if the client exists and return updated client
//         if (!updatedClient) {
//             return res.status(404).json({ error: 'Client not found' });
//         }

//         // Sending a response with the updated client
//         res.status(200).json({ message: 'Client updated successfully', client: updatedClient });
//     } catch (error) {
//         console.error('Error updating client:', error);
//         res.status(500).json({ error: 'Internal server error' });
//     }
// }

const getClientById = async (req, res) => {
    try {
        const id = req.params.id;

        // Find the client by id
        let client = await Client.findById(id);

        // Check if the client exists and return it
        if (!client) {
            return res.status(404).json({ error: 'Client not found' });
        }

        // Sending a response with the client
        res.status(200).json({ client });
    } catch (error) {
        console.error('Error fetching client:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}

const getAllClient =  async (req, res) => {
    try {
      const clients = await Client.find({})
      res.send(clients);
    } catch (e) {
      console.log(e);
      res.status(500).send(e.message);
    }
  }
module.exports = {newClient,deleteClientrById,updateClientById,getClientById,getAllClient};
