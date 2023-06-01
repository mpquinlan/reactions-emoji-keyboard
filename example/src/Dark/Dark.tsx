import * as React from 'react'
import { StyleSheet, Text, TouchableOpacity } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import EmojiPicker from 'pack-reactions'
import type { EmojiType } from 'src/types'

const Dark = () => {
  const [result, setResult] = React.useState<string>()
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false)

  const handlePick = (emoji: EmojiType) => {
    console.log(emoji)
    setResult(emoji.emoji)
    setIsModalOpen((prev) => !prev)
  }
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.text}>Result: {result}</Text>
      <TouchableOpacity onPress={() => setIsModalOpen(true)}>
        <Text style={styles.text}>Open</Text>
      </TouchableOpacity>

      <EmojiPicker
        onEmojiSelected={handlePick}
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        theme={{
          backdrop: '#16161888',
          knob: '#766dfc',
          container: '#282829',
          header: '#fff',
          skinTonesContainer: '#252427',
          category: {
            icon: '#766dfc',
            iconActive: '#fff',
            container: '#252427',
            containerActive: '#766dfc',
          },
        }}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#161618',
  },
  text: {
    textAlign: 'center',
    margin: 64,
    fontSize: 18,
    color: '#fff',
  },
})

export default Dark
