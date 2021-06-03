import logo from './logo.svg';
import './App.css';
import { start, stop, graphData, queryResponse, query, single, setLimits } from './api-service';
import { XYPlot, HorizontalGridLines, LineSeries, XAxis, YAxis, VerticalGridLines } from 'react-vis'
import { Button } from 'react-bootstrap'
import "react-vis/dist/style.css";
import { generateChartData } from './chart-service'
import { useState } from 'react';


function App() {
  const [data, setData] = useState()
  const [min, setMin] = useState(1550)
  const [max, setMax] = useState(1560)
  const [queryText, setQuery] = useState()
  const [queryResponseText, setResponse] = useState()

  graphData.subscribe(res => {
    setData(generateChartData(res, min, max))
  })

  queryResponse.subscribe(res => {
    setResponse(res)
  })

  return (
    <div className="App">
      <Button onClick={start}>Start</Button>
      <Button onClick={stop}>Stop</Button>
      <Button onClick={single}>Single</Button>
      <br /><br />

      <form>
        <label for="min">Minimum wavelength(nm)</label>
        <input onChange={event => setMin(event.target.value)} id="min" type="number" />
        <label for="max">Maximum wavelength(nm)</label>
        <input onChange={event => setMax(event.target.value)} id="max" type="number" />
        <button type="button" onClick={_ => setLimits(min, max)}>Update Limits</button>
      </form>

      <br /><br />

      <span><h4>Queries: IDN (gets device ID), LIM (gets x axis limits), STATE (gets current state)</h4></span>
      <form>
        <label for="query">Enter Query:</label>
        <input id="query" type="text" onChange={event => setQuery(event.target.value)} />
        <button type="button" onClick={_ => query(queryText)}>Submit Query</button>
        <button type="button" onClick={_ => setResponse(undefined)}>Clear</button>
      </form>
      {queryResponseText == undefined ? null : <span><h4>Query Response: </h4>{queryResponseText}</span>}

      {data == undefined
        ? <span><h3>Waiting for data...</h3></span>
        : <XYPlot width={900} height={600}>
          <HorizontalGridLines />
          <VerticalGridLines />
          <LineSeries data={data} />
          <XAxis tickTotal={10} title="Wavelength (m)"/>
          <YAxis title="Signal (DBM)"/>
        </XYPlot>}
    </div>
  );
}

export default App;
