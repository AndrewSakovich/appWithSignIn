import { put } from 'redux-saga/effects';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth';
import { createReferenceHelper } from '../../helpers/createReferenceHelper';
import { signInAction } from '../actions/authActions/signInAction';
import { FirebaseDatabaseTypes } from '@react-native-firebase/database';
import DataSnapshot = FirebaseDatabaseTypes.DataSnapshot;
import { TodoItemType } from '../../models';

export function* signInSaga() {
  const path = () => {
    return `Users/${userToken}/Todo`;
  };

  const { idToken } = yield GoogleSignin.signIn();
  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  // Sign-in the user with the credential
  const { user } = yield auth().signInWithCredential(googleCredential);

  const userToken = user.uid;

  const usersData: DataSnapshot = yield createReferenceHelper
    .ref(`/Users/`)
    .once('value');
  const users = Object.keys(usersData.val() ?? {});

  const todoItemsData: DataSnapshot = yield createReferenceHelper
    .ref(path())
    .once('value');
  const todoItems: TodoItemType[] = Object.values(todoItemsData.val() ?? {});

  const checkUser = users.find(item => {
    return item === userToken;
  });

  if (checkUser) {
    yield put(signInAction({ userToken, user, todoItems }));
  } else {
    yield createReferenceHelper
      .ref(`/Users/`)
      .child(`${userToken}`)
      .set(userToken);

    yield put(signInAction({ userToken, user, todoItems }));
  }
}
