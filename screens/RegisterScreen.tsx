import { Button, Input } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import React, { useState } from "react";
import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import { auth } from "../firebase";

const RegisterScreen = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageUrl, setUrl] = useState("");

  const register = async () => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    updateProfile(userCredential.user, {
      displayName: name,
      photoURL: imageUrl,
    }).catch((error) => alert(error.message));
  };

  return (
    <KeyboardAvoidingView behavior="padding" style={styles.container}>
      <StatusBar style="light" />
      <Text style={{ marginBottom: 50 }}>Create an account</Text>

      <View style={styles.inputcontainer}>
        <Input
          onChangeText={(text) => setName(text)}
          placeholder="Full Name"
          textContentType="familyName"
          value={name}
        />
        <Input
          onChangeText={(text) => setEmail(text)}
          placeholder="Email"
          textContentType="emailAddress"
          value={email}
        />
        <Input
          onChangeText={(text) => setPassword(text)}
          placeholder="Password"
          textContentType="password"
          value={password}
          secureTextEntry={true}
        />
        <Input
          onChangeText={(text) => setUrl(text)}
          placeholder="Image url: optional"
          value={imageUrl}
          onSubmitEditing={register}
        />
      </View>

      <Button
        containerStyle={styles.button}
        onPress={register}
        title="Register"
        raised
      />
      <View style={{ height: 100 }} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    backgroundColor: "white",
  },
  inputcontainer: { width: 300 },
  button: { width: 200, marginTop: 10 },
});

export default RegisterScreen;
