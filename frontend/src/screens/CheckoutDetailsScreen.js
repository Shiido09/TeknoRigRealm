import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  Alert,
  TextInput,
  Modal
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/screens/CheckoutDetailsScreenStyles';

const CheckoutDetailsScreen = ({ route, navigation }) => {
  const { cartItems, subtotal, shipping, total } = route.params;
  const [loading, setLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [selectedCourier, setSelectedCourier] = useState('standard');
  
  // Simplified to just one address
  const [address, setAddress] = useState({
    label: 'Home',
    address: '123 Main St, Anytown, PH 12345',
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddressLabel, setNewAddressLabel] = useState(address.label);
  const [newAddressText, setNewAddressText] = useState(address.address);

  // Payment methods with icons
  const paymentMethods = [
    { id: 'cod', name: 'Cash on Delivery', description: 'Pay when you receive your order', icon: '💵' },
    { id: 'card', name: 'Credit/Debit Card', description: 'Pay now with your card', icon: '💳' },
    { id: 'gcash', name: 'GCash', description: 'Pay with your GCash account', icon: '📱' }
  ];

  // Courier options
  const courierOptions = [
    { id: 'standard', name: 'Standard Delivery', price: 15.00, eta: '3-5 days', icon: '🚚' },
    { id: 'express', name: 'Express Delivery', price: 25.00, eta: '1-2 days', icon: '⚡' }
  ];

  const getSelectedCourierPrice = () => {
    const courier = courierOptions.find(c => c.id === selectedCourier);
    return courier ? courier.price : shipping;
  };

  // Calculate final total with selected courier
  const finalTotal = subtotal + getSelectedCourierPrice();

  const placeOrder = () => {
    setLoading(true);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      Alert.alert(
        "Order Placed",
        "Your order has been placed successfully!",
        [
          { 
            text: "OK", 
            onPress: () => {
              // Clear cart and navigate to orders
              navigation.navigate('MyOrders');
            } 
          }
        ]
      );
    }, 2000);
  };

  const openAddressModal = () => {
    setNewAddressLabel(address.label);
    setNewAddressText(address.address);
    setShowAddressModal(true);
  };

  const saveAddress = () => {
    if (!newAddressLabel.trim() || !newAddressText.trim()) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setAddress({
      label: newAddressLabel,
      address: newAddressText,
    });
    setShowAddressModal(false);
  };

  const renderCartItem = ({ item }) => (
    <View style={styles.cartItem}>
      {/* Placeholder image for products */}
      <Image 
        source={{ uri: 'https://via.placeholder.com/150/222222/FFFFFF?text=Product' }} 
        style={styles.itemImage} 
      />
      <View style={styles.itemDetails}>
        <Text style={styles.itemName}>{item.name}</Text>
        <View style={styles.priceQuantityRow}>
          <Text style={styles.itemPrice}>₱{item.price.toFixed(2)}</Text>
          <Text style={styles.itemQuantity}>× {item.quantity}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.scrollView}>
        {/* Order Items Review */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Order Items</Text>
            <Text style={styles.sectionCount}>({cartItems.length})</Text>
          </View>
          <FlatList
            data={cartItems}
            renderItem={renderCartItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>

        {/* Simplified Delivery Address Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Delivery Address</Text>
            <TouchableOpacity onPress={openAddressModal}>
              <Text style={styles.addNewButton}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.selectionCard}>
            <View style={styles.cardContent}>
              <View style={styles.addressHeader}>
                <Text style={styles.cardTitle}>{address.label}</Text>
              </View>
              <Text style={styles.cardDescription}>{address.address}</Text>
            </View>
          </View>
        </View>

        {/* Payment Method Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {paymentMethods.map(method => (
            <TouchableOpacity
              key={method.id}
              style={[
                styles.selectionCard,
                selectedPaymentMethod === method.id && styles.selectedCard
              ]}
              onPress={() => setSelectedPaymentMethod(method.id)}
            >
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedPaymentMethod === method.id && styles.radioOuterSelected
                ]}>
                  {selectedPaymentMethod === method.id && <View style={styles.radioInner} />}
                </View>
              </View>
              <Text style={styles.methodIcon}>{method.icon}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{method.name}</Text>
                <Text style={styles.cardDescription}>{method.description}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Courier Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          {courierOptions.map(courier => (
            <TouchableOpacity
              key={courier.id}
              style={[
                styles.selectionCard,
                selectedCourier === courier.id && styles.selectedCard
              ]}
              onPress={() => setSelectedCourier(courier.id)}
            >
              <View style={styles.radioContainer}>
                <View style={[
                  styles.radioOuter,
                  selectedCourier === courier.id && styles.radioOuterSelected
                ]}>
                  {selectedCourier === courier.id && <View style={styles.radioInner} />}
                </View>
              </View>
              <Text style={styles.methodIcon}>{courier.icon}</Text>
              <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{courier.name}</Text>
                <Text style={styles.cardDescription}>Estimated delivery: {courier.eta}</Text>
                <Text style={styles.courierPrice}>₱{courier.price.toFixed(2)}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Enhanced Order Summary with product details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryContainer}>
            {/* Product details in summary */}
            {cartItems.map(item => (
              <View key={item.id} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {item.name} × {item.quantity}
                </Text>
                <Text style={styles.summaryValue}>₱{(item.price * item.quantity).toFixed(2)}</Text>
              </View>
            ))}
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₱{subtotal.toFixed(2)}</Text>
            </View>
            
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Shipping</Text>
              <Text style={styles.summaryValue}>₱{getSelectedCourierPrice().toFixed(2)}</Text>
            </View>
            
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>₱{finalTotal.toFixed(2)}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <View style={styles.totalPreviewContainer}>
          <Text style={styles.totalPreviewLabel}>Total</Text>
          <Text style={styles.totalPreviewValue}>₱{finalTotal.toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={[styles.placeOrderButton, loading && styles.disabledButton]}
          onPress={placeOrder}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.placeOrderButtonText}>Place Order</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Address Edit Modal */}
      <Modal
        visible={showAddressModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Address</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Label</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. Home, Work, etc."
                placeholderTextColor="#777777"
                value={newAddressLabel}
                onChangeText={setNewAddressLabel}
              />
            </View>
            
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Address</Text>
              <TextInput
                style={[styles.input, styles.addressInput]}
                placeholder="Enter your full address"
                placeholderTextColor="#777777"
                value={newAddressText}
                onChangeText={setNewAddressText}
                multiline
                numberOfLines={3}
              />
            </View>
            
            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.modalCancelButton}
                onPress={() => setShowAddressModal(false)}
              >
                <Text style={styles.modalCancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.modalSaveButton}
                onPress={saveAddress}
              >
                <Text style={styles.modalSaveButtonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CheckoutDetailsScreen;
