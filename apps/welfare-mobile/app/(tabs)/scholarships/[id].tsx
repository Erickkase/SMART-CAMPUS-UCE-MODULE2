import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { ErrorMessage } from '../../../src/components/ErrorMessage';
import { Loading } from '../../../src/components/Loading';
import {
  changeScholarshipStatus,
  getScholarshipsList,
  type Scholarship,
} from '../../../src/api/scholarships';
import { colors } from '../../../src/theme/colors';

export default function ScholarshipDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [scholarship, setScholarship] = useState<Scholarship | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadScholarship = async () => {
      try {
        const list = await getScholarshipsList();
        const found = list.find((item) => item.id === id);
        if (!found) {
          setError('Scholarship not found.');
        } else {
          setScholarship(found);
        }
      } catch (err) {
        setError('Failed to load scholarship details.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadScholarship();
  }, [id]);

  const handleStatusChange = async (status: 'APPROVED' | 'REJECTED') => {
    if (!scholarship) return;
    try {
      const updated = await changeScholarshipStatus(scholarship.id, status);
      setScholarship(updated);
    } catch (err) {
      setError('Failed to update status.');
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !scholarship) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error ?? 'Not found'} />
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Scholarship Details</Text>

      <Card>
        <Text style={styles.label}>Type</Text>
        <Text style={styles.value}>{scholarship.scholarshipType}</Text>

        <Text style={styles.label}>Status</Text>
        <Text style={styles.value}>{scholarship.status}</Text>

        <Text style={styles.label}>Reason</Text>
        <Text style={styles.value}>{scholarship.reason}</Text>

        <Text style={styles.label}>Student ID</Text>
        <Text style={styles.value}>{scholarship.studentId}</Text>
      </Card>

      {scholarship.status === 'PENDING' && (
        <View style={styles.actions}>
          <Button
            title="Approve"
            onPress={() => handleStatusChange('APPROVED')}
          />
          <View style={styles.spacer} />
          <Button
            title="Reject"
            onPress={() => handleStatusChange('REJECTED')}
            variant="danger"
          />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: colors.gray,
    textTransform: 'uppercase',
    marginTop: 8,
  },
  value: {
    fontSize: 16,
    color: colors.ink,
    marginTop: 2,
  },
  actions: {
    marginTop: 16,
  },
  spacer: {
    height: 12,
  },
});
