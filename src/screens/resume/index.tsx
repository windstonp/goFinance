import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useEffect, useState, useCallback} from 'react';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components';
import { VictoryPie } from 'victory-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { addMonths, format, subMonths } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ActivityIndicator } from 'react-native';
import { useFocusEffect } from '@react-navigation/core';

import { HistoryCard } from '../../components/HistoryCard';
import { categories } from '../../utils/categories';
import { 
  Container, 
  Header, 
  Title, 
  Content, 
  ChartContainer, 
  MonthSelectButton, 
  MonthSelect, 
  SelectIcon, 
  Month, 
  LoadContainer 
} from './styles';
import { useAuth } from '../../hooks/Auth';

interface TransactionData{
  type: 'positive' | 'negative',
  name: string,
  amount: string,
  category: string,
  date: string
}

interface CategoryData{
  name: string,
  total: number,
  totalFormatted: string,
  color: string,
  percent: string,
  key: string
}

export function Resume(){
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [totalByCategories, setTotalByCategories] = useState<CategoryData[]>([])
  const theme = useTheme();

  async function loadData()
  {
    setIsLoading(true);
    const dataKey = `@gofinance:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const responseFormatted: TransactionData[] = response ? JSON.parse(response) : [];

    const expensives = responseFormatted
      .filter((expensive: TransactionData) => 
        expensive.type === 'negative' && 
        new Date(expensive.date).getMonth() === selectedDate.getMonth() &&
        new Date(expensive.date).getFullYear() === selectedDate.getFullYear() 
      ) 

    const expensivesTotal = expensives
      .reduce((accumulator: number, expensive: TransactionData) =>{
        return accumulator += Number(expensive.amount);
      }, 0);

    const totalByCategory: CategoryData[] = [];

    categories.forEach(category => {
      let categorySum = 0;

      expensives.forEach(expensive => {
        if(expensive.category === category.key){
          categorySum += Number(expensive.amount);
        }
      });
      
      const percent = `${(categorySum / expensivesTotal * 100).toFixed(0)}%`

      if(categorySum > 0){
        totalByCategory.push({
          key: category.key,
          name: category.name,
          total: categorySum,
          totalFormatted: categorySum.toLocaleString('pt-BR',{
            style: 'currency',
            currency: 'BRL'
          }),
          color: category.color,
          percent
        });
      }
    });

    setTotalByCategories(totalByCategory);
    setIsLoading(false);
  }

  function handleDateChange(action: 'next' | 'prev')
  {
    if(action === 'next'){
      setSelectedDate(addMonths(selectedDate, 1));
    }else{
      setSelectedDate(subMonths(selectedDate, 1));
    }
  }

  useFocusEffect(useCallback(()=>{
    loadData();
  }, [selectedDate]));
  return(
    <Container>
        <Header>
          <Title>
            Resumo por categoria
          </Title>
        </Header>
        { isLoading 
          ? 
            <LoadContainer>
              <ActivityIndicator color={theme.colors.primary} size="large"/>
            </LoadContainer> 
          :
          <Content
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: 24,
              paddingBottom: useBottomTabBarHeight(),
            }}
          >
            <MonthSelect>

              <MonthSelectButton onPress={()=> handleDateChange('prev')}>
                <SelectIcon name="chevron-left"/>
              </MonthSelectButton>

              <Month>{format(selectedDate, 'MMMM, yyyy', {
                locale: ptBR
              })}</Month>

              <MonthSelectButton onPress={()=> handleDateChange('next')}>
                <SelectIcon name="chevron-right"/>
              </MonthSelectButton>

            </MonthSelect>
            <ChartContainer>
              <VictoryPie 
                data={totalByCategories}
                colorScale={totalByCategories.map(category => category.color)}
                style={{
                  labels: {
                    fontSize: RFValue(18),
                    fontWeight: 'bold',
                    fill: theme.colors.shape
                  }
                }}
                labelRadius={50}
                x="percent"
                y="total"
              />
            </ChartContainer>
            {
              totalByCategories.map((category)=>
                <HistoryCard 
                  key={category.key}
                  title={category.name}
                  amount={category.totalFormatted}
                  color={category.color}
                />
              )
            }
          </Content>
        }
    </Container>
  );
}