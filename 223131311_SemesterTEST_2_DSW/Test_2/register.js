import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from "../firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function RegisterScreen({ navigation }) {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");

  async function registerUser(userEmail, userPassword) {
    if (!userEmail || !userPassword) throw new Error("Email and password are required");
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userEmail.trim(), userPassword);
      return userCredential.user;
    } catch (error) {
      if (error.code === "auth/email-already-in-use") throw new Error("Email already in use");
      if (error.code === "auth/weak-password") throw new Error("Password should be at least 6 characters");
      throw error;
    }
  }

  const handleRegisterButtonPress = async () => {
    try {
      await registerUser(userEmail, userPassword);
      navigation.navigate("Login");
    } catch (error) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <TouchableOpacity style={styles.registerButton} onPress={handleRegisterButtonPress}>
        <Text style={styles.registerButtonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
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
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center"
  },
  inputField: {
    borderWidth: 1,
    borderColor: "gray",
    padding: 10,
    borderRadius: 5,
    marginBottom: 15
  },
  registerButton: {
    backgroundColor: "blue",
    padding: 15,
    borderRadius: 5,
    alignItems: "center"
  },
  registerButtonText: {
    color: "white",
    fontWeight: "bold"
  },
  linkText: {
    color: "blue",
    textAlign: "center",
    marginTop: 15
  }
});
