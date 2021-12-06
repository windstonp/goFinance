import React from 'react';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import { ThemeProvider } from 'styled-components';
import AppLoading from 'expo-app-loading';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins'

import Theme from './src/global/styles/theme';
import { StatusBar } from 'react-native';
import { Router } from './src/routes/router';
import { AuthProvider, useAuth } from './src/hooks/Auth';

export default function App() {
  const { userStoragedLoading } = useAuth();
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_700Bold
  });

  if(!fontsLoaded || userStoragedLoading){
    return <AppLoading/>
  }

  return (
    <ThemeProvider theme={Theme}>
      <StatusBar barStyle="light-content" backgroundColor={Theme.colors.primary}/>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </ThemeProvider>
  )
  
}

