import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  Image, 
  TouchableOpacity, 
  StatusBar
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/screens/LandingPageStyles';

const LandingPage = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in on component mount
    const checkLoginStatus = async () => {
      const token = await SecureStore.getItemAsync('token');
      setIsLoggedIn(!!token); // Convert to boolean
    };

    checkLoginStatus();

    // Listen for navigation focus to update login status
    const unsubscribe = navigation.addListener('focus', () => {
      checkLoginStatus();
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <ScrollView style={styles.scrollView}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <Text style={styles.logo}>TeknorigRealm</Text>
          <View style={styles.headerRight}>
            {isLoggedIn ? (
              // Show profile button when logged in
              <TouchableOpacity 
                style={[styles.authButton, styles.profileButton]} 
                onPress={() => navigation.navigate('Me')}
              >
                <Text style={styles.authButtonText}>My Profile</Text>
              </TouchableOpacity>
            ) : (
              // Show login/register buttons when logged out
              <>
                <TouchableOpacity 
                  style={styles.authButton} 
                  onPress={() => navigation.navigate('Login')}
                >
                  <Text style={styles.authButtonText}>Login</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={[styles.authButton, styles.registerButton]} 
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.authButtonText}>Register</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
        
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Next-Gen Tech</Text>
          <Text style={styles.heroTitle}>Ultimate Performance</Text>
          <Text style={styles.heroSubtitle}>
            Premium PC parts and tech accessories for enthusiasts and professionals
          </Text>
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.heroButtonText}>SHOP NOW</Text>
          </TouchableOpacity>
        </View>
        
        {/* About Us Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>About TeknorigRealm</Text>
          <Text style={styles.aboutUsText}>
            Founded in 2023, TeknorigRealm is a premier destination for tech enthusiasts and PC builders. 
            We specialize in curating high-quality computer components, peripherals, and complete systems 
            that deliver exceptional performance and reliability.
          </Text>
          
          <View style={styles.aboutUsPointsContainer}>
            <View style={styles.aboutUsPoint}>
              <Text style={styles.aboutUsPointIcon}>🚀</Text>
              <View style={styles.aboutUsPointTextContainer}>
                <Text style={styles.aboutUsPointTitle}>Our Mission</Text>
                <Text style={styles.aboutUsPointDesc}>
                  To provide tech enthusiasts with cutting-edge products that enhance their computing experience.
                </Text>
              </View>
            </View>
            
            <View style={styles.aboutUsPoint}>
              <Text style={styles.aboutUsPointIcon}>💡</Text>
              <View style={styles.aboutUsPointTextContainer}>
                <Text style={styles.aboutUsPointTitle}>Our Vision</Text>
                <Text style={styles.aboutUsPointDesc}>
                  To become the most trusted name in computer hardware and accessories in the Philippines.
                </Text>
              </View>
            </View>
            
            <View style={styles.aboutUsPoint}>
              <Text style={styles.aboutUsPointIcon}>💎</Text>
              <View style={styles.aboutUsPointTextContainer}>
                <Text style={styles.aboutUsPointTitle}>Our Values</Text>
                <Text style={styles.aboutUsPointDesc}>
                  Quality, innovation, customer satisfaction, and technical expertise guide everything we do.
                </Text>
              </View>
            </View>
          </View>
          
          <TouchableOpacity 
            style={styles.aboutUsButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.aboutUsButtonText}>EXPLORE OUR PRODUCTS</Text>
          </TouchableOpacity>
        </View>
        
        {/* Why Us Section */}
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Why Choose Us</Text>
          <Text style={styles.whyUsSubtitle}>
            At TeknorigRealm, we're passionate about providing the best tech solutions for our customers.
            Here's why tech enthusiasts trust us:
          </Text>
          <View style={styles.featuresContainer}>
            {features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <Text style={styles.featureIcon}>{feature.icon}</Text>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureDesc}>{feature.description}</Text>
              </View>
            ))}
          </View>
        </View>
        
      </ScrollView>
    </SafeAreaView>
  );
};

// Features
const features = [
  { icon: '🚚', title: 'Fast Delivery', description: 'Get your tech delivered to your doorstep quickly' },
  { icon: '🔒', title: 'Secure Payments', description: 'Shop with confidence with our secure payment options' },
  { icon: '🔄', title: 'Easy Returns', description: '30-day hassle-free return policy' },
  { icon: '🏆', title: 'Quality Products', description: 'Only the best tech components make it to our store' },
];

export default LandingPage;
