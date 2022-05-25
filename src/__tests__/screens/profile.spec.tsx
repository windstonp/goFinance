import React from 'react';
import { render } from '@testing-library/react-native';

import { Profile } from '../../screens/Profile';

describe('Profile', ()=>{
  it('check if correctly user input name placeholder', () => {
    const { getByPlaceholderText } = render(<Profile />);
  
    const inputName = getByPlaceholderText("Nome");
  
    expect(inputName).toBeTruthy();
  });
  
  it('checks if user data was loaded', () => {
    const { getByTestId } = render(<Profile />);
  
    const inputName = getByTestId('input-name');
    const inputSurName = getByTestId('input-surname')
  
    expect(inputName.props.value).toEqual('Rogrigo')
    expect(inputSurName.props.value).toEqual('Gonçalves')
  
  });
  
  it('check if title render correctly', ()=>{
    const { getByTestId } = render(<Profile />);
  
    const textTitle = getByTestId("text-title");
  
    expect(textTitle.props.children).toContain('Perfil');
  });
});

