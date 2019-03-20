export default (data) => {
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

