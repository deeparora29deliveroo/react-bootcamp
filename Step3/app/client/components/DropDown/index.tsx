import React from 'react';
import { Select, Option, Text } from '@deliveroo/tools-component-library';
import { connect } from 'react-redux';

const mapStateToPros = (state: any) => {
  return {
    selectedValue: state.selectedValue,
    allValues: state.allValues,
  };
};
const mapDispatchToProps = (dispatch: any) => {
  return {
    handleValueChange: (value: string) => {
      dispatch({ type: 'SELECTED_VALUE_CHANGED', payload: value });
    },
  };
};

const ConnectedDropDown = connect(mapStateToPros, mapDispatchToProps)(DropDown);
export default ConnectedDropDown;

function DropDown(props: any) {
  // eslint-disable-next-line no-console
  return (
    <>
      <Select
        value={props.selectedValue}
        onChange={(value) => {
          props.handleValueChange(value);
        }}
      >
        {props.allValues.map((value: string) => (
          <Option value={value}>{value}</Option>
        ))}
      </Select>
      <Text>{`Selected value is ${props.selectedValue}`}</Text>
    </>
  );
}
