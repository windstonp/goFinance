import React, { useState } from 'react';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useForm } from 'react-hook-form';
import { 
  Modal, 
  TouchableWithoutFeedback, 
  Keyboard,
  Alert
} from 'react-native';
import uuid from 'react-native-uuid';
import { useNavigation } from '@react-navigation/native';

import { Button } from '../../components/Form/Button';
import { CategorySelectButton } from '../../components/Form/CategorySelectButton';
import { InputForm } from '../../components/Form/InputForm';
import { TransactionTypeButton } from '../../components/Form/TransactionTypeButton';
import { CategorySelect } from '../CategorySelect';
import { useAuth } from '../../hooks/Auth';
import { 
  Container,
  Header,
  Title,
  Form,
  Fields,
  TransactionsTypes
} from './styles';

interface FormData{
  name: string,
  amount: string
}

const formSchema = Yup.object().shape({
  name: Yup
    .string()
    .required('Nome é obrigatorio!'),
  amount: Yup
    .number()
    .typeError('Informe um Valor númerico!')
    .positive('O Preço precisa ser maior que 0!')
    .required('Preço é obrigatorio!'),

});

export function Register(){
  const { user } =  useAuth();
  const [transactionType, setTransactionType] = useState('');
  const [categoryModalIsOpen, setCategoryModalIsOpen] = useState(false);
  const navigation = useNavigation();

  const [category, setCategory] = useState({
    key: 'category',
    name: 'Categoria',
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: {errors}
  } = useForm({
    resolver: yupResolver(formSchema)
  });

  function handleSelectTypeOnPress(type: 'positive' | 'negative'){
    setTransactionType(type);
  }

  function handleCloseSelectCategoryModal(){
    setCategoryModalIsOpen(false);
  }

  function handleOpenSelectCategoryModal(){
    setCategoryModalIsOpen(true);
  }

  async function handleRegister(form: FormData){

    if(!transactionType){
      return Alert.alert('Selecione um tipo de transação')
    }

    if(category.key === 'category'){
      return Alert.alert('Selecione uma categoria!')
    }

    const newTransaction = {
      id: String(uuid.v4()),
      name: form.name,
      amount: form.amount,
      type: transactionType,
      category: category.key,
      date: new Date()
    };

    try{
      const dataKey = `@gofinance:transactions_user:${user.id}`;
      const data = await AsyncStorage.getItem(dataKey);
      const currentData = data ? JSON.parse(data) : [];
      const formatedData = [...currentData, newTransaction]; 
      await AsyncStorage.setItem(dataKey, JSON.stringify(formatedData));

      reset();
      setTransactionType('');
      setCategory({
        key: 'category',
        name: 'Categoria',
      });

      navigation.navigate('Listagem');
    }catch(error){
      console.log(error);
      Alert.alert('não foi possivel salvar');
    }
  }
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <Container>
        <Header>
          <Title>
            Cadastro
          </Title>
        </Header>
        <Form>
          <Fields>
            <InputForm 
              name="name"
              control={control}
              placeholder="Nome"
              autoCapitalize="sentences"
              autoCorrect={false}
              error={errors.name && errors.name.message}
            />
            <InputForm 
              name="amount"
              control={control}
              placeholder="Preço"
              keyboardType="numeric"
              error={errors.amount && errors.amount.message}
            />
            <TransactionsTypes>
              <TransactionTypeButton 
                type="up" 
                title="Income"
                onPress={() => handleSelectTypeOnPress('positive')}
                isActive={transactionType === "positive"}
              />
              <TransactionTypeButton 
                type="down" 
                title="outcome"
                onPress={() => handleSelectTypeOnPress('negative')}
                isActive={transactionType === "negative"}
              />
            </TransactionsTypes>
            <CategorySelectButton 
              title={category.name}
              onPress={handleOpenSelectCategoryModal}
            />
          </Fields>
          <Button 
            title="Enviar"
            onPress={handleSubmit(handleRegister)}
          />
        </Form>
        <Modal visible={categoryModalIsOpen}>
          <CategorySelect 
            category={category}
            setCategory={setCategory}
            CloseSelectCategory={handleCloseSelectCategoryModal}
          />
        </Modal>
      </Container>
    </TouchableWithoutFeedback>
  );
}