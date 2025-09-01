import { MaterialIcons } from "@expo/vector-icons";
import { Tabs } from "expo-router";

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen
        name="index"
        options={{
          title: "記録",
          tabBarIcon: ({ focused, size }) => (
            <MaterialIcons
              name="add"
              size={size}
              color={focused ? "#2563eb" : "#6b7280"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "履歴",
          tabBarIcon: ({ focused, size }) => (
            <MaterialIcons
              name="history"
              size={size}
              color={focused ? "#2563eb" : "#6b7280"}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "設定",
          tabBarIcon: ({ focused, size }) => (
            <MaterialIcons
              name="settings"
              size={size}
              color={focused ? "#2563eb" : "#6b7280"}
            />
          ),
        }}
      />
    </Tabs>
  );
}
