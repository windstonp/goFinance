import React from 'react';
import { RectButtonProps } from 'react-native-gesture-handler';
import { 
  Container,
  Category,
  Icon,
} from './styles';

interface Props extends RectButtonProps{
  title: string,
  onPress: () => void,
  testID?: string,
  activeOpacity?: number 
}
export function CategorySelectButton({
  title,
  onPress,
  testID,
  ...rest
}: Props){
  return(
    <Container onPress={onPress} testID={testID} {...rest}>
      <Category>
        {title}
      </Category>
      <Icon name="chevron-down"/>
    </Container>
  )
}