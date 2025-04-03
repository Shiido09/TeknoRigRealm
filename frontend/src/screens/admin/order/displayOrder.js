import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { View, Text, FlatList, TouchableOpacity, Alert, ScrollView, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { getAllOrders } from '../../../redux/actions/orderActions'; // Import the Redux action
import styles from '../../../styles/screens/admin/order/displayOrderStyles';

const ORDER_STATUSES = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];

const AdminOrderScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    // Access orders and loading/error state from Redux
    const { loading, orders, error } = useSelector(state => state.adminOrders);

    const [selectedStatus, setSelectedStatus] = useState('All');

    // Fetch orders when the component mounts
    useEffect(() => {
        dispatch(getAllOrders());
    }, [dispatch]);

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

    // const updateOrderStatus = (orderId, currentStatus) => {
    //     Alert.alert(
    //         "Update Order Status",
    //         "Select new status:",
    //         ORDER_STATUSES.map(status => ({
    //             text: status,
    //             onPress: () => {
    //                 if (status !== currentStatus) {
    //                     Alert.alert(
    //                         "Success",
    //                         "Order status updated successfully",
    //                         [{ text: "OK" }]
    //                     );
    //                 }
    //             }
    //         })),
    //         { cancelable: true }
    //     );
    // };

    const getStatusColor = (status) => {
        switch (status) {
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

                <View style={styles.infoRow}>
                    <MaterialIcons name="payment" size={20} color="#AAAAAA" />
                    <Text style={styles.infoLabel}>Payment Method:</Text>
                    <Text style={styles.infoValue}>{item.PaymentMethod}</Text>
                </View>

                <View style={styles.infoRow}>
                    <MaterialIcons name="local-shipping" size={20} color="#AAAAAA" />
                    <Text style={styles.infoLabel}>Courier:</Text>
                    <Text style={styles.infoValue}>
                        {(item.Courier || []).map(c => `${c.CourierName} (₱${c.shippingfee})`).join(', ')}
                    </Text>
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
                {item.deliveredAt && (
                    <Text style={styles.dateText}>
                        Delivered on: {new Date(item.deliveredAt).toLocaleDateString()}
                    </Text>
                )}
            </View>
        </View>
    );

    if (loading) {
        return <ActivityIndicator size="large" color="#0000ff" />;
    }

    if (error) {
        return <Text style={styles.errorText}>{error}</Text>;
    }

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