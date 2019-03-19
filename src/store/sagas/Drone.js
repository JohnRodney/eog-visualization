import { takeEvery, call, put, cancel, all } from "redux-saga/effects";
import API from "../api";
import * as actions from "../actions";

/*
  1. The drone service allows us to get the last 30 minutes worth of data in an array.
  2. We then return that array to the store for the component to consume.

*/

function* watchFetchDrone(action) {
  const { error, data } = yield call(
    API.findDroneData,
  );

  if (error) {
    console.log({ error });
    yield put({ type: actions.API_ERROR, code: error.code });
    yield cancel();
    return;
  }

  yield put({ type: actions.DRONE_DATA_RECEIVED, data });
}

function* watchAppLoad() {
  yield all([
    takeEvery(actions.FETCH_DRONE, watchFetchDrone),
  ]);
}

export default [watchAppLoad];
