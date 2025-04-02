import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../../styles/screens/admin/product/editProdStyles';

const CATEGORIES = [
    'Gaming PCs',
    'Laptops',
    'Components',
    'Peripherals',
    'Displays',
    'Networking',
    'Storage',
    'Audio',
];

const EditProductScreen = ({ navigation, route }) => {
    const { product } = route.params;
    const [productName, setProductName] = useState(product.product_name);
    const [price, setPrice] = useState(product.price.toString());
    const [stocks, setStocks] = useState(product.stocks.toString());
    const [description, setDescription] = useState(product.description);
    const [category, setCategory] = useState(product.category);
    const [images, setImages] = useState(product.product_images || []);

    const handleUpdateProduct = () => {
        // Update product logic here
        navigation.goBack();
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <MaterialIcons name="arrow-back" size={24} color="#FFFFFF" />
                </TouchableOpacity>
                <Text style={styles.title}>Edit Product</Text>
            </View>

            <ScrollView style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Product Name</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter product name"
                        placeholderTextColor="#666666"
                        value={productName}
                        onChangeText={setProductName}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Price</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter price"
                        placeholderTextColor="#666666"
                        value={price}
                        onChangeText={setPrice}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Stock Quantity</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter stock quantity"
                        placeholderTextColor="#666666"
                        value={stocks}
                        onChangeText={setStocks}
                        keyboardType="numeric"
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Description</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        placeholder="Enter product description"
                        placeholderTextColor="#666666"
                        value={description}
                        onChangeText={setDescription}
                        multiline
                        numberOfLines={4}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.inputLabel}>Category</Text>
                    <View style={styles.pickerContainer}>
                        <Picker
                            selectedValue={category}
                            onValueChange={setCategory}
                            style={styles.picker}
                            dropdownIconColor="#FFFFFF"
                        >
                            {CATEGORIES.map((cat) => (
                                <Picker.Item
                                    key={cat}
                                    label={cat}
                                    value={cat}
                                    style={styles.pickerItem}
                                />
                            ))}
                        </Picker>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.imageUploadButton}
                    onPress={() => console.log('Upload image')}
                >
                    <MaterialIcons name="add-photo-alternate" size={24} color="#FFFFFF" />
                    <Text style={styles.imageUploadText}>Update Product Images</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleUpdateProduct}
                >
                    <Text style={styles.submitButtonText}>Update Product</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default EditProductScreen;