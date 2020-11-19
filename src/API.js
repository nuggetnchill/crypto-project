import { useState, useEffect } from 'react';

const proxy = 'https://cors-anywhere.herokuapp.com/';
const NOMICS_API_URL = `${proxy}https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_KEY}&ids=BTC,ETH,XRP&interval=1d,30d&convert=EUR&per-page=100&page=1`;

const API = () => {
  const [info, setInfo] = useState(null);

  const fetchData = async () => {
    const response = await fetch(NOMICS_API_URL);
    const data = await response.json();
    await setInfo(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log(info);

  return (
    <>
      <h2>From API.js</h2>
    </>
  );
};

export default API;
