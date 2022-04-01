import React, { FC, useRef, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { style } from './style';
import { useDispatch, useSelector } from 'react-redux';
import { COLORS } from '../../COLORS';
import { createNewItemHelper } from '../../helpers/createNewItemHelper';
import { TodoItemType } from '../../models';
import { useNavigation } from '@react-navigation/native';
import { AddNewItemScreenNavigationProps } from './type';
import { userTokenSelector } from '../../redux/selectors/userTokenSelector';
import { addItemSagaAction } from '../../redux/actions/todoSagaActions/addItemSagaAction';
import { deviceTokenSelector } from '../../redux/selectors/deviceTokenSelector';
import { createNotificationHelper } from '../../helpers/createNotificationHelper';
import DatePicker from 'react-native-date-picker';
import { CustomInput } from '../../components/CustomInput';

export const AddNewItemScreen: FC = () => {
  const navigation = useNavigation<AddNewItemScreenNavigationProps>();
  const dispatch = useDispatch();

  const userToken = useSelector(userTokenSelector);
  const channelId = useSelector(deviceTokenSelector);
  const inputRef = useRef<TextInput>(null);

  const [text, setText] = useState<string>('');
  const [date, setDate] = useState(new Date());
  const [open, setOpen] = useState<boolean>(false);
  const currentDate = `${date.getDate()}.${date.getMonth()}.${date.getFullYear()} at ${date.getHours()}:${date.getMinutes()}`;
  const buttonStyle = text ? style.button : style.buttonDis;

  const addItem = (text: TodoItemType['text']) => {
    const newItem = createNewItemHelper(text);
    createNotificationHelper({ channelId, newItem, date });
    dispatch(addItemSagaAction({ newItem, userToken }));
  };

  const onPress = () => {
    addItem(text);
    navigation.goBack();
  };

  const onConfirmDate = (date: Date) => {
    setOpen(false);
    setDate(date);
  };
  const onCancelDate = () => {
    setOpen(false);
  };

  const openDate = () => {
    return setOpen(true);
  };
  const openInput = () => {
    return inputRef.current?.focus();
  };

  return (
    <View style={style.container}>
      <View style={{ width: '100%' }}>
        <CustomInput
          onChangeText={setText}
          placeholder={'New task'}
          value={text}
          selectionColor={COLORS.black}
          title={'Add new tack'}
          onPress={openInput}
          editable={true}
          inputRef={inputRef}
        />
        <CustomInput
          value={currentDate}
          selectionColor={COLORS.black}
          title={'Set the reminder send time'}
          editable={false}
          onPress={openDate}
        />
      </View>
      <DatePicker
        minimumDate={new Date()}
        modal
        open={open}
        date={date}
        onConfirm={onConfirmDate}
        onCancel={onCancelDate}
      />
      <TouchableOpacity disabled={!text} style={buttonStyle} onPress={onPress}>
        <Text style={style.text}>{'Add new task'}</Text>
      </TouchableOpacity>
    </View>
  );
};
