import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authentication, database } from "../firebaseConfig";
import { ref, onValue } from "firebase/database";

export default function CartScreen() {
  const [userCart, setUserCart] = useState([]);

  useEffect(() => {
    const loadCart = async () => {
      const currentUser = authentication.currentUser;
      if (!currentUser) return;

      const cartReference = ref(database, `carts/${currentUser.uid}`);

      onValue(
        cartReference,
        async (snapshot) => {
          const cartData = snapshot.val();
          const cartItems = cartData ? Object.values(cartData) : [];
          setUserCart(cartItems);
          try {
            await AsyncStorage.setItem(`cart_${currentUser.uid}`, JSON.stringify(cartItems));
          } catch (err) {
            console.error(err);
          }
        },
        (error) => {
          console.error(error);
        }
      );

      try {
        const storedCart = await AsyncStorage.getItem(`cart_${currentUser.uid}`);
        if (storedCart && !userCart.length) {
          setUserCart(JSON.parse(storedCart));
        }
      } catch (err) {
        console.error(err);
      }
    };

    loadCart();
  }, []);

  const totalAmount = userCart.reduce(
    (sum, item) => sum + item.productPrice * (item.quantity || 1),
    0
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Shopping Cart</Text>
      <FlatList
        data={userCart}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <Image source={{ uri: item.productImage }} style={styles.cartItemImage} />
            <View>
              <Text>{item.productTitle}</Text>
              <Text>${item.productPrice}</Text>
            </View>
          </View>
        )}
      />
      <Text style={styles.totalText}>Total: ${totalAmount.toFixed(2)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1,
     padding: 20 },

  title: { fontSize: 22,
     fontWeight: "bold",
      marginBottom: 10 },

  cartItem: { flexDirection: "row",
     alignItems: "center",
      marginVertical: 5 },

  cartItemImage: { width: 60, 
    height: 60, 
    marginRight: 10 },

  totalText: { fontSize: 18, 
    fontWeight: "bold",
     marginTop: 10 },
});
