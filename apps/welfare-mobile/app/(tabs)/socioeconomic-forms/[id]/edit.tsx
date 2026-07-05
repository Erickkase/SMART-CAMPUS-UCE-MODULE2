import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../../src/components/Button';
import { Input } from '../../../../src/components/Input';
import { Loading } from '../../../../src/components/Loading';
import {
  getSocioeconomicFormDetail,
  updateSocioeconomicFormRequest,
  type SocioeconomicForm,
} from '../../../../src/api/socioeconomic-forms';
import { getErrorMessage } from '../../../../src/utils/errors';
import { colors } from '../../../../src/theme/colors';

export default function EditSocioeconomicFormScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [form, setForm] = useState<SocioeconomicForm | null>(null);
  const [familyIncome, setFamilyIncome] = useState('');
  const [housingType, setHousingType] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [vulnerabilityFactors, setVulnerabilityFactors] = useState('');
  const [observations, setObservations] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadForm = async () => {
      try {
        const data = await getSocioeconomicFormDetail(id);
        setForm(data);
        setFamilyIncome(String(data.familyIncome));
        setHousingType(data.housingType);
        setFamilyMembers(String(data.familyMembers));
        setEmploymentStatus(data.employmentStatus);
        setVulnerabilityFactors(data.vulnerabilityFactors);
        setObservations(data.observations);
      } catch (err) {
        setError(
          getErrorMessage(err, 'Failed to load socioeconomic form.'),
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadForm();
  }, [id]);

  const handleSubmit = async () => {
    setError(null);

    const income = Number(familyIncome);
    const members = Number(familyMembers);

    if (
      !housingType.trim() ||
      !employmentStatus.trim() ||
      !vulnerabilityFactors.trim() ||
      !observations.trim() ||
      Number.isNaN(income) ||
      Number.isNaN(members)
    ) {
      setError('All fields are required.');
      return;
    }

    if (income < 0) {
      setError('Family income must be greater than or equal to 0.');
      return;
    }

    if (members < 1) {
      setError('Family members must be greater than or equal to 1.');
      return;
    }

    setIsSubmitting(true);
    try {
      await updateSocioeconomicFormRequest(id, {
        familyIncome: income,
        housingType: housingType.trim(),
        familyMembers: members,
        employmentStatus: employmentStatus.trim(),
        vulnerabilityFactors: vulnerabilityFactors.trim(),
        observations: observations.trim(),
      });
      router.replace(`/(tabs)/socioeconomic-forms/${id}`);
    } catch (err) {
      setError(
        getErrorMessage(err, 'Failed to update form. Please check your input.'),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  if (error || !form) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Edit Socioeconomic Form</Text>
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error ?? 'Form not found.'}</Text>
        </View>
        <Button title="Go Back" onPress={() => router.back()} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Edit Socioeconomic Form</Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Input
        label="Student ID"
        value={form.studentId}
        editable={false}
      />
      <Input
        label="Family Income"
        placeholder="12000"
        keyboardType="numeric"
        value={familyIncome}
        onChangeText={setFamilyIncome}
      />
      <Input
        label="Housing Type"
        placeholder="OWNED, RENTED, etc."
        value={housingType}
        onChangeText={setHousingType}
      />
      <Input
        label="Family Members"
        placeholder="4"
        keyboardType="numeric"
        value={familyMembers}
        onChangeText={setFamilyMembers}
      />
      <Input
        label="Employment Status"
        placeholder="EMPLOYED, UNEMPLOYED, etc."
        value={employmentStatus}
        onChangeText={setEmploymentStatus}
      />
      <Input
        label="Vulnerability Factors"
        placeholder="Describe any vulnerability factors"
        value={vulnerabilityFactors}
        onChangeText={setVulnerabilityFactors}
        multiline
        numberOfLines={3}
        style={styles.textArea}
      />
      <Input
        label="Observations"
        placeholder="Additional observations"
        value={observations}
        onChangeText={setObservations}
        multiline
        numberOfLines={3}
        style={styles.textArea}
      />

      <Button
        title="Save Changes"
        onPress={handleSubmit}
        disabled={isSubmitting}
      />
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
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  errorBox: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  errorText: {
    color: colors.danger,
  },
});
