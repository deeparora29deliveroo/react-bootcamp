import React from 'react';
import { shallow } from 'enzyme';
import fetch from '@deliveroo/fetch';
import DataLoaderExample from './index';

jest.mock('@deliveroo/fetch', () => jest.fn());

describe('DataLoaderExample', () => {
  it('should render initial button correctly', () => {
    const wrapper = shallow(<DataLoaderExample />);

    expect(wrapper.find('withLayout(withSpacing(Button))').html()).toContain(
      'Load Sample API Data',
    );
  });

  it('should load data and render it', async () => {
    fetch.mockImplementation(() => Promise.resolve({ json: { data: { msg: 'sample message' } } }));

    const wrapper = shallow(<DataLoaderExample />);

    wrapper.find('withLayout(withSpacing(Button))').simulate('click');

    return new Promise((resolve) => {
      setTimeout(() => {
        const resetBtn = wrapper.find('withLayout(withSpacing(Button))');

        expect(resetBtn.html()).toContain('Reset');
        expect(resetBtn.prop('isDestructive')).toBe(true);

        expect(wrapper.html()).toContain('sample message');
        fetch.mockReset();
        resolve(null);
      }, 0);
    });
  });
});
