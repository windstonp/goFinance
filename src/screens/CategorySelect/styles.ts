import styled from 'styled-components/native';
import {Feather} from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { FlatList } from 'react-native';
import { CategoryProps } from '.';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

interface DataCategoriesListProps extends CategoryProps{
  icon: string
}

interface CategoryItemProps{
  isActive: boolean;
}

export const Container = styled(GestureHandlerRootView)`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background};
`;

export const Header = styled.View`
  width: 100%;
  height: ${RFValue(113)}px;
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: flex-end;
  padding-bottom: ${RFValue(19)}px;
`; 
export const Title = styled.Text`
  font-family: ${({theme}) => theme.fonts.medium};
  color: ${({theme}) => theme.colors.shape};
  font-size: ${RFValue(18)}px;
`;

export const CategoriesList = styled(
  FlatList as new () => FlatList<DataCategoriesListProps>
)`
  width: 100%;
  flex: 1;
`;

export const Category = styled.TouchableOpacity<CategoryItemProps>`
  width: 100%;
  padding: ${RFValue(15)}px;
  flex-direction: row;
  align-items: center;

  background-color: ${({isActive, theme}) => 
    isActive ? theme.colors.secondary_light : theme.colors.background
  }

`;

export const Icon = styled(Feather)`
  font-size: ${RFValue(20)}px;
  margin-right: ${RFValue(16)}px;
`;

export const Name = styled.Text`
  font-family: ${({theme}) => theme.fonts.regular};
  font-size: ${RFValue(14)}px;
`;

export const Separator = styled.View`
  height: 1px;
  width: 100%;
  background-color: ${({theme}) => theme.colors.text};
`;

export const Footer = styled.View`
  width: 100%;
  padding: ${RFValue(24)}px;

`;