import { CheckSquare } from '@/components/Icons';
import { Tabs } from 'expo-router';

export const unstable_settings = {
  initialRouteName: "index",
};

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarStyle: { display: 'none' } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Todos',
          headerShown: false,
          tabBarIcon: () => <CheckSquare className="text-foreground" />,
        }}
      />
    </Tabs>
  );
}
