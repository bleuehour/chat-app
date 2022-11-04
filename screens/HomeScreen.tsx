import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Avatar } from "@rneui/themed";
import { collection, onSnapshot, query } from "firebase/firestore";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import CustomListItem, { data } from "../components/CustomListItem";
import { auth, db } from "../firebase";

const HomeScreen = () => {
  const [chats, setChats] = useState<data[]>();
  const navigation = useNavigation();

  useEffect(() => {
    const q = query(collection(db, "chats"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const chatarray: data[] = [];
      querySnapshot.forEach((doc) => {
        chatarray.push({ id: doc.id, data: doc.data() });
      });
      setChats(chatarray);
    });
  }, []);

  const signOut = () => {
    auth.signOut().then(() => {
      navigation.replace("Login");
    });
  };
  useLayoutEffect(() => {
    navigation.setOptions({
      title: "Chats",
      
      headerTitleStyle: { color: "black" },
      headerStyle: { backgroundColor: "white" },
      headerLeft: () => (
        <View style={{ marginLeft: -2 }}>
          <TouchableOpacity activeOpacity={0.5} onPress={signOut}>
            <Avatar
              rounded
              source={{ uri: auth?.currentUser?.photoURL || "" }}
            />
          </TouchableOpacity>
        </View>
      ),
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            width: 80,
            marginRight: 0,
          }}
        >
          <TouchableOpacity
            onPress={() => {
              navigation.navigate("AddChat");
            }}
            activeOpacity={0.5}
          >
            <Ionicons name="pencil" size={20} color="black" />
          </TouchableOpacity>
        </View>
      ),
    });
  }, [navigation]);

  const enterChat = (id: string, chatName: string) => {
    navigation.navigate("Chat", {
      id,
      chatName,
    });
  };

  return (
    <SafeAreaView>
      <ScrollView style={styles.container}>
        {chats?.map(({ id, data: { chatName } }) => (
          <CustomListItem
            key={id}
            id={id}
            chatName={chatName}
            enterChat={enterChat}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
});

export default HomeScreen;
