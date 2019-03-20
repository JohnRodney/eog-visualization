import moment from 'moment';

export default (data) => {
  return data.map(entry => {
    const transformedEntry = entry;
    transformedEntry.time = moment(entry.timestamp).format('hh:mm:ss A');
    return transformedEntry;
  });
}
