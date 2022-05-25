import React from 'react';
import theme from '../../global/styles/theme';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Register } from '.';
import { ThemeProvider } from 'styled-components/native';
import { NavigationContainer } from '@react-navigation/native';

const TestProvider: React.FC = ({children})=>(
  <ThemeProvider theme={theme}>
    <NavigationContainer>
      {children}
    </NavigationContainer>
  </ThemeProvider>
)

describe('Register Screen',()=>{

  it('Should open category modal when user click on category button', async ()=>{
    const { getByTestId } = render(<Register />,{
      wrapper: TestProvider
    });

    const modalCategory = getByTestId('modal-category');
    const modalCategoryButton = getByTestId('modal-category-button');
    fireEvent.press(modalCategoryButton);

    await waitFor(()=>{
      expect(modalCategory.props.visible).toBeTruthy();
    }); 
  });
}); 