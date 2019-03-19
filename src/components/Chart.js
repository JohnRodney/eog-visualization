import React, { Component } from "react";
import { connect } from "react-redux";
import * as actions from "../store/actions";
import LinearProgress from "@material-ui/core/LinearProgress";
import CardHeaderRaw from "@material-ui/core/CardHeader";
import { withStyles } from "@material-ui/core/styles";
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import moment from 'moment';

const pollInterval = 5000;

const transformData = (data) => {
  return data.map(entry => {
    const transformedEntry = entry;
    transformedEntry.time = moment(entry.timestamp).format('hh:mm:ss A');
    return transformedEntry;
  });
}

const getDomainFromData = (data) => {
  const padding = 10;
  let min = 1000000;
  let max = 0;
  data.forEach(entry => {
    const { metric } = entry;
    if (metric > max) {
      max = metric;
    }
    if (metric < min) {
      min = metric;
    }
  });

  min = Math.floor(min - padding);
  max = Math.ceil(max + padding);

  return {
    min,
    max,
  }
}

const renderLineChart = (data, width, yDomain) => (
  <LineChart width={width * .9} height={150} data={transformData(data)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
    <Line type="monotone" dataKey="metric" stroke="#8884d8" />
    <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
    <XAxis dataKey="time" />
    <YAxis domain={[yDomain.min, yDomain.max]} allowDecimals={false} />
    <Tooltip />
  </LineChart>
);

const renderBarChart = (data, width, yDomain) => (
  <BarChart width={width * .9} height={150} data={transformData(data)} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
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
    margin: "20px 10px"
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

    setTimeout(this.props.update, pollInterval);

    return (
      <div>
        <Card className={classes.card}>
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
    }),
  update: () =>
    dispatch({
      type: actions.FETCH_DRONE,
    })
});

export default connect(
  mapState,
  mapDispatch
)(withStyles(styles)(Chart));
