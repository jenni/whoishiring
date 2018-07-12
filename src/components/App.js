import React, { Component } from "react";
import axios from "axios";
import Chart from "react-chartjs";
import { formatData, chartOptions } from '../utils'

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "December"
];

class App extends Component {
  state = {
    selectedMonth: new Date().getMonth(),
    selectedYear: new Date().getFullYear()
  };

  componentDidMount() {
    axios.get("/api").then(response =>
      this.setState({
        data: formatData(
          response.data,
          this.state.selectedMonth,
          this.state.selectedYear
        )
      })
    );
  }

  render() {
    const LineChart = Chart.Line;

    return (
      <div>
        {this.state.data && (
          <div>
            <LineChart data={this.state.data} options={chartOptions} width="600" height="250" />
            <p>{months[this.state.selectedMonth]}</p>
          </div>
        )}
      </div>
    );
  }
}

export default App;
