# This is note for the future

## Problem: fetched data needs to be modified

Initially I had to split the incoming data in order to modify each data info, and then combine them back to normal before showing on chart.
(This approach makes app VERY slow)
How did I fixed this?
READ THE DOCUMENT. Yup! I didn't know Rechart.js has options for you to modified data before it's being shown

- Splitting data into 2 arrays

  https://medium.com/javascript-in-plain-english/how-to-add-to-an-array-in-react-state-3d08ddb2e1dc
  ^ this link was a good read about using spread operator and wrapper fn for problem below

  await data.forEach((el) => {
  setTimestamp((timestamp) => [...timestamp, el.timestamp]);
  setRate((rate) => [...rate, el.rate]);

  });

- Combining the arrays that I splitted earlier after modifications

        let chartData = [];
          rate.forEach((each, i) => {
            chartData.push({
              timestamp: new Date(timestamp[i]).toLocaleString(),
              rate: (each * 1).toFixed(3),
            });
          });

Line Chart from Rechart.js for reference

     <LineChart
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
      </LineChart>
