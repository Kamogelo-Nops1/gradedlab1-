import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";

export default function LoginScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  async function LoginUser(userEmail, userPassword) {
    if (!userEmail || !userPassword) throw new Error("Email and password are required");
    try {
      const userCredential = await signInWithEmailAndPassword(auth, userEmail.trim(), userPassword);
      const loggedInUser = userCredential.user;
      return loggedInUser;
    } catch (error) {
      if (error.code === "auth/user-not-found") throw new Error("User not found");
      if (error.code === "auth/wrong-password") throw new Error("Incorrect password");
      throw error;
    }
  }

  const handleLoginButtonPress = async () => {
    try {
      await LoginUser(userEmail, userPassword);
    } catch (error) {
      Alert.alert("Login Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        placeholder="Email"
        style={styles.inputField}
        value={userEmail}
        onChangeText={setUserEmail}
      />
      <TextInput
        placeholder="Password"
        style={styles.inputField}
        secureTextEntry
        value={userPassword}
        onChangeText={setUserPassword}
      />
      <TouchableOpacity style={styles.loginButton} onPress={handleLoginButtonPress}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={styles.linkText}>Don't have an account? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: "center",
     padding: 20
 },

  title: { fontSize: 28, 
    fontWeight: "bold",
     marginBottom: 20, 
     textAlign: "center" },
  inputField: { borderWidth: 1, 
    borderColor: "gray",
     padding: 10,
      borderRadius: 5,
       marginBottom: 15 },
  loginButton: { backgroundColor: "blue",
     padding: 15, 
     borderRadius: 5,
    alignItems: "center" },
  loginButtonText: { color: "white", 
    fontWeight: "bold" },
  linkText: { color: "blue",
     textAlign: "center", 
     marginTop: 15 },
});
