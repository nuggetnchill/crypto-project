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

const proxy = 'https://cors-anywhere.herokuapp.com/';
const NOMICS_API_URL = `https://api.nomics.com/v1/currencies/ticker?key=${process.env.REACT_APP_KEY}&ids=BTC,ETH,XRP&interval=1d,30d&per-page=100&page=1`;
const NOMICS_API_PRICE_URL = `https://api.nomics.com/v1/exchange-rates/history?key=${process.env.REACT_APP_KEY}&currency=BTC&start=2020-11-18T00%3A00%3A00Z&end=2020-11-19T00%3A00%3A00Z`;
const API = () => {
  const [rate, setRate] = useState(null);

  const fetchData = async () => {
    const response = await fetch(NOMICS_API_PRICE_URL);
    const data = await response.json();
    setRate(data);
    // localStorage.data = data;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const testData = [
    {
      timestamp: new Date('2020-11-18T00:00:00Z').toLocaleString(),
      rate: '17707.4804835780456301544019364329908188821240901781720509203',
    },
    {
      timestamp: new Date('2020-11-18T01:00:00Z').toLocaleString(),
      rate: '17752.62652713041438343665782369702047530',
    },
    {
      timestamp: '2020-11-18T02:00:00Z',
      rate: '17689.63368363485321292417133465764478856410531753596426115949',
    },
    {
      timestamp: '2020-11-18T03:00:00Z',
      rate: '18030.524021899248012123188318052646966024411551103082503018403',
    },
    {
      timestamp: '2020-11-18T04:00:00Z',
      rate: '18352.363332767944326220939199006128649960994786540973419697386',
    },
    {
      timestamp: '2020-11-18T05:00:00Z',
      rate: '17626.804940510479144692162998953008935545246052117888980960857',
    },
    {
      timestamp: '2020-11-18T06:00:00Z',
      rate: '17781.85464998968051333026232194253947882917299470186860743056',
    },
    {
      timestamp: '2020-11-18T07:00:00Z',
      rate: '18074.353366021459417370698780306567028909951306270282336619058',
    },
    {
      timestamp: '2020-11-18T08:00:00Z',
      rate: '18208.15080483776199779382433779909218249424680332575903789505',
    },
    {
      timestamp: '2020-11-18T09:00:00Z',
      rate: '18105.544029437231786398236665419274196963557333060051801794764',
    },
    {
      timestamp: '2020-11-18T10:00:00Z',
      rate: '18234.114534461540633488698548702547339817901678161610002690586',
    },
    {
      timestamp: '2020-11-18T11:00:00Z',
      rate: '18244.868510202894642123042939965579707892355802338432060499978',
    },
    {
      timestamp: '2020-11-18T12:00:00Z',
      rate: '18035.24844538140409248340468429441004235832308580127659984828',
    },
    {
      timestamp: '2020-11-18T13:00:00Z',
      rate: '17884.301864371323638536767078228810838110762654847383973989156',
    },
    {
      timestamp: '2020-11-18T14:00:00Z',
      rate: '17701.698136847425484619963323263065884506565267309957905338139',
    },
    {
      timestamp: '2020-11-18T15:00:00Z',
      rate: '17886.478985041321587985199552193919233771587397497489882950471',
    },
    {
      timestamp: '2020-11-18T16:00:00Z',
      rate: '17809.45829061060618881808212610342346187407320559089782375164',
    },
    {
      timestamp: '2020-11-18T17:00:00Z',
      rate: '17904.41760021563534961240377056011265132485507264799854098811',
    },
    {
      timestamp: '2020-11-18T18:00:00Z',
      rate: '17784.11400126110240426434618341077533727955917099638183110770',
    },
    {
      timestamp: '2020-11-18T19:00:00Z',
      rate: '17664.201479752204184351212580964792797848376779492312139523929',
    },
    {
      timestamp: '2020-11-18T20:00:00Z',
      rate: '17660.3321146101472239242480222143798398059430122216992286217',
    },
    {
      timestamp: '2020-11-18T21:00:00Z',
      rate: '17787.87471948480588498096545450938586183655071814801563329390',
    },
    {
      timestamp: '2020-11-18T22:00:00Z',
      rate: '17835.1518848485274814077282539238536382990768626482554834352',
    },
    {
      timestamp: '2020-11-18T23:00:00Z',
      rate: '17788.422092221982897827789050520270972325964811414870989636628',
    },
    {
      timestamp: '2020-11-19T00:00:00Z',
      rate: '17777.792476871888685894697630756026696634245594928265970693806',
    },
  ];

  return (
    <div className='container'>
      <LineChart
        width={1000}
        height={300}
        data={testData}
        margin={{ top: 5, right: 10, left: 20, bottom: 5 }}
      >
        <XAxis dataKey='timestamp' />
        <YAxis dataKey='rate' padding={{ bottom: -600, top: 0 }} />
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
