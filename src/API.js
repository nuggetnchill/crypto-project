import { useState, useEffect } from 'react';
import {
  Area,
  AreaChart,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Handling date and time
const DAY_IN_MS = 86400000; // 24 * 60 * 60 * 1000
const today = new Date().toISOString();
const yesterday = new Date(new Date() - DAY_IN_MS).toISOString();
const aWeekAgo = new Date(new Date() - 7 * DAY_IN_MS).toISOString();
const aMonthAgo = new Date(new Date() - 31 * DAY_IN_MS).toISOString();
const aYearAgo = new Date(new Date() - 365 * DAY_IN_MS).toISOString();

// Create our number formatter // Handling monetary currency(USD)
const usdFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  // These options are needed to round to whole numbers
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});

// const proxy = 'https://cors-anywhere.herokuapp.com/';
// const NOMICS_API_URL = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_KEY}&ids=BTC,ETH,XRP&interval=1d,30d&per-page=100&page=1`;

const API = () => {
  const [timeframe, setTimeFrame] = useState('1D');
  const [searchField, setSearchField] = useState('ETH');
  const [rate, setRate] = useState([]);
  const [timestamp, setTimestamp] = useState([]);
  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);

  const NOMICS_API_PRICE_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_KEY}&currency=${searchField}&start=${startDate}&end=${endDate}`;

  const fetchData = async () => {
    const response = await fetch(NOMICS_API_PRICE_URL);
    const data = await response.json();

    // Splitting data into 2 arrays
    // https://medium.com/javascript-in-plain-english/how-to-add-to-an-array-in-react-state-3d08ddb2e1dc
    // ^ this link was a good read about using spread operator and wrapper fn for problem bellow
    data.forEach((el) => {
      setTimestamp((timestamp) => [...timestamp, el.timestamp]);
      setRate((rate) => [...rate, el.rate]);
    });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Combining the arrays that I splitted earlier after modifications
  let chartData = [];
  rate.forEach((each, i) => {
    chartData.push({
      // timestamp: new Date(timestamp[i]).toLocaleString(),
      timestamp: timestamp[i],
      rate: (each * 1).toFixed(3),
    });
  });

  const handleInput = (event) => {
    setSearchField(event.target.value.toUpperCase());
  };

  const handleSubmit = () => {
    setRate([]);
    setTimestamp([]);
    chartData = [];
    fetchData();
  };

  const enterKey = (event) => {
    if (event.key === 'Enter') {
      setRate([]);
      setTimestamp([]);
      chartData = [];
      fetchData();
    }
  };

  return (
    <div className='container'>
      <input
        onKeyPress={enterKey}
        onChange={handleInput}
        name='search-currency'
        type='text'
        placeholder='Search asset...'
      />
      <button onClick={handleSubmit}>Search</button>

      <h2>Currency: {searchField}</h2>

      {chartData.length > 0 && (
        <h1>
          ${(chartData[chartData.length - 1].rate * 1).toLocaleString('en')}
        </h1>
      )}

      <div className='timeframe'>
        <ul className='timeframe-options'>
          <li>1D</li>
          <li>1W</li>
          <li>1M</li>
          <li>1Y</li>
          <li>YTD</li>
          <li>All</li>
        </ul>
      </div>

      <div className='chart-container-main'>
        {/* MAIN CHART */}
        <AreaChart
          width={1100}
          height={400}
          data={chartData}
          margin={{ top: 10, right: 0, left: 40, bottom: 0 }}
        >
          <defs>
            <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
              <stop offset='0%' stopColor='#82ca9d' stopOpacity={0.5} />
              <stop offset='100%' stopColor='#82ca9d' stopOpacity={0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey='timestamp'
            interval={2}
            tickSize={15}
            tickFormatter={(value) => {
              const dateInfo = new Date(value).toString().split(' ');
              let month = dateInfo[1];
              let date = dateInfo[2];
              let time = dateInfo[4].split(':');
              return time[0] === '00'
                ? `${date}.${month}`
                : `${time[0]}:${time[1]}`;
            }}
          />
          <YAxis
            minTickGap={5}
            tickSize={15}
            tickLine={false}
            tickFormatter={(value) => {
              return usdFormat.format(value);
            }}
            dataKey='rate'
            axisLine={false}
            domain={['dataMin-5', 'auto']}
            padding={{ bottom: 30 }}
          />
          <CartesianGrid strokeDasharray='0.2' vertical={false} />
          <Tooltip
            formatter={(value) => {
              return usdFormat.format(value);
            }}
            labelFormatter={(value) => {
              const dateInfo = new Date(value).toString().split(' ');
              let day = dateInfo[0];
              let month = dateInfo[1];
              let date = dateInfo[2];
              let time = dateInfo[4].split(':');
              return `${day}, ${month} ${date}, ${time[0]}:${time[1]} `;
            }}
            labelStyle={{
              textAlign: 'center',
              fontSize: '1rem',
              color: 'white',
              backgroundColor: '#2c303371',
            }}
            contentStyle={{
              textAlign: 'center',
              fontSize: '1rem',
              backgroundColor: '#2c303371',
              border: 'none',
            }}
            itemStyle={{
              color: 'white',
              backgroundColor: '#2c303371',
            }}
            wrapperStyle={{
              backgroundColor: '#212527bb',
            }}
            separator=''
          />
          <Area
            // type='monotone'
            dataKey='rate'
            name='Price: '
            stroke='#00E08E'
            strokeWidth='4'
            fillOpacity={1}
            fill='url(#colorPv)'
          />
        </AreaChart>
      </div>

      {/* SECONDARY CHART */}
      <div className='chart-container-secondary'>
        <AreaChart
          className='secondary-chart'
          width={1100}
          height={80}
          data={chartData}
          margin={{
            top: 5,
            right: 0,
            left: 80,
            bottom: 5,
          }}
        >
          <Area
            type='monotone'
            dataKey='rate'
            stroke='#00E08E'
            fill='#82ca9e50'
            fill='#1d442c50 '
          />
          <YAxis hide={true} domain={['auto', 'auto']} />
        </AreaChart>
      </div>

      {/* Old Line Chart */}
      {/* <LineChart
        width={1000}
        height={400}
        data={chartData}
        margin={{ top: 5, right: 50, left: 20, bottom: 5 }}
      >
        <XAxis
          dataKey='timestamp'
          type='category'
          interval='preserveStartEnd'
        />
        <YAxis hide='true' dataKey='rate' padding={{ bottom: 0, top: 0 }} />
        <CartesianGrid vertical={false} />
        <Tooltip
          labelStyle={{
            textAlign: 'center',
            fontSize: '1.2rem',
            color: 'white',
          }}
          contentStyle={{
            textAlign: 'center',
            fontSize: '2rem',
            backgroundColor: '#2c303371',
          }}
          itemStyle={{
            color: 'white',
            backgroundColor: '#2c303371',
          }}
          separator=''
        />
        <Line
          type='monotone'
          dataKey='rate'
          stroke='#8884d8'
          dot={false}
          strokeWidth='5'
          name='$'
        />
      </LineChart> */}
    </div>
  );
};

export default API;
