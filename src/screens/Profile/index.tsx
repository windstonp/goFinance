import React from 'react';
import { Text, View, TextInput, Button } from 'react-native';

export function Profile() {
  return (
    <View>
      <Text testID="text-title">
        Perfil
      </Text>
      <TextInput
        testID='input-name'
        placeholder="Nome"
        autoCorrect={false}
        value="Rogrigo"
      />

      <TextInput
        testID='input-surname'
        placeholder="Sobrenome"
        value="Gonçalves"
      />

      <Button
        title="Salvar"
        onPress={() => { }}
      />
    </View>
  );
};