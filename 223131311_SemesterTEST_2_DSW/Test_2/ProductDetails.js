import React from "react";
import { View, Text, Image, Button, StyleSheet, Alert } from "react-native";
import { authentication, database } from "../firebaseConfig";
import { ref, push, set } from "firebase/database";

export default function ProductDetailScreen({ route }) {
  const { product } = route.params;

  const addProductToCart = async () => {
    const currentUser = authentication.currentUser;
    if (!currentUser) {
      Alert.alert("Please log in to add items to your cart.");
      return;
    }

    try {
      const cartReference = ref(database, `carts/${currentUser.uid}`);
      const newCartItemReference = push(cartReference);

      await set(newCartItemReference, {
        productTitle: product.title,
        productPrice: product.price,
        productImage: product.image,
        quantity: 1,
      });

      Alert.alert("Added to Cart", `${product.title} has been added to your cart.`);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />
      <Text style={styles.title}>{product.title}</Text>
      <Text>{product.description}</Text>
      <Text style={styles.price}>${product.price}</Text>
      <Button title="Add to Cart" onPress={addProductToCart} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20
  },
  image: {
    width: 150,
    height: 150,
    alignSelf: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10
  },
  price: {
    color: "green",
    fontSize: 18,
    marginVertical: 5
  }
});
