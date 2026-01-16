// App.js
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from '@expo-google-fonts/inter';

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createContext, useContext, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import ChatScreen from './src/screens/ChatScreen';
import HomeScreen from './src/screens/HomeScreen';
import LandingScreen from './src/screens/LandingScreen';
import LoginScreen from './src/screens/LoginScreen';
import NotificationsScreen from './src/screens/NotificationsScreen';
import PrivacyPolicyScreen from './src/screens/PrivacyPolicyScreen'; // add t
import TransactionsScreen from './src/screens/TransactionsScreen';

import { apiGet } from './src/api/client';
import ListingsScreen from './src/screens/ListingsScreen';
import MessagesScreen from './src/screens/MessagesScreen';
import MyListingsScreen from './src/screens/MyListingsScreen';
import MyPurchasesScreen from './src/screens/MyPurchasesScreen';
import NewRequestScreen from './src/screens/NewRequestScreen';
import ProfileScreen from './src/screens/ProfileScreen';
import PublicProfileScreen from './src/screens/PublicProfileScreen';
import RateSellerScreen from './src/screens/RateSellerScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import SettingsScreen from './src/screens/SettingsScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

function AppTabs({ unreadTotal }) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: { backgroundColor: '#020617' },
        tabBarActiveTintColor: '#0E8A8B',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarIcon: ({ color, size }) => {
          let iconName = 'home';

          if (route.name === 'Home') iconName = 'fish';
          if (route.name === 'Listings') iconName = 'list';
          if (route.name === 'Messages') iconName = 'chatbubbles';
          if (route.name === 'Profile') iconName = 'person-circle';
          if (route.name === 'Settings') iconName = 'settings';

          const baseIcon = (
            <Ionicons name={iconName} size={size} color={color} />
          );

         
          if (route.name !== 'Messages' || unreadTotal <= 0) {
            return baseIcon;
          }

          return (
            <View>
              {baseIcon}
              <View
                style={{
                  position: 'absolute',
                  top: -4,
                  right: -8,
                  minWidth: 16,
                  height: 16,
                  borderRadius: 8,
                  backgroundColor: '#16a34a',
                  justifyContent: 'center',
                  alignItems: 'center',
                  paddingHorizontal: 3,
                }}
              >
                <Text
                  style={{
                    color: '#ffffff',
                    fontSize: 10,
                    fontWeight: '700',
                  }}
                >
                  {unreadTotal > 9 ? '9+' : unreadTotal}
                </Text>
              </View>
            </View>
          );
        },
      })} 
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Listings" component={ListingsScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [unreadTotal, setUnreadTotal] = useState(0);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    AsyncStorage.getItem('user').then(stored => {
      if (stored) setUser(JSON.parse(stored));
      setLoadingUser(false);
    });
  }, []);

 
  useEffect(() => {
    if (!user) return;

    const fetchUnread = () => {
      apiGet('getunreadtotal')
        .then(res => {
          setUnreadTotal(res?.unread_total ?? 0);
        })
        .catch(() => setUnreadTotal(0));
    };

    fetchUnread();
    const id = setInterval(fetchUnread, 5000); 
    return () => clearInterval(id);
  }, [user]);

  const loginSuccess = async userData => {
    setUser(userData);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem('user');
  };

  if (!fontsLoaded || loadingUser) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#020617',
        }}
      >
        <ActivityIndicator size="large" color="#0E8A8B" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ user, loginSuccess, logout }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {!user ? (
            <>
              <Stack.Screen name="Landing" component={LandingScreen} />
              <Stack.Screen name="Login" component={LoginScreen} />
              
              <Stack.Screen name="Register" component={RegisterScreen} />
            </>
          ) : (
            <>
              {/* pass unreadTotal into tabs so the badge can show */}
              <Stack.Screen
                name="AppTabs"
                children={() => <AppTabs unreadTotal={unreadTotal} />}
              />
              <Stack.Screen name="MyPurchases" component={MyPurchasesScreen} />
              <Stack.Screen name="RateSeller" component={RateSellerScreen} />
              <Stack.Screen name="MyListings" component={MyListingsScreen} />
              <Stack.Screen name="NewRequest" component={NewRequestScreen} />
              <Stack.Screen name="Transactions" component={TransactionsScreen} />
              <Stack.Screen
              name="PrivacyPolicy"
              component={PrivacyPolicyScreen}
              options={{ headerShown: false }}
            />
              <Stack.Screen name="ChatScreen" component={ChatScreen} />
              <Stack.Screen
                name="PublicProfile"
                component={PublicProfileScreen}
              />
              <Stack.Screen
                name="Notifications"
                component={NotificationsScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen
                name="Chat"
                component={ChatScreen}
                options={{ headerShown: false }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </AuthContext.Provider>
  );
}
