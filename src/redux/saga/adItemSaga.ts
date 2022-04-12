import { call, put } from 'redux-saga/effects';
import { addItemAction } from '../actions/todoActions/addItemAction';
import { createReferenceHelper } from '../../helpers/createReferenceHelper';
import { AddItemSagaAction } from '../actions/todoSagaActions/addItemSagaAction';
import { createAlertMessageHelper } from '../../helpers/createAlertMessageHelper';

export function* addItemSaga(action: AddItemSagaAction) {
  const { newItem, userToken, callback, loadingCallback } = action.payload;
  try {
    yield createReferenceHelper
      .ref(`Users/${userToken}/Todo/`)
      .child(`${newItem.id}`)
      .set(newItem);
    yield put(addItemAction({ newItem }));
    yield call(callback);
  } catch (error: any) {
    createAlertMessageHelper({
      message: `${error.message}`,
      title: 'Login error',
      cancelButtonTitle: 'Cancel',
    });
  } finally {
    yield call(loadingCallback);
  }
}
