import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../../styles/screens/admin/order/displayOrderStyles';

// Fake data for testing
const FAKE_ORDERS = [
    {
        id: '1',
        user: {
            id: 'user1',
            name: 'John Doe'
        },
        orderItems: [
            {
                product: {
                    product_name: 'Gaming PC RTX 4090',
                    price: 159999.99
                },
                quantity: 1
            }
        ],
        totalPrice: 159999.99,
        orderStatus: 'Processing',
        shippingInfo: {
            address: '123 Main St, City',
            phoneNo: '1234567890'
        },
        paidAt: new Date(),
        createdAt: new Date()
    },
    // Add more fake orders as needed
];

const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrderScreen = ({ navigation }) => {
    const [orders, setOrders] = useState(FAKE_ORDERS);
    const [selectedStatus, setSelectedStatus] = useState('All');

    const filteredOrders = selectedStatus === 'All' 
        ? orders 
        : orders.filter(order => order.orderStatus === selectedStatus);

    const renderStatusFilter = () => (
        <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.filterContainer}
        >
            <TouchableOpacity
                style={[
                    styles.filterChip,
                    selectedStatus === 'All' && styles.filterChipActive
                ]}
                onPress={() => setSelectedStatus('All')}
            >
                <Text style={[
                    styles.filterText,
                    selectedStatus === 'All' && styles.filterTextActive
                ]}>All</Text>
            </TouchableOpacity>
            {ORDER_STATUSES.map((status) => (
                <TouchableOpacity
                    key={status}
                    style={[
                        styles.filterChip,
                        selectedStatus === status && styles.filterChipActive,
                        { backgroundColor: selectedStatus === status ? getStatusColor(status) : '#2A2A2A' }
                    ]}
                    onPress={() => setSelectedStatus(status)}
                >
                    <Text style={[
                        styles.filterText,
                        selectedStatus === status && styles.filterTextActive
                    ]}>{status}</Text>
                </TouchableOpacity>
            ))}
        </ScrollView>
    );
    const updateOrderStatus = (orderId, currentStatus) => {
        Alert.alert(
            "Update Order Status",
            "Select new status:",
            ORDER_STATUSES.map(status => ({
                text: status,
                onPress: () => {
                    if (status !== currentStatus) {
                        setOrders(orders.map(order => 
                            order.id === orderId 
                                ? {...order, orderStatus: status}
                                : order
                        ));
                        Alert.alert(
                            "Success",
                            "Order status updated successfully",
                            [{ text: "OK" }]
                        );
                    }
                }
            })),
            { cancelable: true }
        );
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'Processing': return '#FFA000';
            case 'Shipped': return '#2196F3';
            case 'Delivered': return '#4CAF50';
            case 'Cancelled': return '#FF5252';
            default: return '#AAAAAA';
        }
    };

    const renderOrderItem = ({ item }) => (
        <View style={styles.orderCard}>
            <View style={styles.orderHeader}>
                <Text style={styles.orderNumber}>Order #{item.id}</Text>
                <TouchableOpacity 
                    style={[styles.statusBadge, { backgroundColor: getStatusColor(item.orderStatus) }]}
                    onPress={() => updateOrderStatus(item.id, item.orderStatus)}
                >
                    <Text style={styles.statusText}>{item.orderStatus}</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.orderContent}>
                <View style={styles.infoRow}>
                    <MaterialIcons name="person" size={20} color="#AAAAAA" />
                    <Text style={styles.infoLabel}>Customer:</Text>
                    <Text style={styles.infoValue}>{item.user.name}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="local-shipping" size={20} color="#AAAAAA" />
                    <Text style={styles.infoLabel}>Shipping:</Text>
                    <Text style={styles.infoValue}>{item.shippingInfo.address}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="phone" size={20} color="#AAAAAA" />
                    <Text style={styles.infoValue}>{item.shippingInfo.phoneNo}</Text>
                </View>

                <View style={styles.orderItems}>
                    {item.orderItems.map((orderItem, index) => (
                        <View key={index} style={styles.orderItem}>
                            <Text style={styles.itemName}>
                                {orderItem.product.product_name} x{orderItem.quantity}
                            </Text>
                            <Text style={styles.itemPrice}>
                                ₱{(orderItem.product.price * orderItem.quantity).toFixed(2)}
                            </Text>
                        </View>
                    ))}
                </View>

                <View style={styles.totalContainer}>
                    <Text style={styles.totalLabel}>Total Amount:</Text>
                    <Text style={styles.totalAmount}>₱{item.totalPrice.toFixed(2)}</Text>
                </View>
            </View>

            <View style={styles.orderFooter}>
                <Text style={styles.dateText}>
                    Ordered on: {new Date(item.createdAt).toLocaleDateString()}
                </Text>
                {item.paidAt && (
                    <Text style={styles.dateText}>
                        Paid on: {new Date(item.paidAt).toLocaleDateString()}
                    </Text>
                )}
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View>
                <View style={styles.header}>
                    <Text style={styles.title}>Orders</Text>
                </View>
                {renderStatusFilter()}
            </View>
            <FlatList
                data={filteredOrders}
                renderItem={renderOrderItem}
                keyExtractor={item => item.id}
                contentContainerStyle={styles.orderList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default AdminOrderScreen;