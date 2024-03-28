import axios from 'axios';
import React, { useEffect, useState } from 'react';
import "./clientAdd.css";
import VaccineAdd from './vaccineClient'

function ClientAdd() {
    const [clientList, setClientList] = useState([]);
    const [clientIdAddingDate, setClientIdAddingDate] = useState(null);
    const [dateTypeAdding, setDateTypeAdding] = useState(''); // 'positive' or 'recovery'
    const [selectedClient, setSelectedClient] = useState(null); // State to store the selected client
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [editMode, setEditMode] = useState(false);
    const [showVaccineAddModal, setShowVaccineAddModal] = useState(false);
    // const [selectedClient, setSelectedClient] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        lastName: '',
        id: '',
        address: '',
        date: '',
        phone: '',
        mobilePhone: '',
    });

    // Fetch client data
    useEffect(() => {
        fetch('http://localhost:5000/Client/getClient')
            .then(response => response.json())
            .then(data => {
                setClientList(data);
            });
    }, []);

    // Handle input change for form fields
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({ ...formData, [name]: value });
    };
    
    // Function to add a date (positive test or recovery) for a client
    const addDate = (clientId, type) => {
      setClientIdAddingDate(clientId);
      setDateTypeAdding(type);
  };
  
    // Function to handle adding a new client
    const handleAdd = (event) => {

        // Validation: check if all form fields are filled
        for (const key in formData) {
            if (formData[key] === '') {
                alert(`Please fill in the ${key} field.`);
                return;
            }
        }

        axios.post('http://localhost:5000/Client/newClient', formData)
            .then((res) => {
                // If successful, update client list with the newly added client
                if (res.data) {
                    const clientSend = { "client": res.data };
                    console.log(clientSend);
                    setFormData({
                        name: '',
                        lastName: '',
                        id: '',
                        address: '',
                        date: '',
                        phone: '',
                        mobilePhone: '',
                    });
                    console.log(res.data)
                    // Update client list after adding
                    setClientList([...clientList, res.data]);
                }
            })
            .catch((err) => {
                console.log(err);
                alert("An error occurred");
            });
    };

    // Function to delete a client
    const deleteClient = async (idClient) => {
        try {
            const deleteC = await axios.delete(`http://localhost:5000/Client/deleteClient/${idClient}`);
            if (deleteC.data) {
                console.log(deleteC.data);
                // Filter out the deleted client from the client list
                setClientList(clientList.filter(client => client._id !== idClient));
                return "the client deleted";
            } else {
                throw new Error('Error deleting user from the database.');
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error deleting user from the queue.');
        }
    }

    // Function to handle showing more details of a client
    const handleMoreDetail = async (client) => {
      const response = await axios.get('http://localhost:5000/Covid19/getCovid19')
      console.log(response.data)
      const updateNclient = client.vaccineInfo.map((e)=>{
        const name = response.data.find((vaccine)=>e.vaccineType===vaccine._id)
        return {vaccineType:`${name.vaccineType},${name.manufacturer}`,vaccinationDate:e.vaccinationDate}
      })
    
      setSelectedClient({...client,vaccineInfo:updateNclient});
      setShowModal(true);
  }

  // Function to handle editing a client
  const handleEdit = (client) => {
    setSelectedClient(client);
    setFormData({
        _id:client._id,
        name: client.name,
        lastName: client.lastName,
        id: client.id,
        address: client.address,
        date: client.date,
        phone: client.phone,
        mobilePhone: client.mobilePhone,
    });
    setEditMode(true);
}

// Function to toggle the visibility of the vaccine addition modal
const toggleVaccineAddModal = (client) => {
    setSelectedClient(client);
    setShowVaccineAddModal(!showVaccineAddModal);
};

// Function to handle updating a client's details
const handleUpdate = async (event) => {
  event.preventDefault();
  setEditMode(false);

  try {
      const response = await axios.put('http://localhost:5000/Client/updateClient', formData);
      if (response.data) {
          console.log(response.data);
          // Update client list after updating
          setClientList(clientList.map(client => {
              if (client._id === formData._id) {
                  return { ...client, ...formData };
              }
              return client;
          }));
          return "Client updated successfully";
      } else {
          throw new Error('Error updating client in the database.');
      }
  } catch (error) {
      console.error(error);
      throw new Error('Error updating client in the queue.');
  }
};

// Function to handle input of date for a client
const handleInputDate =async (event) => {
  event.preventDefault();
  const { name, value } = event.target;
  console.log(clientIdAddingDate,dateTypeAdding,value)
  let clientD = {};
  if(dateTypeAdding==='positive'){
    clientD = {
      _id:clientIdAddingDate,
      positiveTestDate:value
    }
  }else{
    clientD = {
      _id:clientIdAddingDate,
      recoveryDate:value
    }
  }

  try {
    const response = await axios.put('http://localhost:5000/Client/updateClient', clientD);
    if (response.data) {
        console.log(response.data);
        // Update client list after updating
        setClientList(clientList.map(client => {
          if (client._id === clientD._id) {
              return { ...client, ...clientD };
          }
          return client;
      }));
        return "Client Date updated successfully";
    } else {
        throw new Error('Error updating client in the database.');
    }
} catch (error) {
    console.error(error);
    throw new Error('Error updating client in the queue.');
}};

// Function to close the vaccine addition modal
const handleCloseVaccineModal = () => {
    setShowVaccineAddModal(false);
    window.location.reload(); // Reload the page
};

    return (
        <div>
            <div className="ClientAdd">
                <div className="TableClient">
                    <h2>list client</h2>
                    <table className="client-table">
                        <thead>
                            <tr>
                                <th>name</th>
                                <th>last name </th>
                                <th>positive Test</th>
                                <th>recovery</th>
                                <th>vaccine</th>
                                <th>more...</th>
                                <th>edit</th>
                                <th>delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clientList.map((client, index) => (
                                <tr key={index}>
                                    <td>{client.name}</td>
                                    <td>{client.lastName}</td>
                                    {client.positiveTestDate === null ? (<td><button onClick={() => addDate(client._id, 'positive')}>Add Positive Test</button>
                                    {clientIdAddingDate === client._id && dateTypeAdding === 'positive' && <input type='date' onChange={handleInputDate} />}</td>) : (
                                    <td>{client.positiveTestDate.split("T")[0]}</td>)}
                                    {client.recoveryDate === null ? (<td><button onClick={() => addDate(client._id, 'recovery')} disabled={!client.positiveTestDate}>Add Recovery Date</button>
                                    {clientIdAddingDate === client._id && dateTypeAdding === 'recovery' && <input type='date'  onChange={handleInputDate}/>}</td>) : (
                                    <td>{client.recoveryDate.split("T")[0]}</td>)}
                                    <td><button onClick={()=>toggleVaccineAddModal(client)}>add</button></td>
                                    <td><button onClick={() => handleMoreDetail(client)}>more detail</button></td>
                                    <td><button  onClick={() => handleEdit(client)}>edit</button></td>
                                    <td><button onClick={() => deleteClient(client._id)}>delete</button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showModal && selectedClient && (
                    <div className="modal">
                        <div className="modal-content">
                            <span className="close" onClick={() => setShowModal(false)}>X</span>
                            <h2>Client Details</h2>
                            <p>Name: {selectedClient.name}</p>
                            <p>Last Name: {selectedClient.lastName}</p>
                            <p>ID: {selectedClient.id}</p>
                            <p>Address: {selectedClient.address}</p>
                            <p>Date: {selectedClient.date.split("T")[0]}</p>
                            <p>Phone: {selectedClient.phone}</p>
                            <p>Mobile Phone: {selectedClient.mobilePhone}</p>
                            <p>Positive Test Date: {selectedClient.positiveTestDate ? selectedClient.positiveTestDate.split("T")[0] : '-'}</p>
                            <p>Recovery Date: {selectedClient.recoveryDate ? selectedClient.recoveryDate.split("T")[0] : '-'}</p>
                            <h4>data about vaccine</h4>
                            {selectedClient.vaccineInfo ?( selectedClient.vaccineInfo.map((vaccine, index) => (
                            <ul key={index}>
                                
                                <li>Vaccine Type: {vaccine.vaccineType}</li>
                                <li>Vaccination Date: {new Date(vaccine.vaccinationDate).toLocaleDateString()}</li>
                                </ul>
                                ))):(<p>-</p>)}
                        </div>
                    </div>
                )}
                 {editMode && selectedClient && (
            <div className="modal">
                <div className="modal-content">
                    <span className="close" onClick={() => setEditMode(false)}>X</span>
                    <h2>Edit Client Details</h2>
                    <form onSubmit={handleUpdate}>
                        <input type="text" name="name" defaultValue={selectedClient.name} required onChange={handleInputChange} />
                        <input type="text" name="lastName" defaultValue={selectedClient.lastName} required onChange={handleInputChange} />
                        <input type="text" name="id" defaultValue={selectedClient.id} required disabled />
                        <input type="text" name="address" defaultValue={selectedClient.address} required onChange={handleInputChange} />
                        <input name="date" defaultValue={selectedClient.date.split("T")[0]} required disabled/>
                        <input type="number" name="phone" defaultValue={selectedClient.phone} required onChange={handleInputChange} />
                        <input type="number" name="mobilePhone" defaultValue={selectedClient.mobilePhone} required onChange={handleInputChange} />
                        <button type="submit">Update</button>
                    </form>
                </div>
            </div>
        )}
                <p>add client</p>
                <form className="AddClient">
                    <input type="text" name="name" required placeholder="enter a name" onChange={handleInputChange} />
                    <input type="text" name="lastName" required placeholder="enter a last name" onChange={handleInputChange} />
                    <input type="text" name="id" required placeholder="enter an id" onChange={handleInputChange} />
                    <input type="text" name="address" required placeholder="enter an address" onChange={handleInputChange} />
                    <input type="date" name="date" required onChange={handleInputChange} />
                    <input type="number" name="phone" required placeholder="enter a phone" onChange={handleInputChange} />
                    <input type="number" name="mobilePhone" required placeholder="enter a mobile phone" onChange={handleInputChange} />
                    <button type="submit" onClick={handleAdd}>add</button>
                </form>
            </div>
            {showVaccineAddModal && (
    <div className="modal">
        <div className="modal-content">
            <span className="close" onClick={handleCloseVaccineModal}>X</span>
            <VaccineAdd selectedClient={selectedClient} />
        </div>
    </div>
)}

        </div>
    );
}

export default ClientAdd;
