import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert, StyleSheet, TouchableOpacity, Modal, Button, Dimensions } from 'react-native';
import { supabase } from '../../supabaseClient';
import { useRouter } from 'expo-router';

// Typage correct du membre de la famille
type User = {
  user_id: string;
  username: string;
};

export default function FamilyMembersScreen() {
  const [members, setMembers] = useState<User[]>([]); // Typage des membres de la famille
  const [familyId, setFamilyId] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false); // Gérer la visibilité de la pop-up
  const [selectedMember, setSelectedMember] = useState<User | null>(null); // Membre sélectionné pour suppression
  const router = useRouter();

  // Récupérer les dimensions de l'écran pour ajuster le style
  const { width, height } = Dimensions.get('window');

  useEffect(() => {
    const fetchUserFamily = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userFamily, error: familyError } = await supabase
          .from('user_families')
          .select('family_id')
          .eq('user_id', session.user.id)
          .single();

        if (userFamily) {
          setFamilyId(userFamily.family_id);
          fetchFamilyMembers(userFamily.family_id);
        } else if (familyError) {
          Alert.alert('Erreur', 'Erreur lors de la récupération de la famille.');
        }
      }
    };

    fetchUserFamily();
  }, []);

  // Récupérer les membres de la famille
  const fetchFamilyMembers = async (familyId: string) => {
    try {
      const { data: familyMembers, error: familyError } = await supabase
        .from('user_families')
        .select('user_id')
        .eq('family_id', familyId);

      if (familyError) {
        throw new Error('Erreur lors de la récupération des membres de la famille.');
      }

      if (!familyMembers || familyMembers.length === 0) {
        setMembers([]);
        return;
      }

      const userIds = familyMembers.map(member => member.user_id);
      const { data: profilesData, error: profilesError } = await supabase
        .from('user_profiles')  // Table contenant les usernames
        .select('username, id')
        .in('id', userIds);

      if (profilesError) {
        throw new Error('Erreur lors de la récupération des utilisateurs.');
      }

      const membersWithUsernames = familyMembers.map(member => {
        const userProfile = profilesData?.find(profile => profile.id === member.user_id);
        return {
          user_id: member.user_id,
          username: userProfile?.username || 'Inconnu',
        };
      });

      setMembers(membersWithUsernames);
    } catch (error) {
      Alert.alert('Erreur');
    }
  };

  // Fonction pour supprimer un membre de la famille
  const handleRemoveMember = async () => {
    if (!selectedMember) return;

    try {
      const { error } = await supabase
        .from('user_families')
        .delete()
        .eq('user_id', selectedMember.user_id)
        .eq('family_id', familyId);

      if (error) {
        throw new Error('Erreur lors de la suppression du membre.');
      }

      setMembers(members.filter(member => member.user_id !== selectedMember.user_id));
      Alert.alert('Succès', `${selectedMember.username} a été supprimé de la famille.`);
      setModalVisible(false); // Fermer la pop-up après suppression
    } catch (error) {
      Alert.alert('Erreur');
    }
  };

  // Fonction pour afficher la pop-up de confirmation avant suppression
  const confirmRemoveMember = (member: User) => {
    setSelectedMember(member);
    setModalVisible(true);
  };

  return (
    <View style={[styles.container, { width, height }]}>
      <Text style={styles.title}>Membres de la famille</Text>

      {members.length === 0 ? (
        <Text style={styles.emptyText}>Aucun membre dans cette famille.</Text>
      ) : (
        <FlatList
          data={members}
          keyExtractor={(item) => item.user_id}
          renderItem={({ item }) => (
            <View style={styles.memberItem}>
              <Text style={styles.memberName}>{item.username}</Text>

              {/* Bouton pour supprimer un membre */}
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => confirmRemoveMember(item)}
              >
                <Text style={styles.buttonText}>Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}

      {/* Pop-up de confirmation avant suppression */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>Voulez-vous vraiment supprimer {selectedMember?.username} de la famille ?</Text>
            <View style={styles.modalButtons}>
              <Button title="Annuler" onPress={() => setModalVisible(false)} />
              <Button title="Supprimer" onPress={handleRemoveMember} color="red" />
            </View>
          </View>
        </View>
      </Modal>
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
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  emptyText: {
    fontSize: 18,
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
  },
  memberItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  memberName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    backgroundColor: '#dc3545',
    padding: 10,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    marginTop: 20,
  },
});
