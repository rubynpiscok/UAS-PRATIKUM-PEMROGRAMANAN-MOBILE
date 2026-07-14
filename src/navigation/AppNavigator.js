import React from 'react';
import { Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuth } from '../context/AuthContext';
import { COLORS } from '../constants/theme';

import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import CatalogScreen from '../screens/CatalogScreen';
import DetailScreen from '../screens/DetailScreen';
import AddItemScreen from '../screens/AddItemScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MerchantScreen from '../screens/MerchantScreen';
import ManageMenuScreen from '../screens/ManageMenuScreen';

const RootStack = createNativeStackNavigator();
const HomeStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const headerStyle = {
  headerStyle: { backgroundColor: COLORS.card },
  headerTitleStyle: { color: COLORS.ink, fontWeight: '700' },
  headerShadowVisible: false,
  headerTintColor: COLORS.ink,
};

// Auth: hanya Login & Register, belum bisa masuk ke dalam app.
function AuthNavigator() {
  return (
    <RootStack.Navigator screenOptions={{ headerShown: false }}>
      <RootStack.Screen name="Login" component={LoginScreen} />
      <RootStack.Screen name="Register" component={RegisterScreen} />
    </RootStack.Navigator>
  );
}

// Stack di dalam tab Home: Home → Katalog → Detail
// Juga menyertakan MerchantScreen agar bisa diakses dari HomeScreen.
function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={headerStyle}>
      <HomeStack.Screen
        name="Beranda"
        component={HomeScreen}
        options={{ title: 'KampusMarket' }}
      />
      <HomeStack.Screen
        name="Katalog"
        component={CatalogScreen}
        options={{ title: 'Menu & Layanan' }}
      />
        <HomeStack.Screen
          name="AddItem"
          component={AddItemScreen}
          options={{ title: 'Tambah Item' }}
        />
      <HomeStack.Screen
        name="Detail"
        component={DetailScreen}
        options={{ title: 'Detail Pemesanan' }}
      />
      <HomeStack.Screen
        name="Merchant"
        component={MerchantScreen}
        options={{ title: 'Panel Penjual' }}
      />
      <HomeStack.Screen
        name="ManageMenu"
        component={ManageMenuScreen}
        options={{ title: 'Kelola Menu' }}
      />
    </HomeStack.Navigator>
  );
}

// Tab utama hanya 2 menu: Home dan Profil (sesuai Prompt 1).
function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.moss,
        tabBarInactiveTintColor: COLORS.placeholder,
        tabBarStyle: {
          backgroundColor: COLORS.card,
          borderTopColor: COLORS.line,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
        tabBarIcon: ({ color, size, focused }) => {
          const icons = { Home: focused ? '⌂' : '⌂', Profil: focused ? '☺' : '☺' };
          return <Text style={{ color, fontSize: size }}>{icons[route.name]}</Text>;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeStackNavigator} />
      <Tab.Screen name="Profil" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// Auth wall: isLoggedIn menentukan apakah user masuk ke AuthNavigator atau MainTabNavigator (Aspek 6).
export default function AppNavigator() {
  const { isLoggedIn } = useAuth();

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainTabNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
