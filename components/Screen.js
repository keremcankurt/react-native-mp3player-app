import { StatusBar, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import color from '../misc/color'

export default function Screen({children}) {
  return (
    <View style={styles.container}>
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: color.APP_BG,
        paddingTop: StatusBar.currentHeight + 10
    }
})