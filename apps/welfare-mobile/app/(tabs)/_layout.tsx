import { Tabs, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Loading } from '../../src/components/Loading';
import { useAuth } from '../../src/context/AuthContext';
import { colors } from '../../src/theme/colors';

export default function TabsLayout() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading || !isAuthenticated) {
    return <Loading />;
  }

  return (
    <Tabs
      screenOptions={{
        headerStyle: { backgroundColor: colors.navy },
        headerTintColor: colors.white,
        tabBarActiveTintColor: colors.blue,
        tabBarInactiveTintColor: colors.gray,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          headerTitle: 'Welfare Mobile',
        }}
      />
      <Tabs.Screen
        name="scholarships"
        options={{
          title: 'Scholarships',
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="socioeconomic-forms"
        options={{
          title: 'Forms',
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
