import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, SafeAreaView } from 'react-native';
import { useRouter, usePathname, Slot } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; 
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Layout() {
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const slideAnim = useRef(new Animated.Value(-300)).current;
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkUserSession = async () => {
      const session = await AsyncStorage.getItem('supabase.session');
      if (session) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    };
    router.replace('/register');
    checkUserSession();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    setIsLoggedIn(false);
    closeMenu();
    router.push('/register');
  };

  const toggleMenu = () => {
    if (isMenuVisible) {
      closeMenu();
    } else {
      openMenu();
    }
    slideAnim.addListener(({ value }) => {
      console.log('Position actuelle du menu :', value);
    });
  };

  const openMenu = () => {
    setMenuVisible(true);
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const closeMenu = () => {
    Animated.timing(slideAnim, {
      toValue: -300,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start(() => {
      setMenuVisible(false);
    });
  };

  const getMenuItemStyle = (route: string) => {
    return pathname === route
      ? [styles.menuItem, styles.activeMenuItem]
      : styles.menuItem;
  };

  const pagesWithMenu = [
    '/', 
    '/addMemory', 
    '/calendrier', 
    '/galerie', 
    '/favoris', 
    '/recherche', 
    '/statistiques', 
    '/parametres',
    '/parametres/familles',
    '/parametres/profils',
    '/parametres/demandes',
  ];

  const shouldShowMenu = pagesWithMenu.includes(pathname);
  const isSubPage = pathname.includes('/parametres/familles') || pathname.includes('/parametres/profils');
  const isDemandesPage = pathname.includes('/parametres/demandes');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {shouldShowMenu && (
        <View style={styles.header}>
          {isSubPage || isDemandesPage ? (
            <TouchableOpacity 
              onPress={() => isDemandesPage ? router.push('/parametres/familles') : router.push('/parametres')} 
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={30} color="black" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={toggleMenu} style={styles.menuButton}>
              <Ionicons name="menu" size={30} color="black" />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>Souvenaria</Text>
        </View>
      )}

      <View style={styles.content}>
        <Slot />
      </View>

      {isLoggedIn && shouldShowMenu && (
        <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>
          <TouchableOpacity onPress={() => { router.push('/'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/')}>Accueil 🏠</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/addMemory'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/addMemory')}>Ajouter un souvenir 📝</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/calendrier'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/calendrier')}>Calendrier 📅</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/galerie'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/galerie')}>Galerie 🖼️</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/favoris'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/favoris')}>Favoris ⭐</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/recherche'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/recherche')}>Recherche 🔎</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/statistiques'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/statistiques')}>Statistiques 📊</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => { router.push('/parametres'); closeMenu(); }}>
            <Text style={getMenuItemStyle('/parametres')}>Paramètres ⚙️</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={logout}>
            <Text style={[styles.menuItem, { color: 'red' }]}>Déconnexion 🚪</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 60,
    backgroundColor: '#f8f8f8',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingTop: 20, // Ajouter un paddingTop pour éloigner le contenu de l'encoche
  },
  menuButton: {
    marginRight: 15,
  },
  backButton: {
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
    top: 80, // Abaisser la position du menu pour éviter la superposition avec l'encoche
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
    fontWeight: 'bold',
    backgroundColor: '#e0e0e0',
  },
});
