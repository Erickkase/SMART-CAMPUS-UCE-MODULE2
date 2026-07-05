import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { ErrorMessage } from '../../../src/components/ErrorMessage';
import { Loading } from '../../../src/components/Loading';
import {
  getSocioeconomicFormDetail,
  type SocioeconomicForm,
} from '../../../src/api/socioeconomic-forms';
import { colors } from '../../../src/theme/colors';

export default function SocioeconomicFormDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<SocioeconomicForm | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await getSocioeconomicFormDetail(id);
        setForm(data);
      } catch (err) {
        setError('Failed to load socioeconomic form details.');
      } finally {
        setIsLoading(false);
      }
    };

    void loadForm();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  if (error || !form) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error ?? 'Not found'} />
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Socioeconomic Form</Text>

      <Card>
        <Text style={styles.label}>Student ID</Text>
        <Text style={styles.value}>{form.studentId}</Text>

        <Text style={styles.label}>Family Income</Text>
        <Text style={styles.value}>${form.familyIncome}</Text>

        <Text style={styles.label}>Housing Type</Text>
        <Text style={styles.value}>{form.housingType}</Text>

        <Text style={styles.label}>Family Members</Text>
        <Text style={styles.value}>{form.familyMembers}</Text>

        <Text style={styles.label}>Employment Status</Text>
        <Text style={styles.value}>{form.employmentStatus}</Text>

        <Text style={styles.label}>Vulnerability Factors</Text>
        <Text style={styles.value}>{form.vulnerabilityFactors}</Text>

        <Text style={styles.label}>Observations</Text>
        <Text style={styles.value}>{form.observations}</Text>
      </Card>
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
});
