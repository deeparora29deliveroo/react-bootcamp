import React from 'react';
import { shallow } from 'enzyme';

import App from './index';

describe('<App />', () => {
  it('should render the app header', () => {
    const result = shallow(<App />);
    expect(result.find('AppLayout').exists()).toBeTruthy();
  });
});
