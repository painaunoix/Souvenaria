import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, Dimensions } from 'react-native';
import * as Font from 'expo-font';
import * as Clipboard from 'expo-clipboard';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';

export default function FamilleParametresScreen() {
  const [familyName, setFamilyName] = useState('');
  const [userId, setUserId] = useState('');
  const [familyId, setFamilyId] = useState('');
  const [inputFamilyId, setInputFamilyId] = useState('');
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const router = useRouter();

  // Charger les polices
  useEffect(() => {
    const loadFonts = async () => {
      await Font.loadAsync({
        'ADLaM Display': require('../../assets/fonts/ADLaMDisplay-Regular.ttf'),
      });
      setFontsLoaded(true);
    };
    loadFonts();
  }, []);

  // Récupérer la famille de l'utilisateur connecté
  useEffect(() => {
    const fetchUserFamily = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUserId(session.user.id);
        const { data: userFamily } = await supabase
          .from('user_families')
          .select('family_id')
          .eq('user_id', session.user.id)
          .single();

        if (userFamily) {
          setFamilyId(userFamily.family_id);
        }
      }
    };
    fetchUserFamily();
  }, []);

  // Créer une nouvelle famille
  const handleCreateFamily = async () => {
    if (familyName.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer un nom de famille.');
      return;
    }
    try {
      const { data: familyData, error: familyError } = await supabase
        .from('families')
        .insert([{ family_name: familyName }])
        .select();
      
      if (familyError || !familyData || familyData.length === 0) {
        throw new Error('Aucune donnée de famille reçue ou une erreur est survenue.');
      }

      const newFamilyId = familyData[0].family_id;
      await supabase
        .from('user_families')
        .insert([{ user_id: userId, family_id: newFamilyId }]);
      Alert.alert('Succès', 'Famille créée et associée à votre compte!');
      setFamilyName('');
      router.push('/parametres');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la création de la famille.');
      console.error(error);
    }
  };

  // Copier l'ID de la famille dans le presse-papiers
  const handleCopyFamilyId = () => {
    Clipboard.setString(familyId);
    Alert.alert('Succès', 'ID de la famille copié dans le presse-papiers.');
  };

  // Coller l'ID de la famille depuis le presse-papiers
  const handlePasteFamilyId = async () => {
    const clipboardContent = await Clipboard.getStringAsync();
    setInputFamilyId(clipboardContent);
  };

  // Rejoindre une famille
  const handleJoinFamily = async () => {
    if (inputFamilyId.trim() === '') {
      Alert.alert('Erreur', 'Veuillez entrer un ID de famille.');
      return;
    }

    try {
      const { error: requestError } = await supabase
        .from('family_requests')
        .insert([{ user_id: userId, family_id: inputFamilyId }]);

      if (requestError) {
        throw requestError;
      }

      Alert.alert('Succès', 'Votre demande a été envoyée avec succès!');
      setInputFamilyId('');
    } catch (error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de la demande.');
      console.error(error);
    }
  };

  if (!fontsLoaded) {
    return <Text>Chargement des polices...</Text>;
  }

  // Récupérer les dimensions de l'écran pour adapter le design
  const { width, height } = Dimensions.get('window');

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.title}>Paramètres de la famille</Text>

      <Text style={styles.sectionTitle}>Créer une famille</Text>
      <View style={styles.underlineContainer}>
        <View style={styles.underline} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Nom de la famille"
        placeholderTextColor="#666"
        value={familyName}
        onChangeText={setFamilyName}
      />
      <TouchableOpacity style={styles.button} onPress={handleCreateFamily}>
        <Text style={styles.buttonText}>Créer une famille</Text>
      </TouchableOpacity>

      {familyId ? (
        <>
          <Text style={styles.sectionTitle}>ID de votre famille :</Text>
          <View style={styles.underlineContainer}>
            <View style={styles.underline} />
          </View>
          <Text style={styles.familyId}>{familyId}</Text>
          <TouchableOpacity style={styles.copyButton} onPress={handleCopyFamilyId}>
            <Text style={styles.copyButtonText}>Copier l'ID</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={() => router.push('./membres')}>
            <Text style={styles.buttonText}>Voir les membres de la famille</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text style={styles.sectionTitle}>Vous n'êtes pas associé à une famille.</Text>
      )}

      <Text style={styles.sectionTitle}>Rejoindre une famille</Text>
      <View style={styles.underlineContainer}>
        <View style={styles.underline} />
      </View>

      <TextInput
        style={styles.input}
        placeholder="Entrer un ID de famille pour rejoindre"
        placeholderTextColor="#666"
        value={inputFamilyId}
        onChangeText={setInputFamilyId}
      />
      <TouchableOpacity style={styles.copyButton} onPress={handlePasteFamilyId}>
        <Text style={styles.copyButtonText}>Coller l'ID</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handleJoinFamily}>
        <Text style={styles.buttonText}>Rejoindre la famille</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('./demandes')}>
        <Text style={styles.buttonText}>Voir les demandes d'adhésion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 30,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 30,
    fontFamily: 'ADLaM Display',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 300,
    textAlign: 'center',
    marginBottom: 10,
    fontFamily: 'ADLaM Display',
  },
  underlineContainer: {
    alignItems: 'center',
  },
  underline: {
    width: '30%',
    height: 2,
    backgroundColor: 'black',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 300,
    fontFamily: 'ADLaM Display',
  },
  familyId: {
    fontSize: 16,
    fontWeight: 200,
    textAlign: 'center',
    fontFamily: 'ADLaM Display',
    marginBottom: 10,
  },
  copyButton: {
    backgroundColor: '#28a745',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 5,
  },
  copyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 300,
    fontFamily: 'ADLaM Display',
  },
});
