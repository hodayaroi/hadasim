import axios from 'axios';
import React, { useState,useEffect } from 'react';
import './vaccine.css'

function VaccineAdd({ selectedClient }) {
    const [vaccines, setVaccines] = useState({ vaccineType:'', manufacturer:'' });
    const [vaccinesList, setVaccinesList] = useState();
    const [limitVaccine, setlimitVaccine] = useState([
        { id: 1, type: '', received: false, date: '' ,n:''},
        { id: 2, type: '', received: false, date: '' ,n:''},
        { id: 3, type: '', received: false, date: '' ,n:''},
        { id: 4, type: '', received: false, date: '' ,n:''},
    ]);

    // Event handlers for updating vaccine information
    const handleVaccineTypeChange = (event, vaccineId) => {
        const updatedVaccines = limitVaccine.map(vaccine =>{
            if(vaccine.id === vaccineId) {
                return ({ ...vaccine,type: event.target.value })
            } else
            return vaccine
    });
        setlimitVaccine(updatedVaccines);
    };
    
    // Function to handle changes in the "received" status of a vaccine
    const handleReceivedChange = (event, vaccineId) => {
        console.log(event.target.checked)
        const updatedVaccines = limitVaccine.map(vaccine =>{
            if(vaccine.id === vaccineId ){
             return({ ...vaccine, received: event.target.checked }) 
            }
            else{
                return vaccine
            }
    });
        setlimitVaccine(updatedVaccines);
    };
    
    // Function to handle changes in the vaccination date of a vaccine
    const handleDateChange = (event, vaccineId) => {
        const updatedVaccines = limitVaccine.map(vaccine =>{
            if(vaccine.id === vaccineId){
                return( { ...vaccine, date: event.target.value })
            }
            else{
              return vaccine
            }  
    });
        setlimitVaccine(updatedVaccines);
    };
    
    // Fetching vaccine list
    useEffect(() => {
        fetch('http://localhost:5000/Covid19/getCovid19')
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setVaccinesList(data)
            });
           
        }, [])

        // Updating displayed vaccine list when vaccinesList or selectedClient changes
        useEffect(()=>{
           if(vaccinesList){
            const newList = selectedClient.vaccineInfo.map((e, i) => {
                let name = vaccinesList.find(vaccine => vaccine._id === e.vaccineType)
               
                return ({
                id: i + 1,
                type: e.vaccineType,
                received: true,
                date:new Date(e.vaccinationDate).toISOString().split('T')[0],
                n:`${name.vaccineType},${name.manufacturer}`
        })})
            console.log(newList)
            setlimitVaccine(limitVaccine.map((e)=>{
                console.log(e.id)
                const exist = newList.find(elemnt=>elemnt.id===e.id)
                if(exist){
                    console.log(exist)
                    return exist
                }else{
                    console.log(e)
                    return e
                }
            }))
           console.log(limitVaccine)
        }
        },[vaccinesList])


    const handleinputchange = (event)=>{
      const {name,value}=event.target;
      console.log(name,value)
      setVaccines({ ...vaccines, [name]: value });
      console.log(vaccines)
    }

    // Handling addition of a new vaccine
    const handleAdd = async (event) => {
        event.preventDefault();
        console.log(vaccines);
        
        try {
            const response = await axios.post('http://localhost:5000/Covid19/newVaccination', vaccines);
            console.log(response);
    
            if (response.data) {
                console.log(response.data);
                alert("Vaccine added successfully   ")
                return "Vaccine added successfully";
            } else {
                throw new Error('Error adding vaccine in the database.');
            }
        } catch (error) {
            console.error(error);
            throw new Error('Error adding vaccine in the queue.');
        }
    };

    // Handling saving vaccine information to the client
    const handleSave = async (event)=>{
        event.preventDefault()
        let listVaccine = limitVaccine.filter(vaccine => vaccine.type) 
        .map(e => ({
            vaccineType: e.type,
            vaccinationDate: e.date
        }));
    
        let clientWvaccine = {
            _id:selectedClient._id,
            vaccineInfo : listVaccine
        }
        try{
        const updateClient =await axios.put('http://localhost:5000/Client/updateClient',clientWvaccine)
        if(updateClient.data){
            console.log(updateClient.data)
            return "Vaccine information added to the client successfully";
        }
        else{
            throw new Error('Error updating client with vaccine information in the database.');
        }
        }catch(error){
            console.log(error)
            throw new Error('Error updating client with vaccine information in the queue.');
        }
    }
    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th>Vaccine Type</th>
                        <th>Received</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                {limitVaccine.map(vaccine => (
                    !vaccine.received || vaccine.type===''||vaccine.date==='' ||vaccine.n==='' ? (
                    <tr key={vaccine.id}>
                        <td>
                            <select value={vaccine.type} onChange={(e) => handleVaccineTypeChange(e, vaccine.id)}>
                                <option value="">{vaccine.type}</option>
                                {vaccinesList && vaccinesList.map((vaccineOption) => (
                                <option key={vaccineOption._id} value={vaccineOption._id}>
                                {`${vaccineOption.vaccineType}, ${vaccineOption.manufacturer}`}
                                </option>
                                ))}
                            </select>
                        </td>
                        <td>
                            <input
                            type="checkbox"
                            checked={vaccine.received}
                            onChange={(e) => handleReceivedChange(e, vaccine.id)}
                            disabled={!vaccine.type}/>
                        </td>
                        <td>
                            <input
                            type="date"
                            value={vaccine.date}
                            onChange={(e) => handleDateChange(e, vaccine.id)}
                            disabled={!vaccine.received} />
                        </td>
                    </tr>) : (
                   <tr key={vaccine.id}>
                   <td>
                        <p>{vaccine.n}</p>
                   </td>
                   <td>
                       <input
                       type="checkbox"
                       checked={vaccine.received}
                       />
                   </td>
                   <td>
                       <input
                       type="date"
                       defaultValue={vaccine.date}
                       disabled
                        />
                   </td>
               </tr> )
                    ))}

                </tbody>
            </table>
            <button type='sumbit' onClick={handleSave}>save</button>
            <div className='AddVaccine'>
              <p>Adding a vaccine</p>
              <form className="AddVaccine">
              <input className='Vaccine' type='text' name='vaccineType' placeholder='enter a type'required onChange={handleinputchange} />
              <input className='Vaccine' type='text' name='manufacturer' placeholder='enter a manufacturer' required onChange={handleinputchange} />
              <button type="submit" onClick={handleAdd} disabled={!vaccines.vaccineType || !vaccines.manufacturer}>add</button>
              </form>
            </div>
        </div>
    );
}

export default VaccineAdd;
