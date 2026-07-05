import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Button } from '../../../src/components/Button';
import { Input } from '../../../src/components/Input';
import { createScholarshipRequest } from '../../../src/api/scholarships';
import { colors } from '../../../src/theme/colors';

export default function NewScholarshipScreen() {
  const router = useRouter();
  const [studentId, setStudentId] = useState('');
  const [scholarshipType, setScholarshipType] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    setError(null);
    setIsSubmitting(true);
    try {
      await createScholarshipRequest({
        studentId,
        scholarshipType,
        reason,
        status: 'PENDING',
      });
      router.back();
    } catch (err) {
      setError('Failed to create scholarship. Please check your input.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Request Scholarship</Text>

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
        label="Scholarship Type"
        placeholder="ECONOMIC_SUPPORT"
        value={scholarshipType}
        onChangeText={setScholarshipType}
      />
      <Input
        label="Reason"
        placeholder="Explain why you need this scholarship"
        value={reason}
        onChangeText={setReason}
        multiline
        numberOfLines={4}
        style={styles.textArea}
      />

      <Button
        title="Submit Request"
        onPress={handleSubmit}
        disabled={isSubmitting || !studentId || !scholarshipType || !reason}
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
    height: 100,
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
