import { Text } from '@deliveroo/tools-component-library';
import React from 'react';

import { connect } from 'react-redux';

const mapStateToPros = (state: any) => {
  return {
    selectedValue: state.selectedValue,
  };
};

const ConnectedVaryingText = connect(mapStateToPros)(VaryingText);
export default ConnectedVaryingText;

function VaryingText(props: any) {
  // eslint-disable-next-line no-console
  return (
    <>
      <Text>{`Selected value is ${props.selectedValue}`}</Text>
    </>
  );
}
