import { Ionicons } from "@expo/vector-icons";
import {
    useNavigation
} from "@react-navigation/native";
import { Button, Input } from "@rneui/themed";
import { addDoc, collection } from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { db } from "../firebase";

const AddChat = () => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");

  const createChat = async () => {
    await addDoc(collection(db, "chats"), {
      chatName: input,
    })
      .then(() => {
        navigation.goBack();
      })
      .catch((error) => alert(error.message));
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Add a new chat",
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Input
        placeholder="Enter a chat name"
        onChangeText={setInput}
        value={input}
        leftIcon={<Ionicons name="chatbox" size={24} color="black" />}
      />
      <Button title={"Create new Chat"} onPress={createChat} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { backgroundColor: "white" },
});

export default AddChat;
