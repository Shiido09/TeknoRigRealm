import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  FlatList,
  ActivityIndicator
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../redux/actions/productAction';
import styles from '../styles/screens/ProductsScreenStyles';



// Categories from backend
const categories = [
  'All', 'Gaming PCs', 'Laptops', 'Components', 
  'Peripherals', 'Displays', 'Networking', 'Storage', 'Audio'
];

const ProductsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { loading = false, products = [], error = null } = useSelector((state) => state.productState || {});

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);

  // Fetch products on component mount
  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Filter products when searchQuery or selectedCategory changes
  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== 'All') {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase();
      filtered = filtered.filter(product => 
        product.product_name.toLowerCase().includes(lowerQuery)
      );
    }

    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, products]); // Ensure proper dependencies

  // Render each product
  const renderProductItem = ({ item, index }) => {
    const isOddColumn = (index % 2) === 1;

    return (
      <TouchableOpacity 
        style={[styles.productCard, isOddColumn && styles.productCard_oddColumn]}
        onPress={() => navigation.navigate('ProductDetail', { product: item })}
      >
        <View style={styles.productImageContainer}>
          <Image 
            source={{ uri: item.product_images[0]?.url || 'https://via.placeholder.com/150/222222/FFFFFF?text=No+Image' }} 
            style={styles.productImage} 
          />
        </View>
        <Text style={styles.productName} numberOfLines={2}>{item.product_name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Products</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor="#888888"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <Text style={styles.categoriesTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesScroll}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryChip, selectedCategory === category && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(category)}
            >
              <Text style={styles.categoryText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Loading and Error Handling */}
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
      ) : error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
        </View>
      ) : filteredProducts.length > 0 ? (
        <FlatList
          data={filteredProducts}
          renderItem={renderProductItem}
          keyExtractor={(item) => item._id}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
        />
      ) : (
        <View style={styles.noProductsContainer}>
          <Text style={styles.noProductsText}>No products found. Try adjusting your search or category.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductsScreen;
