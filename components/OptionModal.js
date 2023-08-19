import { Modal, StatusBar, StyleSheet, Text, TouchableWithoutFeedback, View } from 'react-native'
import React from 'react'
import color from '../misc/color'

export default function OptionModal({visible, onClose, item, options}) {
  return (
    <>
        <StatusBar hidden/>
        <Modal animationType='slide' transparent={true} visible={visible}>
            <View style={styles.modal}>
                <Text numberOfLines={2} style={styles.title}>{item.filename}</Text>
                <View style={styles.optionContainer}>
                    {
                        options.map((option, index) => {
                            return (
                                <TouchableWithoutFeedback key={index} onPress={option.onPress}>
                                    <Text style={styles.option}>{option.title}</Text>
                                </TouchableWithoutFeedback>
                                )
                        })
                    }
                </View>
            </View>
            <TouchableWithoutFeedback onPress={onClose}>
                <View style={styles.modalBg}/>
            </TouchableWithoutFeedback>
        </Modal>
    </>
  )
}

const styles = StyleSheet.create({
    modal: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        backgroundColor: color.APP_BG,
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        zIndex: 1000
    },
    optionContainer: {
        padding: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        padding: 20,
        paddingBottom: 0,
        color: color.FONT_MEDIUM
    },
    option: {
        fontSize: 16,
        fontWeight: 'bold',
        color: color.FONT,
        paddingVertical: 10,
        letterSpacing: 1
    },
    modalBg: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: color.MODAL_BG,
    }
})