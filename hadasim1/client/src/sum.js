import axios from 'axios'
import React, { useEffect, useState } from 'react';
import Chart from 'chart.js/auto';
import './sum.css'

function Sum(){

    const [clientList, setClientList] = useState([]);
    const [notVaccinated, setNotVaccinated] = useState(0);
    const [activeCasesData, setActiveCasesData] = useState(null);

    // Fetch client data
    useEffect(() => {
        fetch('http://localhost:5000/Client/getClient')
            .then(response => response.json())
            .then(data => {
                setClientList(data);
            }).catch(error => {
                console.error('Error fetching client data:', error);
            });
    }, []);

    useEffect(() => {
        if(clientList.length > 0){
            let count = 0
            clientList.map((c)=>{
                if(c.vaccineInfo.length===0){
                    count++
                }
            })
            setNotVaccinated(count)    
        }
    culculateSick()
}, [clientList]);

//calculate how mant sick we have in every day in the last month
const culculateSick= ()=>{
    const dateToday = new Date()
    const month = String(dateToday.getMonth() + 1).padStart(2, '0');
    const sickMonth = clientList.filter((c)=>c.positiveTestDate&&c.positiveTestDate.split('-')[1]==month)

    if (sickMonth.length > 0) {
        const updatedData = {};
        sickMonth.forEach(clientS => {
            const date = clientS.positiveTestDate.split('T')[0].split('-')[2];
            if(updatedData[date]){
            updatedData[date] = updatedData[date] + 1
            }else{
                updatedData[date] = 1
            }   
        });
        setActiveCasesData(updatedData);
    }    

}

useEffect(() => {
    // Render chart once active cases data is available
    if (activeCasesData !== null) {
    console.log(activeCasesData)
        renderChart();
    }

}, [activeCasesData]);



const renderChart = () => {
    const ctx = document.getElementById('activeCasesChart');
    
    // Check if a chart instance already exists
    if (ctx && Chart.getChart(ctx)) {
        Chart.getChart(ctx).destroy(); // Destroy the existing chart instance
    }
    
    // Convert activeCasesData to an array for chart labels and data
    const labels = Object.keys(activeCasesData).map(day => `Day ${day}`);
    const data = Object.values(activeCasesData);

    // Render the new chart
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Active Cases',
                data: data, // Adjust this based on your data model
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
};




    return(
        <div className='SumCovid'>
            <div>
                <h2>Summary View</h2>
                <p>Active Cases Over the Last Month:</p>
                <canvas id="activeCasesChart" width="300" height="150"></canvas>
            </div>
            <h3 color='red'>The number of health insurance members who are not vaccinated: {notVaccinated}</h3>
        </div>
    )
}
export default Sum;