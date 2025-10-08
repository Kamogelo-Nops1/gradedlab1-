import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from "react-native";

export default function ProductListScreen({ navigation }) {
  const [productList, setProductList] = useState([]);
  const [categoryList, setCategoryList] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchProductsAndCategories() {
      try {
        const productsResponse = await fetch("https://fakestoreapi.com/products");
        const productsData = await productsResponse.json();
        setProductList(productsData);

        const categoriesResponse = await fetch("https://fakestoreapi.com/products/categories");
        const categoriesData = await categoriesResponse.json();
        setCategoryList(["all", ...categoriesData]);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch products or categories");
      } finally {
        setLoadingProducts(false);
      }
    }

    fetchProductsAndCategories();
  }, []);

  const filteredProducts = selectedCategory === "all"
    ? productList
    : productList.filter(product => product.category === selectedCategory);

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      style={styles.productContainer}
      onPress={() => navigation.navigate("Product Details", { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <Text style={styles.productTitle}>{item.title}</Text>
      <Text style={styles.productPrice}>${item.price}</Text>
    </TouchableOpacity>
  );

  if (loadingProducts) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryContainer}>
        {categoryList.map((category, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.categoryButton, selectedCategory === category && styles.categoryButtonSelected]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text style={styles.categoryText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderProductItem}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    padding: 10 
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  categoryContainer: { 
    flexDirection: "row", 
    marginBottom: 10 
  },
  categoryButton: { 
    paddingVertical: 5, 
    paddingHorizontal: 10, 
    borderWidth: 1, 
    borderColor: "gray", 
    borderRadius: 5, 
    marginRight: 5 
  },
  categoryButtonSelected: { 
    backgroundColor: "lightblue" 
  },
  categoryText: { 
    fontSize: 14, 
    color: "black" 
  },
  productContainer: { 
    marginBottom: 15, 
    padding: 10, 
    borderWidth: 1, 
    borderColor: "gray" 
  },
  productImage: { 
    width: "100%", 
    height: 150 
  },
  productTitle: { 
    fontSize: 16, 
    marginVertical: 5 
  },
  productPrice: { 
    fontSize: 14, 
    color: "blue" 
  },
  listContainer: { 
    paddingBottom: 20 
  },
});

