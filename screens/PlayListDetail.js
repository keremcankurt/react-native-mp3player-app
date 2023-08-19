import { Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useState } from 'react'
import color from '../misc/color'
import AudioListItem from '../components/AudioListItem'
import { selectAudio } from '../misc/audioController'
import { AudioContext } from '../context/AudioProvider'
import OptionModal from '../components/OptionModal'
import AsyncStorage from '@react-native-async-storage/async-storage'

export default function PlayListDetail(props) {
    const context = useContext(AudioContext)
    const playList = props.route.params
    const playAudio = async(audio) => {
        await selectAudio(audio, context, { isPlayListRunning: true, activePlayList: playList})
    }
    
    const [selectedItem, setSelectedItem] = useState(false)
    const [modalVisible, setModalVisible] = useState({})
    const [audios, setAudios] = useState(playList.audios)

    const closeModal = () => {
        setModalVisible(false)
    }

    const removeAudio = async() => {
        let isPlaying = context.isPlaying
        let isPlayListRunning = context.isPlayListRunning
        let soundObj = context.soundObj
        let playbackPosition = context.playbackPosition
        let activePlayList = context.activePlayList
        if(context.isPlayListRunning && context.currentAudio.id === selectedItem.id) {
            await context.playbackObj.stopAsync()
            await context.playbackObj.unloadAsync()
            isPlaying = false
            isPlayListRunning = false
            soundObj = null
            playbackPosition = 0
            activePlayList = []

        }
        const updatedAudios = audios.filter(audio => audio.id !== selectedItem.id)
        const result =  await AsyncStorage.getItem('playlist')

        if(result !== null) {
            const oldPlayList = JSON.parse(result)
            const updatedPlaylist = oldPlayList.filter(item => {
                if(item.id === playList.id){
                    item.audios = updatedAudios
                }
                return item
            })
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
            context.updateState(context, {
                playList: updatedPlaylist,
                isPlayListRunning,
                activePlayList,
                playbackPosition,
                isPlaying,
                soundObj
            })
        }
        setAudios(updatedAudios)
        closeModal()
    }

    const removePlaylist = async() => {
        let isPlaying = context.isPlaying
        let isPlayListRunning = context.isPlayListRunning
        let soundObj = context.soundObj
        let playbackPosition = context.playbackPosition
        let activePlayList = context.activePlayList
        if(context.isPlayListRunning && activePlayList.id === playList.id) {
            await context.playbackObj.stopAsync()
            await context.playbackObj.unloadAsync()
            isPlaying = false
            isPlayListRunning = false
            soundObj = null
            playbackPosition = 0
            activePlayList = []

        }
        const result =  await AsyncStorage.getItem('playlist')

        if(result !== null) {
            const oldPlayList = JSON.parse(result)
            const updatedPlaylist = oldPlayList.filter(item => {item.id !== playList.id})
            await AsyncStorage.setItem('playlist', JSON.stringify(updatedPlaylist))
            context.updateState(context, {
                playList: updatedPlaylist,
                isPlayListRunning,
                activePlayList,
                playbackPosition,
                isPlaying,
                soundObj
            })
        }
        props.navigation.goBack()
    }
  return (
    <>
        <View style={styles.container}>
            <View style={{
                width: '100%',
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingHorizontal: 15
            }}>
                <Text style={styles.title}>{playList?.title}</Text>
                <TouchableOpacity onPress={removePlaylist}>
                    <Text style={[styles.title, {color: 'red'}]}>Remove</Text>
                </TouchableOpacity>
            </View>
            {
                audios.length ? 
                <FlatList
                    contentContainerStyle={styles.listContainer}
                    data={audios}
                    keyExtractor={item => item.id.toString()}
                    renderItem={({item})=> 
                        <View style={{marginBottom: 10}}>
                            <AudioListItem 
                                item={item} 
                                onAudioPress={() => playAudio(item)}
                                isPlaying={context.isPlaying} 
                                activeListItem={item.id === context.currentAudio.id}
                                onOptionPress ={() => {
                                    setSelectedItem(item)
                                    setModalVisible(true)
                                }}
                            />
                        </View>
                    }
                />
                :
                <Text style={{fontWeight: 'bold', fontSize: 25, color: color.FONT_LIGHT, paddingTop: 10}}>No Audio</Text>
            }
        </View>
        <OptionModal visible={modalVisible} onClose={closeModal} 
            options={
                [
                    {
                        title: 'Remove from Playlist',
                        onPress: removeAudio
                    }
                ]
            } 
            item={selectedItem}

        />
    </>
  )
}

const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    title: {
        textAlign: 'center',
        fontWeight: 'bold',
        paddingVertical: 5,
        color: color.ACTIVE_BG,
        fontSize: 20
    },
    listContainer: {
        padding: 20,
    }
})