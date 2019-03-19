import "isomorphic-fetch";

const findDroneData = async () => {
  const response = await fetch(
    `https://react-assessment-api.herokuapp.com/api/drone`
  );
  if (!response.ok) {
    return { error: { code: response.status } };
  }
  const json = await response.json();
  const { data } = json;
  return { data };
};

export default findDroneData;
