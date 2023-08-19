import { Audio } from "expo-av"
import { storeAudioForNextOpening } from "./helper"

export const play = async(playbackObj, uri, lastPosition) => {
    try {
        if(!lastPosition) return await playbackObj.loadAsync(
            {uri}, 
            {shouldPlay: true, progressUpdateIntervalMillis: 1000}
        )
         
        await playbackObj.loadAsync(
            {uri}, 
            {progressUpdateIntervalMillis: 1000}
        )

        return await playbackObj.playFromPositionAsync(lastPosition)
    } catch (error) {
        console.log(error)
        console.log('error inside play helper method')
    }
}

export const pause = async(playbackObj) => {
    try {
        return await playbackObj.setStatusAsync({shouldPlay: false})
    } catch (error) {
        console.log('error inside pause helper method')
    }
}

export const resume = async(playbackObj) => {
    try {
        return await playbackObj.playAsync()
    } catch (error) {
        console.log('error inside resume helper method')
    }
}
export const playNext = async(playbackObj, uri) => {
    try {
        await playbackObj.stopAsync()
        await playbackObj.unloadAsync()
        return await play(playbackObj, uri)
    } catch (error) {
        console.log(error)
        console.log('error inside play next helper method')
    }
}

export const selectAudio = async(audio, context, playListInfo = {}) => {
    const {soundObj, playbackObj, currentAudio, updateState, audioFiles, onPlaybackStatusUpdate} = context
    try {
        if(soundObj === null){
            const status = await play(playbackObj, audio.uri, audio.lastPosition)
            const index = audioFiles.findIndex(({id}) => id === audio.id)
            updateState(context, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: index,
                isPlayListRunning: false,
                activePlayList: [],
                ...playListInfo
            })
            playbackObj.setOnPlaybackStatusUpdate(onPlaybackStatusUpdate)
            return storeAudioForNextOpening(audio, index)
        }
    
        if(soundObj.isLoaded && soundObj.isPlaying && currentAudio.id === audio.id){
            const status = await pause(playbackObj)
            return updateState(context, {
                soundObj: status,
                isPlaying: false,
                playbackPosition: status.positionMillis
            })
        }
        if(soundObj.isLoaded && 
            !soundObj.isPlaying && 
            currentAudio.id === audio.id) {
                const status = await resume(playbackObj)
                return updateState(context, {
                    soundObj: status,
                    isPlaying: true
                })
        }
    
        if(soundObj.isLoaded && currentAudio.id !== audio.id) {
            const status = await playNext(playbackObj, audio.uri)
            const index = audioFiles.findIndex(({id}) => id === audio.id)
            updateState(context, {
                soundObj: status,
                currentAudio: audio,
                isPlaying: true,
                currentAudioIndex: index
            })
            return await storeAudioForNextOpening(audio, index)
        }
    } catch (error) {
        console.log('error inside select audio method.' , error.message)
    }
}

const selectFromPlayList = async( context, select ) => {
    const {activePlayList, currentAudio, audioFiles, playbackObj, updateState} = context
    let audio
    const indexOnPlayList = activePlayList.audios
    .findIndex(({id}) => id === currentAudio.id)
    let nextIndex;
    let defaultIndex;
    

    

    if(select === 'next') {
        nextIndex = indexOnPlayList + 1
        defaultIndex = 0
    }
    if(select === 'previous') {
        nextIndex = indexOnPlayList - 1
        defaultIndex = activePlayList.audios.length - 1
    }
    audio = activePlayList.audios[nextIndex]
    if(!audio) audio = activePlayList.audios[defaultIndex]

    const indexOnAllList = audioFiles.findIndex(({id}) => id === audio.id)
    const status = await playNext(playbackObj, audio.uri)
    return updateState(context, {
        soundObj: status,
        currentAudio: audio,
        isPlaying: true,
        currentAudioIndex: indexOnAllList,
    })
}

export const changeAudio = async (context, select) => {
    const {
        audioFiles,
        updateState,
        playbackObj,
        totalAudioCount, 
        currentAudioIndex,
        isPlayListRunning,
    } = context

    if(isPlayListRunning) return selectFromPlayList(context, select)
    try {
        const { isLoaded } = await playbackObj.getStatusAsync()
        let audio;
        let index;
        let status;

        if(select === 'next'){
            const isLastAudio = currentAudioIndex + 1 === totalAudioCount
            audio = audioFiles[currentAudioIndex + 1]
            if(!isLoaded && !isLastAudio) {
              index = currentAudioIndex + 1
              status = await play(playbackObj, audio.uri)
            }
            if(isLoaded && !isLastAudio) {
              index = currentAudioIndex + 1
              status = await playNext(playbackObj, audio.uri)
            }
        
            if(isLastAudio) {
              index = 0
              audio = audioFiles[0]
              if(isLoaded) {
                status = await playNext(playbackObj, audio.uri)
              }
              else {
                status = await play(playbackObj, audio.uri)
              }
            }
        }

        if(select === 'previous'){
            const isFirstAudio = context.currentAudioIndex <= 0
            audio = context.audioFiles[context.currentAudioIndex - 1]
            if(!isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1
                status = await play(playbackObj, audio.uri)
            }
              if(isLoaded && !isFirstAudio) {
                index = currentAudioIndex - 1
                status = await playNext(playbackObj, audio.uri)
            }
          
              if(isFirstAudio) {
                index = totalAudioCount - 1
                audio = audioFiles[index]
                if(isLoaded) {
                  status = await playNext(playbackObj, audio.uri)
                }
                else {
                  status = await play(playbackObj, audio.uri)
                }
            }
        }

        updateState(context, {
          currentAudio: audio,
          soundObj: status,
          isPlaying: true,
          currentAudioIndex: index,
          playbackPosition: null,
          playbackDuration: null
        })
    
        storeAudioForNextOpening(audio, index)
    } catch (error) {
        console.log('error inside change audio method.' , error.message)
        
    }
}

export const moveAudio = async (value, context) => {
    if(context.soundObj === null || !context.isPlaying) return
    try{
        const status = await context.playbackObj.
        setPositionAsync(Math.floor(context.soundObj.durationMillis * value))
        context.updateState(context, {soundObj: status, playbackPosition: status.positionMillis})
        await resume(context.playbackObj)
    } catch(e) {
        console.log('error inside onSlidingStart callback', e.message)
    }
}