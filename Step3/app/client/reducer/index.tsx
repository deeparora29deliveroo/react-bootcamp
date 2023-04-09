import { AnyAction } from 'redux';

const labels: string[] = ['Select 1', 'Select 2', 'Select 3'];

const selectedValueReducer = function (
  state = { allValues: labels, selectedValue: labels[0] },
  action: AnyAction,
) {
  switch (action.type) {
    case 'SELECTED_VALUE_CHANGED':
      return {
        ...state,
        selectedValue: action.payload,
      };
    default:
      return state;
  }
};

export default selectedValueReducer;
