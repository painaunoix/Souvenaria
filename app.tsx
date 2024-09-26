import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/index'; // Chemin vers ta page d'accueil
import AddMemoryScreen from './app/addMemory'; // Chemin vers ta page d'ajout de souvenir
import RegisterScreen from './app/register'; // Chemin vers ta page de registre (nouvelle page)
import LoginScreen from './app/login'; // Chemin vers ta page de connexion
import { RootStackParamList } from './types'; // Types pour la navigation

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Register"> {/* Changement de Home à Register */}
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Créer un compte' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Se connecter' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="AddMemory" component={AddMemoryScreen} options={{ title: 'Ajouter un souvenir' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
