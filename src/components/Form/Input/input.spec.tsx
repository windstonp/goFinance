import React from 'react';
import Theme from '../../../global/styles/theme';
import { render } from '@testing-library/react-native';
import { Input } from '.';
import { ThemeProvider } from 'styled-components/native';

const AppProvider: React.FC = ({children}) =>(
  <ThemeProvider theme={Theme}>
    {children}
  </ThemeProvider>
);

describe('Input Component', ()=>{
  it('must have specific border color when active ',()=>{
    const { getByTestId } = render(
      <Input
        testID="input"
        placeholder="email"
        autoCorrect={false}
        active={true}
      />,
      {
        wrapper: AppProvider
      }
    );

    const inputComponent = getByTestId('input');

    expect(inputComponent.props.style[0].borderColor).toEqual(Theme.colors.danger);
    expect(inputComponent.props.style[0].borderWidth).toEqual(3);

  });
});