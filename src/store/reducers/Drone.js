import * as actions from "../actions";

const initialState = {
  loading: false,
  data: [],
};

const droneDataFetch = (state, action) => {
  return {
    ...state,
    loading: true,
  }
}

const droneDataRecevied = (state, action) => {
  const { data } = action;
  const loading = false;

  if (!data || data.length === 0) return state;

  return {
    ...state,
    loading,
    data,
  };
};

const handlers = {
  [actions.FETCH_DRONE]: droneDataFetch,
  [actions.DRONE_DATA_RECEIVED]: droneDataRecevied,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
