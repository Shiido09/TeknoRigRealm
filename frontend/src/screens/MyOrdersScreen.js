import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity,
  ActivityIndicator,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getItem } from '../services/authService'; // Import SQLite function
import styles from '../styles/screens/MyOrdersScreenStyles';

const MyOrdersScreen = ({ navigation }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('All');

  // Mock data for orders since there's no backend implementation yet
  const mockOrders = [
    {
      _id: 'ORD12345678',
      orderStatus: 'Delivered',
      createdAt: '2023-09-15T10:30:00Z',
      totalPrice: 799.99,
      orderItems: [
        { id: 'item1', name: 'Gaming PC', price: 799.99, quantity: 1 }
      ]
    },
    {
      _id: 'ORD87654321',
      orderStatus: 'Processing',
      createdAt: '2023-10-05T14:45:00Z',
      totalPrice: 249.98,
      orderItems: [
        { id: 'item2', name: 'Mechanical Keyboard', price: 129.99, quantity: 1 },
        { id: 'item3', name: 'Gaming Mouse', price: 59.99, quantity: 2 }
      ]
    },
    {
      _id: 'ORD13579246',
      orderStatus: 'Shipped',
      createdAt: '2023-10-20T09:15:00Z',
      totalPrice: 1299.99,
      orderItems: [
        { id: 'item4', name: 'Gaming Laptop', price: 1299.99, quantity: 1 }
      ]
    },
    {
      _id: 'ORD24680135',
      orderStatus: 'To Ship',
      createdAt: '2023-11-01T16:20:00Z',
      totalPrice: 349.99,
      orderItems: [
        { id: 'item5', name: 'Gaming Headset', price: 349.99, quantity: 1 }
      ]
    },
    {
      _id: 'ORD97531086',
      orderStatus: 'To Deliver',
      createdAt: '2023-11-05T10:15:00Z',
      totalPrice: 189.99,
      orderItems: [
        { id: 'item6', name: 'Gaming Monitor', price: 189.99, quantity: 1 }
      ]
    }
  ];

  // Order status tabs
  const orderTabs = ['All', 'To Ship', 'To Deliver', 'Completed'];

  // Filter orders based on active tab
  const getFilteredOrders = () => {
    if (activeTab === 'All') {
      return orders;
    } else if (activeTab === 'Completed') {
      return orders.filter(order => order.orderStatus === 'Delivered');
    } else {
      return orders.filter(order => order.orderStatus === activeTab);
    }
  };

  useEffect(() => {
    // Simulate loading data
    const loadMockData = async () => {
      try {
        // Check if user is logged in
        const token = await getItem('token');
        
        if (!token) {
          throw new Error('You are not logged in');
        }
        
        // Simulate network delay
        setTimeout(() => {
          setOrders(mockOrders);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Error:', error);
        setError(error.message);
        setLoading(false);
      }
    };

    loadMockData();
  }, []);

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.orderCard}
      onPress={() => navigation.navigate('ProductDetail', { product: item.orderItems[0] })}
    >
      <View style={styles.orderHeader}>
        <Text style={styles.orderId}>Order #{item._id.substring(0, 8)}</Text>
        <Text style={[
          styles.orderStatus, 
          item.orderStatus === 'Delivered' && styles.statusDelivered,
          item.orderStatus === 'Processing' && styles.statusProcessing,
          item.orderStatus === 'Shipped' && styles.statusShipped,
          item.orderStatus === 'To Ship' && styles.statusToShip,
          item.orderStatus === 'To Deliver' && styles.statusToDeliver
        ]}>
          {item.orderStatus}
        </Text>
      </View>
      
      <View style={styles.orderInfo}>
        <Text style={styles.orderDate}>
          {new Date(item.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </Text>
        <Text style={styles.orderTotal}>${item.totalPrice.toFixed(2)}</Text>
      </View>
      
      <Text style={styles.orderItemsCount}>
        {item.orderItems.length} {item.orderItems.length === 1 ? 'item' : 'items'}
      </Text>
    </TouchableOpacity>
  );

  const renderTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={styles.tabsContainer}
      contentContainerStyle={styles.tabsContentContainer}
    >
      {orderTabs.map(tab => (
        <TouchableOpacity
          key={tab}
          style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
          onPress={() => setActiveTab(tab)}
        >
          <Text style={[styles.tabButtonText, activeTab === tab && styles.activeTabButtonText]}>
            {tab}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => {
            setLoading(true);
            setTimeout(() => {
              setOrders(mockOrders);
              setError(null);
              setLoading(false);
            }, 1000);
          }}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>You haven't placed any orders yet.</Text>
          <TouchableOpacity 
            style={styles.shopButton}
            onPress={() => navigation.navigate('Products')}
          >
            <Text style={styles.shopButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {renderTabs()}
          <FlatList
            data={getFilteredOrders()}
            renderItem={renderOrderItem}
            keyExtractor={item => item._id}
            contentContainerStyle={styles.ordersList}
            ListEmptyComponent={
              <View style={styles.emptyTabContainer}>
                <Text style={styles.emptyTabText}>No orders in this category</Text>
              </View>
            }
          />
        </View>
      )}
    </SafeAreaView>
  );
};

export default MyOrdersScreen;
