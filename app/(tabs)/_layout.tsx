import { Tabs } from 'expo-router';

import { FlowTabBar } from '@/components/FlowTabBar';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }} tabBar={(props) => <FlowTabBar {...props} />}>
      <Tabs.Screen name="now" options={{ title: 'Now' }} />
      <Tabs.Screen name="field" options={{ title: 'My Field' }} />
      <Tabs.Screen name="ask" options={{ title: 'Ask' }} />
      <Tabs.Screen name="explore" options={{ title: 'Explore' }} />
    </Tabs>
  );
}
