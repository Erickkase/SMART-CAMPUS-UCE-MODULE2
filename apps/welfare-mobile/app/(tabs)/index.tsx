import { useRouter } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { Button } from '../../src/components/Button';
import { Card } from '../../src/components/Card';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/theme/colors';

export default function DashboardScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Welfare Mobile</Text>
      <Text style={styles.subtitle}>
        Manage scholarships and socioeconomic forms from your device.
      </Text>

      <Card>
        <Text style={styles.cardTitle}>Scholarships</Text>
        <Text style={styles.cardDescription}>
          View and request student welfare scholarships.
        </Text>
        <View style={styles.cardAction}>
          <Button
            title="Go to Scholarships"
            onPress={() => router.push('/(tabs)/scholarships')}
          />
        </View>
      </Card>

      <Card>
        <Text style={styles.cardTitle}>Socioeconomic Forms</Text>
        <Text style={styles.cardDescription}>
          Submit and review socioeconomic information.
        </Text>
        <View style={styles.cardAction}>
          <Button
            title="Go to Forms"
            onPress={() => router.push('/(tabs)/socioeconomic-forms')}
          />
        </View>
      </Card>

      <View style={styles.logout}>
        <Button title="Sign Out" onPress={logout} variant="danger" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray,
    marginBottom: 20,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.navy,
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.gray,
    marginBottom: 12,
  },
  cardAction: {
    marginTop: 8,
  },
  logout: {
    marginTop: 'auto',
  },
});
