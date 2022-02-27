import React, { useState, FC } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { style } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { addItemAction } from '../../redux/actions/todoActions/addItemAction';
import { COLORS } from '../../COLORS';
import { createNewItemHelper } from '../../helpers/createNewItemHelper';
import { TodoItemType } from '../../models';
import { useNavigation } from '@react-navigation/native';
import { AddNewItemScreenNavigationProps } from './type';
import { firebase } from '@react-native-firebase/database';

export const AddNewItemScreen: FC = () => {
  const navigation = useNavigation<AddNewItemScreenNavigationProps>();
  const dispatch = useDispatch();
  const userToken = useSelector(state => {
    return state.userToken;
  });

  const [text, setText] = useState<string>('');
  const buttonStyle = text ? style.button : style.buttonDis;

  const setData = async (newItem, userToken) => {
    await firebase
      .app()
      .database(
        `https://fir-2f0d3-default-rtdb.europe-west1.firebasedatabase.app/`,
      )
      .ref(`Users/User${userToken}/Todo`)
      .push(newItem);
  };

  const addItem = async (text: TodoItemType['text']) => {
    const newItem = createNewItemHelper(text);
    await setData(newItem, userToken);
    dispatch(addItemAction({ newItem }));
  };

  const onPress = () => {
    addItem(text);
    navigation.goBack();
  };

  return (
    <View style={style.container}>
      <TextInput
        style={style.input}
        placeholder="New task"
        onChangeText={setText}
        value={text}
        selectionColor={COLORS.black}
      />
      <TouchableOpacity disabled={!text} style={buttonStyle} onPress={onPress}>
        <Text style={style.text}>{'Add new task'}</Text>
      </TouchableOpacity>
    </View>
  );
};
