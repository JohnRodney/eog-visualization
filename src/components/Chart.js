import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import LinearProgress from "@material-ui/core/LinearProgress";
import CardHeaderRaw from "@material-ui/core/CardHeader";
import { withStyles } from "@material-ui/core/styles";
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Thermometer from 'react-thermometer-component';
import pollInterval from '../constants/interval';
import transformData from '../utilities/transform-data';
import getDomainFromData from '../utilities/get-domain';

const renderLineChart = (data, width, yDomain) => (
  <LineChart width={width * .7} height={300} data={transformData(data)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="metric" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="time" />
    <YAxis domain={[yDomain.min, yDomain.max]} allowDecimals={false} />
    <Tooltip />
  </LineChart>
);

const renderBarChart = (data, width, yDomain) => (
  <BarChart width={width * .9} height={200} data={transformData(data)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Bar type="monotone" dataKey="metric" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="time" />
    <YAxis domain={[yDomain.min, yDomain.max]} allowDecimals={false} />
    <Tooltip />
  </BarChart>
);

const cardStyles = theme => ({
  root: {
    background: theme.palette.primary.main
  },
  title: {
    color: "white"
  }
});

const CardHeader = withStyles(cardStyles)(CardHeaderRaw);

const styles = {
  card: {
    margin: "20px 10px",
  },
  cardSplit: {
    margin: "20px 10px",
    display: 'inline-block',
    width: "calc(80% - 40px)"
  },
  thermometer: {
    textAlign: 'center',
    margin: "20px 10px",
    display: 'inline-block',
    width: "20%"
  }
};

class Chart extends Component {
  componentDidMount() {
    this.props.onLoad();
  }

  /* When the data update it is really jarring to rerender the entire chart and component so we use the should component update function to
   * catch the data change and update the chart only */
  shouldComponentUpdate(nxtProps, nxtState) {
    const { data, loading } = this.props;
    if (data.length > 0 && !loading) {
      return false;
    }
    return true;
  }

  render() {
    const {
      loading,
      data,
      classes,
    } = this.props;

    if (loading) return <LinearProgress />;

    setTimeout(this.props.onLoad, pollInterval);
    console.log(data)
    return (
      <div>
        <Card className={classes.thermometer}>
          <CardHeader title="Reactive Thermometer" />
          <CardContent>
            <Thermometer
              style={{ marginLeft: '400px' }}
              theme="light"
              value={data.length > 0 ? Math.floor(data[data.length-1].metric) : 0}
              max="400"
              steps="3"
              format="°C"
              size="large"
              height="300"
            />
          </CardContent>
        </Card>

        <Card className={classes.cardSplit}>
          <CardHeader title="Reactive Line Chart" />
          <CardContent>
            { renderLineChart(data, window.innerWidth, getDomainFromData(data)) }
          </CardContent>
        </Card>
        <Card className={classes.card}>
          <CardHeader title="Reactive Bar Chart" />
          <CardContent>
            { renderBarChart(data, window.innerWidth, getDomainFromData(data)) }
          </CardContent>
        </Card>

      </div>
    );
  }
}

const mapState = (state, ownProps) => {
  const {
    loading,
    data,
  } = state.drone;

  return {
    loading,
    data,
  };
};

const mapDispatch = dispatch => ({
  onLoad: () =>
    dispatch({
      type: actions.FETCH_DRONE,
    })
});

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(Chart));
