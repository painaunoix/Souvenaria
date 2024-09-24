import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { useRouter, usePathname, Slot } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function Layout() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current; // Utilise useRef pour une valeur persistante
  const router = useRouter();
  const pathname = usePathname(); // Récupère la route actuelle

  // Fonction pour ouvrir/fermer le menu
  const toggleMenu = () => {
    setMenuVisible(!isMenuVisible);
    Animated.timing(slideAnim, {
      toValue: isMenuVisible ? -300 : 0, // Slide in ou out
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  // Fonction pour styliser l'élément de menu actif
  const getMenuItemStyle = (route: string) => {
    return pathname === route
      ? [styles.menuItem, styles.activeMenuItem]
      : styles.menuItem;
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Barre avec le bouton hamburger */}
      <View style={styles.header}>
        <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
          <Ionicons name="menu" size={30} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mon Application</Text>
      </View>

      {/* Contenu principal dynamique */}
      <View style={styles.content}>
        <Slot /> {/* Ceci chargera dynamiquement le contenu de la route active */}
      </View>

      {/* Menu latéral */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
        <TouchableOpacity onPress={() => { router.push('/'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/')}>Accueil 🏠</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push('/addMemory'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/addMemory')}>Ajouter un souvenir 📝</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push('/chronologie'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/chronologie')}>Chronologie 📅</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push('/galerie'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/galerie')}>Galerie 🖼️</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push('/favoris'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/favoris')}>Favoris ⭐</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push('/recherche'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/recherche')}>Recherche 🔎</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push('/statistiques'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/statistiques')}>Statistiques 📊</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => { router.push('/parametres'); toggleMenu(); }}>
          <Text style={getMenuItemStyle('/parametres')}>Parametres ⚙️</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  menuButton: {
    marginRight: 15,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  drawer: {
    position: 'absolute',
    top: 60,
    bottom: 0,
    width: 300,
    backgroundColor: '#ffffff',
    paddingTop: 20,
    paddingHorizontal: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    zIndex: 1000,
  },
  menuItem: {
    fontSize: 18,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  activeMenuItem: {
    fontWeight: 'bold', // Exemple de style pour l'élément actif
    backgroundColor: '#e0e0e0', // Ajouter un fond différent
  },
});
