
import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, deleteProduct } from '../../../redux/actions/productAction';
import styles from '../../../styles/screens/admin/product/displayProdStyles';

const AdminProductScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const { products = [], loading, error } = useSelector((state) => state.productState || {});

    // Fetch products when the component mounts
    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch]);

    // Handle product deletion
    const handleDeleteProduct = (id) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            await dispatch(deleteProduct(id));
                            Alert.alert("Success", "Product deleted successfully");
                        } catch (error) {
                            Alert.alert("Error", error.message);
                        }
                    },
                    style: "destructive",
                },
            ],
            { cancelable: true }
        );
    };

    // Render each product item
    const renderProductItem = ({ item }) => (
        <View style={styles.productCard}>
            <View style={styles.imageContainer}>
                {item.product_images && item.product_images[0] ? (
                    <Image
                        source={{ uri: item.product_images[0].url }}
                        style={styles.productImage}
                    />
                ) : (
                    <View style={styles.imagePlaceholder}>
                        <MaterialIcons name="image" size={40} color="#666666" />
                    </View>
                )}
            </View>

            <View style={styles.productInfo}>
                <Text style={styles.productName}>{item.product_name}</Text>
                <Text style={styles.productPrice}>₱{item.price.toFixed(2)}</Text>
                <View style={styles.stockContainer}>
                    <MaterialIcons name="inventory" size={16} color="#AAAAAA" />
                    <Text style={styles.productStock}>{item.stocks}</Text>
                </View>
                <Text style={styles.productCategory}>{item.category}</Text>
            </View>

            <View style={styles.actionButtons}>
                <TouchableOpacity
                    style={[styles.iconButton, styles.viewButton]}
                    onPress={() => navigation.navigate('showProduct', { productId: item._id })}
                >
                    <MaterialIcons name="visibility" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconButton, styles.editButton]}
                    onPress={() => navigation.navigate('editProduct', { product: item })} // Pass the whole product object
 // Pass productId
                >
                    <MaterialIcons name="edit" size={24} color="#FFFFFF" />
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.iconButton, styles.deleteButton]}
                    onPress={() => handleDeleteProduct(item._id)}
                >
                    <MaterialIcons name="delete" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    // Handle loading state
    if (loading) {
        return (
            <View style={[styles.container, styles.centered]}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    // Handle error state
    if (error) {
        return (
            <View style={[styles.container, styles.centered]}>
                <Text style={styles.errorText}>Error: {error}</Text>
            </View>
        );
    }

    // Render the admin product screen
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Admin Products ({products.length})</Text>
                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => navigation.navigate('addProduct')}
                >
                    <MaterialIcons name="add" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>

            <FlatList
                data={products}
                renderItem={renderProductItem}
                keyExtractor={(item) => item._id}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default AdminProductScreen;