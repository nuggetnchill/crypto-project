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

const Charts = () => {
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState(true);
  const [timeframe, setTimeframe] = useState('1D');
  const [searchField, setSearchField] = useState('BTC');
  const [startDate, setStartDate] = useState(yesterday);
  const [endDate, setEndDate] = useState(today);
  const [chartData, setChartData] = useState([]);
  const [tickerData, setTickerData] = useState(null);

  const NOMICS_API_PRICE_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_KEY}&currency=${searchField}&start=${startDate}&end=${endDate}`;
  const NOMICS_API_TICKER_URL = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_KEY}&ids=${searchField}&interval=1d,30d&per-page=100&page=1`;
  // const NOMICS_API_CANDLES_URL = `https://nomics.com/data/candles?currency=BTC&interval=365d`;
  const fetchData = async () => {
    const response = await fetch(NOMICS_API_PRICE_URL);
    const data = await response.json();
    await setChartData(data);
    await setLoading(false);
  };

  const fetchInfo = async () => {
    const response = await fetch(NOMICS_API_TICKER_URL);
    const data = await response.json();
    await setTickerData(data);
  };

  useEffect(() => {
    fetchData();
  }, [toggle]);

  useEffect(() => {
    fetchInfo();
  }, []);

  // USER INPUT, BUTTONS Fn
  const handleInput = (event) => {
    setSearchField(event.target.value.toUpperCase());
  };

  const handleSubmit = () => {
    setChartData([]);
    fetchData();
    fetchInfo();
  };

  const enterKey = (event) => {
    if (event.key === 'Enter') {
      setChartData([]);
      fetchData();
      fetchInfo();
    }
  };

  // HANDLING WHEN timeframe CHANGES
  function timeframeButton(event) {
    setChartData([]);
    setTimeframe(event.target.innerText);
    setStartDate(event.target.id);
    setToggle(!toggle);
    setLoading(true);
  }

  // RENDER HERE:
  return (
    <div className='main-container'>
      <div className='search-bar'>
        <input
          onKeyPress={enterKey}
          onChange={handleInput}
          name='search-currency'
          type='text'
          placeholder='Search asset...'
        />
        <button onClick={handleSubmit}>Search</button>
      </div>

      {tickerData && (
        <div className='info-container'>
          <div className='ticker-info'>
            <img
              src={tickerData[0].logo_url}
              alt='ticker logo'
              style={{ height: '5rem', padding: '1rem' }}
            />
            <h1>
              {tickerData[0].name} ({tickerData[0].currency})
            </h1>
          </div>

          <div className='ticker-stats'>
            <h3>{tickerData[0].symbol} Price</h3>
            <h1>
              {usdFormat.format(tickerData[0].price)}{' '}
              <span className='price-change-pct'>
                {(tickerData[0]['1d'].price_change_pct * 100).toFixed(2)}%
              </span>
            </h1>
          </div>
        </div>
      )}
      <div className='data-container'>
        <div className='timeframe'>
          <ul className='timeframe-options'>
            <li
              onClick={timeframeButton}
              id={yesterday}
              style={{ backgroundColor: timeframe === '1D' ? '#14191d' : null }}
            >
              1D
            </li>
            <li
              onClick={timeframeButton}
              id={aWeekAgo}
              style={{ backgroundColor: timeframe === '1W' ? '#14191d' : null }}
            >
              1W
            </li>
            <li
              onClick={timeframeButton}
              id={aMonthAgo}
              style={{ backgroundColor: timeframe === '1M' ? '#14191d' : null }}
            >
              1M
            </li>
            <li
              onClick={timeframeButton}
              id={aYearAgo}
              style={{ backgroundColor: timeframe === '1Y' ? '#14191d' : null }}
            >
              1Y
            </li>
            <li
              onClick={timeframeButton}
              id={firstDay}
              style={{
                backgroundColor: timeframe === 'YTD' ? '#14191d' : null,
              }}
            >
              YTD
            </li>
            <li
              onClick={timeframeButton}
              style={{
                backgroundColor: timeframe === 'All' ? '#14191d' : null,
              }}
            >
              All
            </li>
          </ul>
        </div>

        {!loading ? (
          <>
            <div className='chart-container-primary'>
              {/* MAIN CHART */}
              <AreaChart
                width={1100}
                height={400}
                data={chartData}
                margin={{ top: 50, right: 0, left: 60, bottom: 0 }}
              >
                <defs>
                  <linearGradient id='colorPv' x1='0' y1='0' x2='0' y2='1'>
                    <stop offset='0%' stopColor='#82ca9d' stopOpacity={0.5} />
                    <stop offset='100%' stopColor='#82ca9d' stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey='timestamp'
                  interval='preserveEnd'
                  tickSize={15}
                  tickFormatter={(value) => {
                    const dateInfo = new Date(value).toString().split(' ');
                    let month = dateInfo[1];
                    let date = dateInfo[2];
                    let time = dateInfo[4].split(':');
                    let year = dateInfo[3];
                    if (timeframe === '1D') {
                      return time[0] === '00'
                        ? `${date}.${month}    `
                        : `${time[0]}:${time[1]}    `;
                    } else if (timeframe === '1Y') {
                      return `${month}'${year}   `;
                    } else {
                      return `${date}.${month}    `;
                    }
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
                  // this works for now
                  domain={[
                    (dataMin) =>
                      dataMin > 6000 &&
                      (timeframe === '1Y' || timeframe === 'YTD')
                        ? dataMin / 5
                        : dataMin,
                    (dataMax) =>
                      dataMax > 10000 &&
                      (timeframe === '1Y' || timeframe === 'YTD')
                        ? dataMax * 1
                        : dataMax,
                  ]}
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
                  dataKey='rate'
                  name='Price: '
                  stroke='#00E08E'
                  strokeWidth='4'
                  fillOpacity={1}
                  fill='url(#colorPv)'
                  animationEasing='ease-in'
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
                  left: 100,
                  bottom: 5,
                }}
              >
                <Area
                  animationDuration={5000}
                  type='monotone'
                  dataKey='rate'
                  stroke='#00E08E'
                  fill='#82ca9e50'
                />
                <YAxis
                  hide={true}
                  domain={[
                    (dataMin) =>
                      dataMin > 6000 &&
                      (timeframe === '1Y' || timeframe === 'YTD')
                        ? dataMin / 2
                        : dataMin,
                    (dataMax) =>
                      dataMax > 10000 &&
                      (timeframe === '1Y' || timeframe === 'YTD')
                        ? dataMax
                        : dataMax,
                  ]}
                />
              </AreaChart>
            </div>
          </>
        ) : (
          <h1>( ͡° ͜ʖ ͡°)</h1>
        )}
      </div>
    </div>
  );
};

export default Charts;
