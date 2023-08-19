import { Alert, FlatList, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useContext, useEffect, useState } from 'react'
import color from '../misc/color'
import PlayListInputModal from '../components/PlayListInputModal'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { AudioContext } from '../context/AudioProvider'
import PlayListDetail from '../components/PlayListDetail'


let selectedPlayList = {}
export default function PlayList({ navigation }) {
  const [modalVisible, setModalVisible] = useState(false)
  const [showPlayList, setShowPlayList] = useState(false)
  const context = useContext(AudioContext)
  const { playList, addToPlayList, updateState } = context
  const createPlayList =async playListName => {
    const result = await AsyncStorage.getItem('playlist')
    if(result !== null) {
      const audios = []
      if(addToPlayList){
        audios.push(addToPlayList)
      }
      const newList = {
        id: Date.now(),
        title: playListName,
        audios: audios
      }

      const updatedList = [...playList, newList]
      updateState(context, {addToPlayList: null, playList: updatedList})
      await AsyncStorage.setItem('playlist', JSON.stringify(updatedList))
    }
    setModalVisible(false)
  }

  const renderPlayList = async() => {
    const result = await AsyncStorage.getItem('playlist');
    if(result === null) {
      const defaultPlayList = {
        id: Date.now(),
        title: 'My Favorite',
        audios: []
      }

      const newPlayList = [...playList, defaultPlayList]
      updateState(context, {
        playList: [...newPlayList]
      })

      return await AsyncStorage.setItem('playlist', JSON.stringify(newPlayList))
    }
    updateState(context, {
      playList: JSON.parse(result)
    })
  }

  useEffect(() => {
    if(!playList.length){
      renderPlayList()
    }
  }, [])

  const handleBannerPress = async(playList) => {
    if(addToPlayList){
      const result = await AsyncStorage.getItem('playlist')
      let oldList = []
      let sameAudio = false;
      let updatedList = []
      if(result !== null){
        oldList = JSON.parse(result)
        updatedList = oldList.filter(list => {
          if(list.id === playList.id){
            for(let audio of list.audios){
              if(audio.id === addToPlayList.id) {
                sameAudio = true
                return;
              }
            }
            list.audios = [...list.audios, addToPlayList]
          }
          return list;
        })
      }

      if(sameAudio){
        Alert.alert('Found same audio!', `${addToPlayList.filename} is already inside the playlist`)
        sameAudio = false
        return updateState(context, {addToPlayList: null})
      }

      updateState(context, {addToPlayList: null, playList: [...updatedList]})
      return await AsyncStorage.setItem('playlist', JSON.stringify([...updatedList]))
    }
    selectedPlayList = playList
    navigation.navigate('PlayListDetail', playList)
  }
  return (
    <>
      <ScrollView contentContainerStyle={styles.container}>
        
        {
          playList.length ? playList.map(item => 
            <TouchableOpacity style={styles.playlistBanner} key={item.id.toString()} onPress={() => handleBannerPress(item)}> 
              <Text>{item.title}</Text>
              <Text style={styles.audioCount}>
                {item.audios.length > 1 ? `${item.audios.length} Songs`: `${item.audios.length} Song`}
              </Text>
            </TouchableOpacity>
          )
          : 
          null
        }
        <TouchableOpacity onPress={() => { setModalVisible(true) }} style={{marginTop: 15}}>
          <Text style={styles.playListBtn}>+ Add New Playlist</Text>
        </TouchableOpacity>
        <PlayListInputModal 
          modalVisible={modalVisible} 
          onClose={() => setModalVisible(false)}
          onSubmit= {(playListName => createPlayList(playListName))}
        />
      </ScrollView>
      <PlayListDetail visible={showPlayList} playList={selectedPlayList} onClose={() => setShowPlayList(false)}/>
    </>
  )
}

const styles = StyleSheet.create({
    container: {
      padding: 20
    },
    playlistBanner: {
      padding: 5,
      backgroundColor: 'rgba(204, 204, 204, 0.3)',
      borderRadius: 5,
      marginBottom: 5
    },
    audioCount: {
      marginTop: 4,
      opacity: 0.5,
      fontSize: 14
    },
    playListBtn: {
      color: color.ACTIVE_BG,
      letterSpacing: 1,
      fontWeight: 'bold',
      fontSize: 14,
      padding: 5
    }
})