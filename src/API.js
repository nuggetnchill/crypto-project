import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';

// const proxy = 'https://cors-anywhere.herokuapp.com/';
// const NOMICS_API_URL = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_KEY}&ids=BTC,ETH,XRP&interval=1d,30d&per-page=100&page=1`;
const NOMICS_API_PRICE_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_KEY}&currency=BTC&start=2020-11-18T00%3A00%3A00Z&end=2020-11-19T00%3A00%3A00Z`;
const API = () => {
  const [rate, setRate] = useState([]);
  const [timestamp, setTimestamp] = useState([]);

  const fetchData = async () => {
    const response = await fetch(NOMICS_API_PRICE_URL);
    const data = await response.json();

    // Splitting data into 2 arrays
    data.forEach((el) => {
      // https://medium.com/javascript-in-plain-english/how-to-add-to-an-array-in-react-state-3d08ddb2e1dc
      // ^ this link was a good read about using spread operator and wrapper fn for problem bellow

      setTimestamp((timestamp) => [...timestamp, el.timestamp]);
      setRate((rate) => [...rate, el.rate]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Combining the arrays that I splitted earlier with modifications
  let chartData = [];
  rate.forEach((each, i) => [
    chartData.push({
      timestamp: new Date(timestamp[i]).toLocaleString(),
      rate: (each * 1).toFixed(2),
    }),
  ]);

  return (
    <div className='container'>
      <LineChart
        width={1200}
        height={500}
        data={chartData}
        margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
      >
        <XAxis dataKey='timestamp' />
        <YAxis dataKey='rate' padding={{ bottom: -500, top: 0 }} />
        <CartesianGrid strokeDasharray='3 3' />
        <Tooltip />
        <Legend />
        <Line
          type='monotone'
          dataKey='rate'
          stroke='#8884d8'
          activeDot={{ r: 8 }}
        />
      </LineChart>

      <h2>From API.js</h2>
    </div>
  );
};

export default API;
