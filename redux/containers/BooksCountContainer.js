import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { connect } from 'react-redux';
import colors from '../../assets/colors';
import PropTypes from 'prop-types';
const BooksCountContainer = ({ color, type, ...props }) => (
  <View style={styles.container}>
    <Text style={{ color: color }}>{props.books[type].length || 0}</Text>
  </View>
);

const mapStateToProps = state => {
  return {
    books: state.books
  };
};

BooksCountContainer.defaultProps = {
  color: colors.txtPlaceholder
};

BooksCountContainer.propTypes = {
  color: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default connect(mapStateToProps)(BooksCountContainer);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  }
});
