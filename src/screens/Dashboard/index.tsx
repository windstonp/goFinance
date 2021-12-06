import React, {useState, useEffect, useCallback} from 'react';
import { ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { HighlightCard } from '../../components/HighlightCard';
import { TransactionCard, TransactionCardProps } from '../../components/TransactionCard';
import { useFocusEffect } from '@react-navigation/native';
import {
  Container,
  Header,
  UserInfo,
  Photo,
  User,
  UserGreeting,
  UserName,
  UserWrapper,
  Icon,
  HighlightCards,
  Transactions,
  Title,
  TransactionsList,
  LogOutButton,
  LoadContainer,
} from './styles';
import { useTheme } from 'styled-components';
import { useAuth } from '../../hooks/Auth';

export interface DataListProps extends TransactionCardProps{
  id: string,
}

interface HighlightProps{
  amount: string,
  lastTransaction: string,
}

interface HighlightData{
  entries: HighlightProps,
  expensives: HighlightProps,
  total: HighlightProps,
}

export function Dashboard(){
  const theme = useTheme();
  const {user, logOut} = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTranssactions] = useState<DataListProps[]>([]);
  const [highlightData, setHighlightData] = useState<HighlightData>({} as HighlightData);

  function getLastTransactionDate(
    collection: DataListProps[], 
    type: 'positive' | 'negative'
  ){
    const collectionFiltered = collection
      .filter(collection => collection.type === type);

    if(collectionFiltered.length === 0){
      return 0;
    }
    const lastTransaction = Math.max.apply(
      Math, 
      collectionFiltered
        .map(collection => new Date(collection.date).getTime())
    );
    return Intl.DateTimeFormat('pt-BR',{
      day: '2-digit',
      month: 'long',
    }).format(new Date(lastTransaction));

  }

  async function loadTransactions(){
    const dataKey = `@gofinance:transactions_user:${user.id}`;
    const response = await AsyncStorage.getItem(dataKey);
    const transactions = response ? JSON.parse(response) : [];

    let entriesTotal = 0;
    let expensiveTotal = 0;

    const transactionFormatted: DataListProps[] = transactions
      .map((item: DataListProps) =>{

        if(item.type === 'positive'){
          entriesTotal += Number(item.amount);
        }else{
          expensiveTotal += Number(item.amount);
        }

        const amount = Number(item.amount)
          .toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          });
          const date = Intl.DateTimeFormat('pt-BR',{
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          }).format(new Date(item.date));
        
        return {
          id: item.id,
          name: item.name,
          type: item.type,
          category: item.category,
          amount,
          date
        }
      });
      setTranssactions(transactionFormatted);

      const total = entriesTotal - expensiveTotal;
      const lastTransactionEntries = getLastTransactionDate(transactions, 'positive');
      const lastTransactionExpensives = getLastTransactionDate(transactions, 'negative');

      const lastTransactionTotal = lastTransactionExpensives === 0
        ? "Não há transações."
        : `1 à ${lastTransactionExpensives}`;

      setHighlightData({
        entries: {
          amount: entriesTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction:  lastTransactionEntries === 0
            ? `Não Há entradas`
            : `Última entrada dia ${lastTransactionEntries}`,
        },
        expensives: {
          amount: expensiveTotal.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: lastTransactionExpensives === 0
            ? `Não Há saídas`
            : `Última saída dia ${lastTransactionExpensives}`,
        },
        total: {
          amount: total.toLocaleString('pt-BR', {
            style: 'currency',
            currency: 'BRL',
          }),
          lastTransaction: lastTransactionTotal,
        }
      });
      setIsLoading(false);

  }

  useFocusEffect(useCallback(()=>{
    loadTransactions();
  }, []));

  return(
    <Container>
      
      { isLoading 
        ? 
          <LoadContainer>
            <ActivityIndicator color={theme.colors.primary} size="large"/>
          </LoadContainer> 
        :
          <>
            <Header>
              <UserWrapper>
                <UserInfo>
                  <Photo source={{uri: user.photo}} />
                  <User>
                    <UserGreeting>Olá,</UserGreeting>
                    <UserName>{user.name}</UserName>
                  </User>
                </UserInfo>
                <LogOutButton onPress={logOut}>
                  <Icon name="power"/>
                </LogOutButton>
              </UserWrapper>
            </Header>
            <HighlightCards>
              <HighlightCard 
                title="Entradas" 
                amount={highlightData.entries.amount} 
                lastTransaction={highlightData.entries.lastTransaction}
                type="up"
              />
              <HighlightCard 
                type="down"
                title="Despesas" 
                amount={highlightData.expensives.amount}
                lastTransaction={highlightData.expensives.lastTransaction}
              />
              <HighlightCard 
                type="total"
                title="Total" 
                amount={highlightData.total.amount} 
                lastTransaction={highlightData.total.lastTransaction}
              />

            </HighlightCards>
            <Transactions>
              <Title>Listagem</Title>
              <TransactionsList
                data={transactions}
                keyExtractor={item => item.id}
                renderItem={({item}) => <TransactionCard data={item}/>}
              />
            </Transactions>
          </>
      }
    </Container>
  );
}
