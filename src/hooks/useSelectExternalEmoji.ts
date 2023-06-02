import { useContext, useCallback } from 'react'
import { KeyboardContext } from '../contexts/KeyboardContext'
import { useKeyboardStore } from '../store/useKeyboardStore'
import type { JsonEmoji } from '../types'
import { parseEmoji } from '../utils/parseEmoji'

export const useSelectExternalEmoji = () => {
  const { onEmojiSelected, clearEmojiTonesData, selectedEmojis } = useContext(KeyboardContext)
  const { setKeyboardState } = useKeyboardStore()

  const handleEmojiPress = useCallback(
    (emoji: JsonEmoji) => {
      if (emoji.name === 'blank emoji') return
      clearEmojiTonesData()
      const parsedEmoji = parseEmoji(emoji)
      setKeyboardState({ type: 'RECENT_EMOJI_ADD', payload: emoji })
      if (Array.isArray(selectedEmojis))
        return onEmojiSelected({
          ...parsedEmoji,
          alreadySelected: selectedEmojis.includes(emoji.name),
        })
      onEmojiSelected(parsedEmoji)
    },
    [selectedEmojis, onEmojiSelected, setKeyboardState, clearEmojiTonesData]
  )

  return { handleEmojiPress }
}
