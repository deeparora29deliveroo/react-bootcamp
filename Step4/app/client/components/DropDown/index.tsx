import React, { useState } from 'react';
import { Select, Option, Text } from "@deliveroo/tools-component-library";

const labels: string[] = ['Select 1', 'Select 2', 'Select 3'];
export default function DropDown() {
  const [selectedValue, setSelectedValue] = useState(labels[0]);

  return (
    <>
      <Select onChange={setSelectedValue} value={selectedValue}>
        {labels.map((value) => (
          <Option value={value}>
            {value}
          </Option>
        ))}
      </Select>
      <Text>{`Selected value is ${selectedValue}`}</Text>
    </>
  );
}
