import React from "react";
import { View, Text, StyleSheet } from "react-native";

import Swipeout from "react-native-swipeout";
import { Ionicons } from "@expo/vector-icons";
import colors from "../assets/colors";
import * as ImageHelpers from "../helpers/ImageHelpers";
import ListItem from "./ListItem";
import { useDispatch, useSelector } from "react-redux";

import {
  toggleIsLoadingBooks,
  deleteBook,
  markBookAsRead,
  makrBookAsUnread,
  updateBookImage,
  markBookAsUnread
} from "../redux/actions";

import firebase from "firebase/app";
import "firebase/database";
import "firebase/storage";

import { useActionSheet } from "@expo/react-native-action-sheet";

const BookRow = ({ item, index }) => {
  const dispatch = useDispatch();

  const currentUser = useSelector(state => state.auth.currentUser);

  const { showActionSheetWithOptions } = useActionSheet();

  const markAsRead = async (selectedBook, index) => {
    try {
      // this.props.toggleIsLoadingBooks(true);
      dispatch(toggleIsLoadingBooks(true));

      await firebase
        .database()
        .ref("books")
        .child(currentUser.uid)
        .child(selectedBook.key)
        .update({ read: true });

      dispatch(markBookAsRead(selectedBook));
      // this.props.markBookAsRead(selectedBook);
      // this.props.toggleIsLoadingBooks(false);
      dispatch(toggleIsLoadingBooks(false));
    } catch (error) {
      console.log(error);
      // this.props.toggleIsLoadingBooks(false);
      dispatch(toggleIsLoadingBooks(false));
    }
  };

  const markAsUnread = async (selectedBook, index) => {
    try {
      // this.props.toggleIsLoadingBooks(true);
      dispatch(toggleIsLoadingBooks(true));

      await firebase
        .database()
        .ref("books")
        .child(currentUser.uid)
        .child(selectedBook.key)
        .update({ read: false });

      dispatch(markBookAsUnread(selectedBook));
      dispatch(toggleIsLoadingBooks(false));

      // this.props.markBookAsUnread(selectedBook);
      // this.props.toggleIsLoadingBooks(false);
    } catch (error) {
      console.log(error);
      // this.props.toggleIsLoadingBooks(false);
      dispatch(toggleIsLoadingBooks(false));
    }
  };

  const handleDeleteBook = async (selectedBook, index) => {
    try {
      // this.props.toggleIsLoadingBooks(true);
      dispatch(toggleIsLoadingBooks(true));

      await firebase
        .database()
        .ref("books")
        .child(currentUser.uid)
        .child(selectedBook.key)
        .remove();

      dispatch(deleteBook(selectedBook));
      dispatch(toggleIsLoadingBooks(false));

      // this.props.deleteBook(selectedBook);
      // this.props.toggleIsLoadingBooks(false);
    } catch (error) {
      console.log(error);
      // this.props.toggleIsLoadingBooks(false);
      dispatch(toggleIsLoadingBooks(false));
    }
  };

  const uploadImage = async (image, selectedBook) => {
    const ref = firebase
      .storage()
      .ref("books")
      .child(currentUser.uid)
      .child(selectedBook.key);

    try {
      //converting to blob
      const blob = await ImageHelpers.prepareBlob(image.uri);
      const snapshot = await ref.put(blob);

      let downloadUrl = await ref.getDownloadURL();

      await firebase
        .database()
        .ref("books")
        .child(currentUser.uid)
        .child(selectedBook.key)
        .update({ image: downloadUrl });

      blob.close();

      return downloadUrl;
    } catch (error) {
      console.log(error);
    }
  };

  const openImageLibrary = async selectedBook => {
    const result = await ImageHelpers.openImageLibrary();

    if (result) {
      // this.props.toggleIsLoadingBooks(true);
      dispatch(toggleIsLoadingBooks(true));

      const downloadUrl = await uploadImage(result, selectedBook);

      dispatch(updateBookImage({ ...selectedBook, uri: downloadUrl }));
      dispatch(toggleIsLoadingBooks(false));
      // this.props.updateBookImage({ ...selectedBook, uri: downloadUrl });
      // this.props.toggleIsLoadingBooks(false);
    }
  };

  const openCamera = async selectedBook => {
    const result = await ImageHelpers.openCamera();

    if (result) {
      // this.props.toggleIsLoadingBooks(true);
      dispatch(toggleIsLoadingBooks(true));

      const downloadUrl = await uploadImage(result, selectedBook);
      dispatch(updateBookImage({ ...selectedBook, uri: downloadUrl }));
      dispatch(toggleIsLoadingBooks(false));
    }
  };

  const addBookImage = selectedBook => {
    // Same interface as https://facebook.github.io/react-native/docs/actionsheetios.html
    const options = ["Select from Photos", "Camera", "Cancel"];
    const cancelButtonIndex = 2;

    showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex
      },
      buttonIndex => {
        // Do something here depending on the button index selected
        if (buttonIndex == 0) {
          openImageLibrary(selectedBook);
        } else if (buttonIndex == 1) {
          openCamera(selectedBook);
        }
      }
    );
  };

  let swipeoutButtons = [
    {
      text: "Delete",
      component: (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Ionicons name="ios-trash" size={24} color={colors.txtWhite} />
        </View>
      ),
      backgroundColor: colors.bgDelete,
      onPress: () => handleDeleteBook(item, index)
    }
  ];

  if (!item.read) {
    swipeoutButtons.unshift({
      text: "Mark Read",
      component: (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: colors.txtWhite }}>Mark as Read</Text>
        </View>
      ),
      backgroundColor: colors.bgSuccessDark,
      onPress: () => markAsRead(item, index)
    });
  } else {
    swipeoutButtons.unshift({
      text: "Mark Unread",
      component: (
        <View
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Text style={{ color: colors.txtWhite }}>Mark Unread</Text>
        </View>
      ),
      backgroundColor: colors.bgUnread,
      onPress: () => markAsUnread(item, index)
    });
  }

  return (
    <Swipeout
      autoClose={true}
      style={{ marginHorizontal: 5, marginVertical: 5 }}
      backgroundColor={colors.bgMain}
      right={swipeoutButtons}
    >
      <ListItem
        editable
        onPress={() => addBookImage(item)}
        editable={true}
        marginVertical={0}
        item={item}
      >
        {item.read && (
          <Ionicons
            style={{ marginRight: 5 }}
            name="ios-checkmark"
            color={colors.logoColor}
            size={30}
          />
        )}
      </ListItem>
    </Swipeout>
  );
};
export default BookRow;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
