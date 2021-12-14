import GLOBAL from "../GLOBAL.json";
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Pressable,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import createStyles from "../styles/styles";
import axios from "axios";

import { useSelector, useDispatch } from "react-redux";
import { selectUserId } from "../features/user/userSlice";
import { selectMessage, createMessage } from "../features/message/messageSlice";

const SelectedUserButton = ({ userId, selectUsers, setSelectUsers }) => {
  const styles = createStyles();
  return (
    <Pressable
      style={{
        backgroundColor: styles.colors.warning,
        borderRadius: 50,
        padding: 5,
        paddingLeft: 10,
        paddingRight: 10,
        flexDirection: "row",
        alignItems: "center",
        direction: "ltr",
      }}
      onPress={() =>
        setSelectUsers(selectUsers.filter((item) => item !== userId))
      }
    >
      <Text style={{ color: "white", fontSize: 14 }}>{userId}</Text>
      <Icon name="close" color="white" size={12} style={{ marginLeft: 5 }} />
    </Pressable>
  );
};

const ChatNewMessageSearchBar = ({
  setSearchUserList,
  selectUsers,
  setSelectUsers,
}) => {
  const styles = createStyles();
  const userId = useSelector(selectUserId);
  const [search, onChangeSearch] = useState("");
  const searchInput = useRef(null);
  const searchTimer = useRef(null);
  const horizontalScrollView = useRef(null);
  const searchAction = async (keyword) => {
    const result = (
      await axios.get(`${GLOBAL.SERVERIP}/api/search/users/${keyword}`)
    ).data.filter((item) => item.userId !== userId);
    setSearchUserList(result);
  };
  useEffect(() => {
    searchInput.current.focus(); //focus on mounted
  }, []);
  useEffect(() => {
    horizontalScrollView.current.scrollToEnd(); //scoll to end every changing of selecting
  });
  return (
    <ScrollView
      contentContainerStyle={{
        flexDirection: "row",
        direction: "rtl",
        marginTop: 20,
        marginBottom: 20,
        minHeight: 30,
        flexGrow: 1,
      }}
      horizontal={true}
      showsHorizontalScrollIndicator={false}
      ref={horizontalScrollView}
    >
      <View style={{ flex: 1 }}>
        <TextInput
          ref={searchInput}
          style={[
            styles.css.normalFont,
            {
              flex: 1,
              marginLeft: 15,
              marginRight: 15,
              fontSize: 16,
            },
          ]}
          onChangeText={onChangeSearch}
          value={search}
          placeholder="Search..."
          onChange={({ nativeEvent: { eventCount, target, text } }) => {
            clearTimeout(searchTimer.current);
            text.length > 0 &&
              (searchTimer.current = setTimeout(() => searchAction(text), 500));
          }}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          marginRight: 0,
          marginLeft: 15,
          direction: "ltr",
        }}
      >
        {/* <FlatList
        data={selectUsers}
        keyExtractor={(item, index) => "selectedUser" + index + item.userId}
        renderItem={({ item }) => (
          <SelectedUserButton
            userId={item}
            selectUsers={selectUsers}
            setSelectUsers={setSelectUsers}
          />
        )}
        horizontal={true}
      /> */}
        {selectUsers.map((item, index) => {
          return (
            <SelectedUserButton
              userId={item}
              selectUsers={selectUsers}
              setSelectUsers={setSelectUsers}
              key={"selectedUserButton" + index}
            />
          );
        })}
      </View>
    </ScrollView>
  );
};

const ChatNewMessageSelectUser = ({ userId, selectUsers, setSelectUsers }) => {
  const styles = createStyles();
  const isSelected = selectUsers.includes(userId);
  const selectUser = () => {
    isSelected
      ? setSelectUsers(selectUsers.filter((users) => users !== userId))
      : setSelectUsers([...selectUsers, userId]);
  };
  return (
    <Pressable
      style={{
        height: 50,
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        marginTop: 15,
      }}
      onPress={() => selectUser()}
    >
      <Image
        style={{ height: "100%", aspectRatio: 1, borderRadius: 50 }}
        source={{
          uri: `${GLOBAL.SERVERIP}/users/${userId}/userimage.png`,
        }}
      />
      <Text
        style={[
          styles.css.boldFont,
          { flex: 1, marginLeft: 15, marginRight: 10, fontSize: 13 },
        ]}
      >
        {userId}
      </Text>
      {isSelected ? (
        <Icon name="checkmark-circle" size={32} color={styles.colors.primary} />
      ) : (
        <Icon name="ellipse-outline" size={32} color={styles.colors.border} />
      )}
    </Pressable>
  );
};

const ChatNewMessageSearchResultList = ({
  searchUserList,
  selectUsers,
  setSelectUsers,
}) => {
  const styles = createStyles();
  return (
    <View
      style={{
        marginLeft: 15,
        marginRight: 15,
      }}
    >
      <FlatList
        data={searchUserList}
        keyExtractor={(item, index) => "searchUser" + index + item.userId}
        renderItem={({ item }) => (
          <ChatNewMessageSelectUser
            userId={item.userId}
            selectUsers={selectUsers}
            setSelectUsers={setSelectUsers}
          />
        )}
      />
      {/* <Text style={styles.css.normalFont}>{searchUserList}</Text> */}
    </View>
  );
};

const ChatNewMessage = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const styles = createStyles();
  const [searchUserList, setSearchUserList] = useState([]);
  const [selectUsers, setSelectUsers] = useState([]);
  const message = useSelector(selectMessage);
  return (
    <SafeAreaView style={{ flex: 1, marginTop: 25 }}>
      <View style={[styles.css.custumizeHeader, { alignItems: "center" }]}>
        <Icon
          onPress={() => {
            navigation.goBack();
          }}
          name="chevron-back"
          color={styles.colors.text}
          size={40}
        />
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={styles.css.headerFont}>New Message</Text>
        </View>
        <TouchableOpacity
          style={{
            margin: 5,
            marginRight: 10,
            paddingBottom: 2, //visual center Icon
          }}
          disabled={selectUsers.length !== 1} //only private chat now, will develop group chat
          onPress={() => {
            if (
              !!message.filter(
                (item) =>
                  JSON.stringify(item.userId.sort()) ===
                  JSON.stringify(selectUsers.sort())
              ).length
            ) {
              //contact already exists
              navigation.goBack();
              navigation.push("ChatMessage", { contactId: selectUsers });
            } else {
              //need to create contact
              dispatch(createMessage(selectUsers[0]));
              navigation.goBack();
              navigation.push("ChatMessage", { contactId: selectUsers });
            }
          }}
        >
          <Text
            style={[
              styles.css.headerFont,
              {
                fontWeight: "600",
                color:
                  selectUsers.length !== 1
                    ? styles.colors.subText
                    : styles.colors.text,
              },
            ]}
          >
            Chat
          </Text>
        </TouchableOpacity>
      </View>
      <View
        style={{
          marginTop: 10,
        }}
      >
        <Text
          style={[
            styles.css.boldFont,
            { fontSize: 16, marginLeft: 15, marginRight: 15 },
          ]}
        >
          To
        </Text>
        <ChatNewMessageSearchBar
          setSearchUserList={setSearchUserList}
          selectUsers={selectUsers}
          setSelectUsers={setSelectUsers}
        />
        <ChatNewMessageSearchResultList
          selectUsers={selectUsers}
          searchUserList={searchUserList}
          setSelectUsers={setSelectUsers}
        />
      </View>
    </SafeAreaView>
  );
};

export default ChatNewMessage;
