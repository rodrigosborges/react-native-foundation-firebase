import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  ActivityIndicator
} from "react-native";
import BookCount from "../components/BookCount";
import { Ionicons } from "@expo/vector-icons";
import CustomActionButton from "../components/CustomActionButton";
import colors from "../assets/colors";
import * as firebase from "firebase/app";
import "firebase/storage";
import { snapshotToArray } from "../helpers/firebaseHelpers";
import ListItem from "../components/ListItem";
import * as Animatable from "react-native-animatable";
import { connect, useDispatch, useSelector } from "react-redux";
import { compose } from "redux";
import { connectActionSheet } from "@expo/react-native-action-sheet";
import ListEmptyComponent from "../components/ListEmptyComponent";
import Swipeout from "react-native-swipeout";
import * as ImageHelpers from "../helpers/ImageHelpers";
import BookRow from "../components/BookRow";

import { loadBooks, toggleIsLoadingBooks, addBook } from "../redux/actions";

export default function HomeScreenHooks() {
  const [textInputData, setTextInputData] = useState("");
  const textInputRef = useRef();

  const user = useSelector(state => state.auth.currentUser);
  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchBooks() {
      const books = await firebase
        .database()
        .ref("books")
        .child(user.uid)
        .once("value");

      const booksArray = snapshotToArray(books);

      dispatch(loadBooks(booksArray.reverse()));
      dispatch(toggleIsLoadingBooks(false));
    }

    fetchBooks();
  }, [dispatch, user]);

  const { isLoadingBooks, books } = useSelector(state => state.books);

  const handleAddBook = async book => {
    setTextInputData("");
    textInputRef.current.setNativeProps({ text: "" });

    try {
      const snapshot = await firebase
        .database()
        .ref("books")
        .child(user.uid)
        .orderByChild("name")
        .equalTo(book)
        .once("value");

      if (snapshot.exists()) {
        alert("unable to add as book already exists");
      } else {
        const key = await firebase
          .database()
          .ref("books")
          .child(user.uid)
          .push().key;

        const response = await firebase
          .database()
          .ref("books")
          .child(user.uid)
          .child(key)
          .set({ name: book, read: false });
        dispatch(addBook({ name: book, read: false, key: key }));
        // this.props.addBook({  });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <SafeAreaView />

      <View style={styles.container}>
        {isLoadingBooks && (
          <View
            style={{
              ...StyleSheet.absoluteFill,
              alignItems: "center",
              justifyContent: "center",
              zIndex: 1000,
              elevation: 1000
            }}
          >
            <ActivityIndicator size="large" color={colors.logoColor} />
          </View>
        )}
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="Enter Book Name"
            placeholderTextColor={colors.txtPlaceholder}
            onChangeText={text => setTextInputData(text)}
            ref={textInputRef}
          />
        </View>

        <FlatList
          data={books}
          renderItem={({ item }, index) => (
            <BookRow item={item} index={index} />
          )}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            !isLoadingBooks && (
              <ListEmptyComponent text="Not Reading Any Books." />
            )
          }
        />
        <Animatable.View
          animation={
            textInputData.length > 0 ? "slideInRight" : "slideOutRight"
          }
        >
          <CustomActionButton
            position="right"
            style={styles.addNewBookButton}
            onPress={() => handleAddBook(textInputData)}
          >
            <Text style={styles.addNewBookButtonText}>+</Text>
          </CustomActionButton>
        </Animatable.View>
      </View>

      <SafeAreaView />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bgMain
  },
  header: {
    height: 70,
    borderBottomWidth: 0.5,
    borderBottomColor: colors.borderColor,
    alignItems: "center",
    justifyContent: "center"
  },
  headerTitle: {
    fontSize: 24
  },
  textInputContainer: {
    height: 50,
    flexDirection: "row",
    margin: 5
  },
  textInput: {
    flex: 1,
    backgroundColor: "transparent",
    borderColor: colors.listItemBg,
    borderBottomWidth: 5,
    fontSize: 22,
    fontWeight: "200",
    color: colors.txtWhite
  },
  checkmarkButton: {
    backgroundColor: colors.bgSuccess
  },
  listEmptyComponent: {
    marginTop: 50,
    alignItems: "center"
  },
  listEmptyComponentText: {
    fontWeight: "bold"
  },
  markAsReadButton: {
    width: 100,
    backgroundColor: colors.bgSuccess
  },
  markAsReadButtonText: {
    fontWeight: "bold",
    color: "white"
  },
  addNewBookButton: {
    backgroundColor: colors.bgPrimary,
    borderRadius: 25
  },
  addNewBookButtonText: {
    color: "white",
    fontSize: 30
  },
  footer: {
    height: 70,
    flexDirection: "row",
    borderTopWidth: 0.5,
    borderTopColor: colors.borderColor
  }
});
5.4;
