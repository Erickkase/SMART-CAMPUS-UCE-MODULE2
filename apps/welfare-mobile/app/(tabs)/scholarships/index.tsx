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
  getScholarshipsList,
  removeScholarship,
  type Scholarship,
} from '../../../src/api/scholarships';
import { getErrorMessage } from '../../../src/utils/errors';
import { colors } from '../../../src/theme/colors';

export default function ScholarshipsListScreen() {
  const router = useRouter();
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchScholarships = async (refresh = false) => {
    if (refresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setError(null);
    try {
      const data = await getScholarshipsList();
      setScholarships(data);
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to load scholarships. Please try again.'));
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      void fetchScholarships();
    }, []),
  );

  const handleDelete = async (id: string) => {
    try {
      await removeScholarship(id);
      setScholarships((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(getErrorMessage(err, 'Failed to delete scholarship.'));
    }
  };

  const renderItem = ({ item }: { item: Scholarship }) => (
    <Card>
      <View style={styles.row}>
        <View style={styles.info}>
          <Text style={styles.type}>{item.scholarshipType}</Text>
          <Text style={styles.status}>{item.status}</Text>
          <Text style={styles.reason} numberOfLines={2}>
            {item.reason}
          </Text>
        </View>
        <View style={styles.actions}>
          <Button
            title="View"
            onPress={() => router.push(`/(tabs)/scholarships/${item.id}`)}
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
        <Text style={styles.title}>Scholarships</Text>
        <Button
          title="New"
          onPress={() => router.push('/(tabs)/scholarships/new')}
        />
      </View>

      {error && <ErrorMessage message={error} />}

      <FlatList
        data={scholarships}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => fetchScholarships(true)}
          />
        }
        ListEmptyComponent={
          <Text style={styles.empty}>No scholarships found.</Text>
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
  type: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.navy,
  },
  status: {
    fontSize: 14,
    color: colors.blue,
    fontWeight: '500',
    marginVertical: 2,
  },
  reason: {
    fontSize: 14,
    color: colors.gray,
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
