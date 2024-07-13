import React, { useEffect, useState } from 'react'
import Chart from 'react-google-charts';

function LineGraph({historicalData}: any) {
    const [data, setData] = useState([['Date', 'Prices']])
    const options = {
        backgroundColor: 'transparent', // Set your desired background color here
        titleTextStyle: { color: '#4CAF50', fontSize: 20 }, // Title text style
        hAxis: { 
          title: 'Year', 
          titleTextStyle: { color: '#fff' }, 
          textStyle: { color: '#ffffff' } // Horizontal axis text style
        },
        vAxis: { 
          minValue: 0, 
          textStyle: { color: '#4CAF50' } // Vertical axis text style
        },
        legend: { textStyle: { color: '#4CAF50', fontSize: 12 } } // Legend text style
      };

    useEffect(()=> {
        let dataCopy = [['Date', 'Prices']];
        if (historicalData.prices) {
            historicalData.prices.map((item: string[])=> {
                dataCopy.push([`${new Date(item[0]).toLocaleDateString().slice(0, -5)}`, item[1]])
            })
            setData(dataCopy)
        }
    }, [historicalData])
  return (
    <div className=''>
      <Chart
      chartType='LineChart'
      data={data}
    height="100%"
    legendToggle
    options={options}
      
     
     />
    </div>
  )
}

export default LineGraph
