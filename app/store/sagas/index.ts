/**
 *  Redux saga class init
 */
import { takeEvery, all, takeLatest } from 'redux-saga/effects';
import * as types from '../actions/types';
import {loginSaga, registerSaga, searchUsersSaga, watchSearchUsersRequest} from './loginRegisterSaga';
import HomeSaga from './HomeSaga';
import { groupSaga, fetchGroupSaga } from './groupSaga';
import { ExpenseSaga } from './ExpenseSaga';



export default function* watch() {
  yield all([
    takeEvery(types.LOGIN_REQUEST, loginSaga),
    takeEvery(types.REGISTER_REQUEST, registerSaga),
    takeEvery(types.FetchEmployees, HomeSaga),
    takeEvery(types.FetchGroupMembers, groupSaga),
    takeEvery(types.FETCH_GROUPS, fetchGroupSaga),
    takeLatest(types.FETCH_USERS_BY_PARAM, searchUsersSaga),
    takeEvery(types.ADD_EXPENSE, ExpenseSaga),
  ]);
}
