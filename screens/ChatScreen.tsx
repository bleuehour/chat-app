import { AntDesign, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "@rneui/themed";
import { StatusBar } from "expo-status-bar";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import React, { useLayoutEffect, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { data } from "../components/CustomListItem";
import { auth, db } from "../firebase";

const ChatScreen = ({ route }: any) => {
  const navigation = useNavigation();
  const [input, setInput] = useState("");
  const [message, setMessages] = useState<data[]>([]);

  const sendMessage = async () => {
    Keyboard.dismiss();

    const docRef = doc(db, "chats", route.params.id);
    const colRef = collection(docRef, "messages");
    await addDoc(colRef, {
      timestamp: serverTimestamp(),
      message: input,
      displayName: auth.currentUser?.displayName,
      email: auth.currentUser?.email,
      photoUrl: auth.currentUser?.photoURL,
    });
    setInput("");
  };

  useLayoutEffect(() => {
    const docRef = doc(db, "chats", route.params.id);
    const colRef = collection(docRef, "messages");
    const q = query(colRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatarr: data[] = [];
      querySnapshot.forEach((doc) => {
        chatarr.push({ id: doc.id, data: doc.data() });
      });
      setMessages(chatarr);
    });
  }, [route]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chat",
      headerBackTitleVisible: false,
      headerTitle: () => (
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", marginLeft: 10, fontWeight: "700" }}>
            {route.params.chatName}
          </Text>
        </View>
      ),
      headerLeft: () => (
        <TouchableOpacity onPress={navigation.goBack}>
          <AntDesign name="arrowleft" size={24} color="white" />
        </TouchableOpacity>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: 80,
            marginRight: 0,
          }}
        >
          <TouchableOpacity>
            <AntDesign name="videocamera" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity>
            <Ionicons name="call" size={24} color="white" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation, message]);
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={90}
        style={styles.container}
      >
        <>
          <ScrollView>
            {message.map(({ id, data }) =>
              data.email === auth.currentUser?.email ? (
                <View key={id} style={styles.rec}>
                  <Avatar
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                    right={-5}
                    bottom={-15}
                    position="absolute"
                    rounded
                    size={30}
                    source={{ uri: data.photoUrl }}
                  />
                  <Text style={styles.recieverText}>{data.message}</Text>
                </View>
              ) : (
                <View key={id} style={styles.sen}>
                  <Avatar
                    containerStyle={{
                      position: "absolute",
                      bottom: -15,
                      right: -5,
                    }}
                    right={-5}
                    bottom={-15}
                    position="absolute"
                    rounded
                    size={30}
                    source={{ uri: data.photoUrl }}
                  />
                  <Text style={styles.senderText}>{data.message}</Text>
                </View>
              )
            )}
          </ScrollView>

          <View style={styles.footer}>
            <TextInput
              value={input}
              onChangeText={(text) => setInput(text)}
              onSubmitEditing={sendMessage}
              style={styles.Textinput}
              placeholder="send message"
            />
            <TouchableOpacity onPress={sendMessage}>
              <Ionicons name="send" size={24} color="black" />
            </TouchableOpacity>
          </View>
        </>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  footer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 15,
  },
  container: {
    flex: 1,
  },
  Textinput: {
    bottom: 0,
    height: 40,
    flex: 1,
    marginRight: 15,
    borderColor: "transparent",
    backgroundColor: "#ECECEC",
    padding: 10,
    color: "black",
    borderRadius: 30,
  },
  recieverText: {
    color: "black",
    fontWeight: "500",
    marginLeft: 10,
    marginBottom: 15,
  },
  senderText: {
    color: "white",
    fontWeight: "500",
    marginRight: 10,
    marginBottom: 15,
  },
  rec: {
    padding: 15,
    backgroundColor: "#ECECEC",
    alignSelf: "flex-end",
    borderRadius: 20,
    marginRight: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
  sen: {
    padding: 15,
    backgroundColor: "#02d629",
    alignSelf: "flex-start",
    borderRadius: 20,
    marginLeft: 15,
    marginBottom: 20,
    maxWidth: "80%",
    position: "relative",
  },
});

export default ChatScreen;
