import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { MaterialIcons } from '@expo/vector-icons';
import styles from '../../../styles/screens/admin/addProdStyles';

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

const AddProductScreen = ({ navigation }) => {
    const [productName, setProductName] = useState('');
    const [price, setPrice] = useState('');
    const [stocks, setStocks] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [images, setImages] = useState([]);

    const handleAddProduct = () => {
        // Add product logic here
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
                <Text style={styles.title}>Add New Product</Text>
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
                    <Text style={styles.imageUploadText}>Add Product Images</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.submitButton}
                    onPress={handleAddProduct}
                >
                    <Text style={styles.submitButtonText}>Add Product</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default AddProductScreen;