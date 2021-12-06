import styled, {css} from "styled-components/native";
import { Feather } from '@expo/vector-icons';
import { RFValue } from "react-native-responsive-fontsize";
import { RectButton, RectButtonProps } from "react-native-gesture-handler";

interface IconProps{
  type: 'up' | 'down';
}

interface ContainerProps extends RectButtonProps{
  isActive: boolean;
  type: 'up' | 'down'
}

export const Container = styled.View<ContainerProps>`
  width: 48%;
  border-width: ${({isActive}) => isActive ? 0 : RFValue(1.5)}px;
  border-color: ${({theme}) => theme.colors.text};
  border-radius: ${RFValue(5)}px;
  justify-content: center;

  ${({isActive, type}) => isActive && type === 'up' && css`
    background-color: ${({theme}) => theme.colors.success_light};
  `}

  ${({isActive, type}) => isActive && type === 'down' && css`
    background-color: ${({theme}) => theme.colors.danger_light};
  `}
  
`;

export const Button = styled(RectButton)`
  flex-direction: row;
  align-items: center;
  border-style: solid;
  padding: ${RFValue(16)}px;

`;

export const Icon = styled(Feather)<IconProps>`
  font-size: ${RFValue(24)}px;
  margin-right: ${RFValue(12)}px;

  color: ${({theme, type}) => 
    type === 'up' ? theme.colors.success : theme.colors.danger
  }
`;

export const Title = styled.Text`
  color: ${({theme}) => theme.colors.text_dark};
  font-size: ${RFValue(14)}px;
  font-family: ${({theme}) => theme.fonts.regular};
`;