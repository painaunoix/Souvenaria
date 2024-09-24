import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './app/index'; // Ajuste le chemin en fonction de ta structure
import AddMemoryScreen from './app/addMemory'; // Ajuste le chemin en fonction de ta structure
import { RootStackParamList } from './types'; // Si tu as des types, sinon omets cette ligne

// Définir les types de la stack de navigation si tu utilises TypeScript
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Accueil' }} />
        <Stack.Screen name="AddMemory" component={AddMemoryScreen} options={{ title: 'Ajouter un souvenir' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
