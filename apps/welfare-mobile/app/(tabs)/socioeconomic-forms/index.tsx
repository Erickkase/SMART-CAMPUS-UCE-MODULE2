import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '../../../src/components/Button';
import { Card } from '../../../src/components/Card';
import { ErrorMessage } from '../../../src/components/ErrorMessage';
import { Loading } from '../../../src/components/Loading';
import {
  getSocioeconomicFormsList,
  removeSocioeconomicForm,
  type SocioeconomicForm,
} from '../../../src/api/socioeconomic-forms';
import { colors } from '../../../src/theme/colors';

export default function SocioeconomicFormsListScreen() {
  const router = useRouter();
  const [forms, setForms] = useState<SocioeconomicForm[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchForms = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = await getSocioeconomicFormsList();
      setForms(data);
    } catch (err) {
      setError('Failed to load socioeconomic forms. Please try again.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void fetchForms();
    }, []),
  );

  const handleDelete = async (id: string) => {
    try {
      await removeSocioeconomicForm(id);
      setForms((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError('Failed to delete form.');
    }
  };

  const renderItem = ({ item }: { item: SocioeconomicForm }) => (
    <Card>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.studentId}>{item.studentId}</Text>
          <Text style={styles.detail}>
            Income: ${item.familyIncome} · Members: {item.familyMembers}
          </Text>
          <Text style={styles.detail}>Housing: {item.housingType}</Text>
        </View>
        <View style={styles.actions}>
          <Button
            title="View"
            onPress={() => router.push(`/(tabs)/socioeconomic-forms/${item.id}`)}
          />
          <View style={styles.spacer} />
          <Button
            title="Delete"
            onPress={() => handleDelete(item.id)}
            variant="danger"
          />
        </View>
      </View>
    </Card>
  );

  if (isLoading) {
    return <Loading />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Socioeconomic Forms</Text>
        <Button
          title="New"
          onPress={() => router.push('/(tabs)/socioeconomic-forms/new')}
        />
      </View>

      {error && <ErrorMessage message={error} />}

      <FlatList
        data={forms}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchForms(true)}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No forms found.</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.paper,
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.navy,
  },
  list: {
    paddingBottom: 24,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    flex: 1,
    paddingRight: 12,
  },
  studentId: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.navy,
  },
  detail: {
    fontSize: 14,
    color: colors.gray,
    marginTop: 2,
  },
  actions: {
    justifyContent: 'center',
  },
  spacer: {
    height: 8,
  },
  empty: {
    textAlign: 'center',
    color: colors.gray,
    marginTop: 24,
  },
});
