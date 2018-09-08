import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import App from './App';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('sanity test', () => {
  const wrapper = shallow(<App/>)
  expect(wrapper.find('.app')).toHaveLength(1)
})
