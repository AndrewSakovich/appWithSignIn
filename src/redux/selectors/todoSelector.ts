import { ReduxStoreType } from '../store';

export const doneItemsSelectors =
  (flagDone: boolean) => (state: ReduxStoreType) => {
    if (flagDone) {
      return state.todoItems.filter(item => {
        return item.isDone;
      });
    }

    return state.todoItems.filter(item => {
      return !item.isDone;
    });
  };
