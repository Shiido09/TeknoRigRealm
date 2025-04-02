import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Alert } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../../styles/screens/admin/displayProdStyles';

// Fake data for testing
const FAKE_PRODUCTS = [
    {
        id: '1',
        product_name: 'Gaming PC RTX 4090',
        price: 159999.99,
        stocks: 5,
        category: 'Gaming PCs',
        product_images: [{ url: 'https://via.placeholder.com/150' }],
        description: 'High-end gaming PC with RTX 4090'
    },
    {
        id: '2',
        product_name: 'Mechanical Keyboard',
        price: 4999.99,
        stocks: 20,
        category: 'Peripherals',
        product_images: [{ url: 'https://via.placeholder.com/150' }],
        description: 'RGB Mechanical Gaming Keyboard'
    },
    {
        id: '3',
        product_name: 'Gaming Monitor 27"',
        price: 24999.99,
        stocks: 8,
        category: 'Displays',
        product_images: [{ url: 'https://via.placeholder.com/150' }],
        description: '27-inch 165Hz Gaming Monitor'
    },
];

const AdminProductScreen = ({ navigation }) => {
    const [products, setProducts] = useState(FAKE_PRODUCTS);

    const deleteProduct = (id) => {
        Alert.alert(
            "Delete Product",
            "Are you sure you want to delete this product?",
            [
                {
                    text: "Cancel",
                    style: "cancel"
                },
                {
                    text: "Delete",
                    onPress: () => {
                        setProducts(products.filter(p => p.id !== id));
                        // Show success message
                        Alert.alert(
                            "Success",
                            "Product deleted successfully",
                            [{ text: "OK" }]
                        );
                    },
                    style: "destructive"
                }
            ],
            { cancelable: true }
        );
    };

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
                    onPress={() => navigation.navigate('showProduct', { product: item })}
                >
                    <MaterialIcons name="visibility" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconButton, styles.editButton]}
                    onPress={() => navigation.navigate('editProduct', { product: item })}
                >
                    <MaterialIcons name="edit" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.iconButton, styles.deleteButton]}
                    onPress={() => deleteProduct(item.id)}
                >
                    <MaterialIcons name="delete" size={24} color="#FFFFFF" />
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Products</Text>
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
                keyExtractor={item => item.id}
                contentContainerStyle={styles.productList}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default AdminProductScreen;