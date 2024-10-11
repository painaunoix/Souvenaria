import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';

export default function ProfilScreen() {
  const [userProfile, setUserProfile] = useState<{ username: string, created_at: string } | null>(null);
  const [family, setFamily] = useState<{ family_name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const userId = session.user.id;

        const { data: profileData, error: profileError } = await supabase
          .from('user_profiles')
          .select('username, created_at')
          .eq('id', userId)
          .single();

        if (profileError) {
          console.error('Erreur de profil :', profileError);
        } else {
          setUserProfile(profileData);
        }

        const { data: familyData, error: familyError } = await supabase
          .from('user_families')
          .select(`
            family_id,
            families(family_name)
          `)
          .eq('user_id', userId);

        if (familyError) {
          console.error('Erreur de famille :', familyError);
        } else if (familyData && familyData.length > 0 && familyData[0].families) {
          setFamily(familyData[0].families);
        } else {
          setFamily(null);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const { width, height } = Dimensions.get('window'); // Récupération des dimensions de l'écran

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.title}>Profil de l'utilisateur</Text>

      {userProfile ? (
        <>
          <View style={styles.underlineContainer}>
            <Text style={styles.sectionTitle}>Nom d'utilisateur :</Text>
            <View style={styles.underline} />
          </View>
          <Text style={styles.userInfo}>{userProfile.username}</Text>

          <View style={styles.underlineContainer}>
            <Text style={styles.sectionTitle}>Date de création du compte :</Text>
            <View style={styles.underline} />
          </View>
          <Text style={styles.userInfo}>
            {new Date(userProfile.created_at).toLocaleDateString()}
          </Text>

          {family ? (
            <>
              <View style={styles.underlineContainer}>
                <Text style={styles.sectionTitle}>Famille :</Text>
                <View style={styles.underline} />
              </View>
              <Text style={styles.userInfo}>{family.family_name}</Text>
            </>
          ) : (
            <View style={styles.underlineContainer}>
              <Text style={styles.sectionTitle}>Vous n'êtes pas associé à une famille.</Text>
              <View style={styles.underline} />
            </View>
          )}

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('./edit_profile')}
          >
            <Text style={styles.buttonText}>Modifier le profil</Text>
          </TouchableOpacity>
        </>
      ) : (
        <Text>Chargement...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    padding: 20,
    backgroundColor: '#f5f5f5', // Fond gris
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
  userInfo: {
    fontSize: 18,
    fontWeight: 400,
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'ADLaM Display',
  },
  underlineContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  underline: {
    width: '30%',
    height: 2,
    backgroundColor: 'black',
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
});
