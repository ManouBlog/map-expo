import React from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  useColorScheme,
  Linking,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Sharing from 'expo-sharing';
import { BottomSheetScrollView } from '@gorhom/bottom-sheet';

interface Salon {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviews: number;
  address: string;
  phone: string;
  image: string;
}

interface Props {
  salon: Salon;
  onClose: () => void;
}

export default function BottomSheetContent({ salon, onClose }: Props) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${salon.latitude},${salon.longitude}`;
    Linking.openURL(url);
  };

  const handleCall = () => {
    Linking.openURL(`tel:${salon.phone}`);
  };

  const handleShare = async () => {
    const message = `Découvrez ${salon.name} à ${salon.address}`;
    try {
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(message);
      } else {
        Alert.alert('Partage non disponible sur cet appareil');
      }
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <BottomSheetScrollView
      style={[styles.container, isDark && styles.containerDark]}
      contentContainerStyle={styles.contentContainer}
    >
      <Image source={{ uri: salon.image }} style={styles.image} />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={[styles.name, isDark && styles.nameDark]}>
            {salon.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFD700" />
            <Text style={[styles.rating, isDark && styles.ratingDark]}>
              {salon.rating}
            </Text>
            <Text style={[styles.reviews, isDark && styles.reviewsDark]}>
              ({salon.reviews} avis)
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoRow}>
          <Ionicons
            name="location"
            size={20}
            color={isDark ? '#8E8E93' : '#666'}
          />
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            {salon.address}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="call"
            size={20}
            color={isDark ? '#8E8E93' : '#666'}
          />
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            {salon.phone}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Ionicons
            name="time"
            size={20}
            color={isDark ? '#8E8E93' : '#666'}
          />
          <Text style={[styles.infoText, isDark && styles.infoTextDark]}>
            Ouvert · Ferme à 19h00
          </Text>
        </View>
      </View>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.primaryButton]}
          onPress={handleDirections}
        >
          <Ionicons name="navigate" size={20} color="#fff" />
          <Text style={styles.primaryButtonText}>Itinéraire</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            isDark && styles.secondaryButtonDark,
          ]}
          onPress={handleCall}
        >
          <Ionicons
            name="call"
            size={20}
            color={isDark ? '#fff' : '#007AFF'}
          />
          <Text
            style={[
              styles.secondaryButtonText,
              isDark && styles.secondaryButtonTextDark,
            ]}
          >
            Appeler
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.secondaryButton,
            isDark && styles.secondaryButtonDark,
          ]}
          onPress={handleShare}
        >
          <Ionicons
            name="share-outline"
            size={20}
            color={isDark ? '#fff' : '#007AFF'}
          />
          <Text
            style={[
              styles.secondaryButtonText,
              isDark && styles.secondaryButtonTextDark,
            ]}
          >
            Partager
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.servicesContainer}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          Services
        </Text>
        <View style={styles.servicesList}>
          {['Coupe', 'Coloration', 'Tresses', 'Défrisage', 'Mèches'].map(
            (service, index) => (
              <View
                key={index}
                style={[
                  styles.serviceChip,
                  isDark && styles.serviceChipDark,
                ]}
              >
                <Text
                  style={[
                    styles.serviceText,
                    isDark && styles.serviceTextDark,
                  ]}
                >
                  {service}
                </Text>
              </View>
            )
          )}
        </View>
      </View>

      <View style={styles.aboutContainer}>
        <Text style={[styles.sectionTitle, isDark && styles.sectionTitleDark]}>
          À propos
        </Text>
        <Text style={[styles.aboutText, isDark && styles.aboutTextDark]}>
          Salon de coiffure professionnel spécialisé dans les coupes modernes et
          les styles africains. Notre équipe expérimentée vous accueille dans un
          cadre chaleureux et moderne.
        </Text>
      </View>
    </BottomSheetScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerDark: {
    backgroundColor: '#1C1C1E',
  },
  contentContainer: {
    paddingBottom: 40,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: 16,
  },
  headerLeft: {
    flex: 1,
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 8,
  },
  nameDark: {
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginLeft: 4,
  },
  ratingDark: {
    color: '#fff',
  },
  reviews: {
    fontSize: 14,
    color: '#666',
    marginLeft: 4,
  },
  reviewsDark: {
    color: '#999',
  },
  infoContainer: {
    padding: 16,
    paddingTop: 0,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    marginLeft: 12,
    flex: 1,
  },
  infoTextDark: {
    color: '#999',
  },
  buttonsContainer: {
    flexDirection: 'row',
    padding: 16,
    gap: 12,
  },
  button: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  primaryButton: {
    backgroundColor: '#007AFF',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#F2F2F7',
  },
  secondaryButtonDark: {
    backgroundColor: '#2C2C2E',
  },
  secondaryButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonTextDark: {
    color: '#fff',
  },
  servicesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  sectionTitleDark: {
    color: '#fff',
  },
  servicesList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  serviceChip: {
    backgroundColor: '#F2F2F7',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  serviceChipDark: {
    backgroundColor: '#2C2C2E',
  },
  serviceText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  serviceTextDark: {
    color: '#fff',
  },
  aboutContainer: {
    padding: 16,
    paddingTop: 0,
  },
  aboutText: {
    fontSize: 15,
    color: '#666',
    lineHeight: 22,
  },
  aboutTextDark: {
    color: '#999',
  },
});