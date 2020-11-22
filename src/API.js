import { useState, useEffect } from 'react';
import {
  Area,
  AreaChart,
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
const firstDay = new Date(new Date().getFullYear(), 0, 1).toISOString();

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
  const [timeframe, setTimeframe] = useState('1D');
  const [searchField, setSearchField] = useState('ETH');
  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);
  const [chartData, setChartData] = useState([]);

  const NOMICS_API_PRICE_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_KEY}&currency=${searchField}&start=${startDate}&end=${endDate}`;

  const fetchData = async () => {
    const response = await fetch(NOMICS_API_PRICE_URL);
    const data = await response.json();
    await setChartData(data);
  };

  const initialLoad = async () => {
    await fetchData();
    await console.log('initial fetch from initialLoad()');
  };

  useEffect(() => {
    initialLoad();
  }, []);

  // USER INPUT, BUTTONS Fn
  const handleInput = (event) => {
    setSearchField(event.target.value.toUpperCase());
  };

  const handleSubmit = () => {
    setChartData([]);
    fetchData();
  };

  const enterKey = (event) => {
    if (event.key === 'Enter') {
      setChartData([]);
      fetchData();
    }
  };

  // HANDLING WHEN timeframe CHANGES

  const timeframeButton = async (event) => {
    setChartData([]);
    setTimeframe(event.target.innerText);
    await setStartDate(event.target.id);
    await fetchData();
  };

  // RENDER HERE:
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
      <h3>({timeframe})</h3>

      {chartData.length > 0 && (
        <h1>
          ${(chartData[chartData.length - 1].rate * 1).toLocaleString('en')}
        </h1>
      )}

      <div className='timeframe'>
        <ul className='timeframe-options'>
          <li onClick={timeframeButton} id={yesterday}>
            1D
          </li>
          <li onClick={timeframeButton} id={aWeekAgo}>
            1W
          </li>
          <li onClick={timeframeButton} id={aMonthAgo}>
            1M
          </li>
          <li onClick={timeframeButton} id={aYearAgo}>
            1Y
          </li>
          <li onClick={timeframeButton} id={firstDay}>
            YTD
          </li>
          <li onClick={timeframeButton}>All</li>
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
          />
          <YAxis hide={true} domain={['auto', 'auto']} />
        </AreaChart>
      </div>
    </div>
  );
};

export default API;
