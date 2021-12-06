import React from 'react';
import { Button } from '../../components/Form/Button';

import { categories } from '../../utils/categories';

import { 
  Container,
  Header, 
  Title,
  CategoriesList,
  Category,
  Icon,
  Name,
  Separator,
  Footer,
} from './styles';

export interface CategoryProps{
  key: string,
  name: string,
}

interface Props{
  category: CategoryProps,
  setCategory: (category: CategoryProps) => void,
  CloseSelectCategory: () => void
}

export function CategorySelect({
  category,
  setCategory,
  CloseSelectCategory
}: Props){
  function handleSetCategory(category: CategoryProps){
    setCategory(category);
  }
  return (
    <Container>
      <Header>
        <Title>
          Categoria
        </Title>
      </Header>
      <CategoriesList 
        data={categories}
        keyExtractor={(item) => item.key}
        renderItem={({item}) => (
          <Category
            onPress={() => handleSetCategory(item)}
            isActive={category.key === item.key}
          >
            <Icon name={item.icon}/>
            <Name>
              {item.name}
            </Name>
          </Category>
        )}
        ItemSeparatorComponent={() => <Separator/>}
      />
      <Footer>
        <Button 
          title="Selecionar"
          onPress={CloseSelectCategory}
        />
      </Footer>
    </Container>
  )
}