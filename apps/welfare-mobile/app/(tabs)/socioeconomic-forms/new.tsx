import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Input } from '../../../src/components/Input';
import { createSocioeconomicFormRequest } from '../../../src/api/socioeconomic-forms';
import { colors } from '../../../src/theme/colors';

export default function NewSocioeconomicFormScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [familyIncome, setFamilyIncome] = useState('');
  const [housingType, setHousingType] = useState('');
  const [familyMembers, setFamilyMembers] = useState('');
  const [employmentStatus, setEmploymentStatus] = useState('');
  const [vulnerabilityFactors, setVulnerabilityFactors] = useState('');
  const [observations, setObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createSocioeconomicFormRequest({
        studentId,
        familyIncome: Number(familyIncome),
        housingType,
        familyMembers: Number(familyMembers),
        employmentStatus,
        vulnerabilityFactors,
        observations,
      });
      router.back();
    } catch (err) {
      setError('Failed to create form. Please check your input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Socioeconomic Form</Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      <Input
        label="Student ID"
        placeholder="00000000-0000-0000-0000-000000000000"
        value={studentId}
        onChangeText={setStudentId}
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
        title="Submit Form"
        onPress={handleSubmit}
        disabled={
          isSubmitting ||
          !studentId ||
          !familyIncome ||
          !housingType ||
          !familyMembers ||
          !employmentStatus
        }
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
