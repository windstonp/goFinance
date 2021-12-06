import styled from 'styled-components/native';

import {Feather} from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type TransactionProps = {
  type: 'positive' | 'negative'
}

export const Container = styled.View`
  background-color: ${({theme}) => theme.colors.shape};
  border-radius: ${RFValue(5)}px;
  padding: ${RFValue(17)}px ${RFValue(24)}px;
  margin-bottom: ${RFValue(16)}px;
`;

export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;

export const Amount = styled.Text<TransactionProps>`
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme, type}) => 
    type === 'negative' ? theme.colors.danger : theme.colors.success
  };
  font-size: ${RFValue(20)}px;
  margin-top: ${RFValue(2)}px;
`;

export const Footer = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: ${RFValue(20)}px;
`;

export const Category = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const CategoryName = styled.Text`
  font-size: ${RFValue(14)}px;
  margin-left: ${RFValue(17)}px;
  color: ${({theme}) => theme.colors.text};
`;

export const Date = styled.Text`
  font-size: ${RFValue(14)}px;
  color: ${({theme}) => theme.colors.text};
`;
