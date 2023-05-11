import * as React from 'react'

import {
  StyleSheet,
  View,
  FlatList,
  useWindowDimensions,
  Animated,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native'
import type { EmojisByCategory } from '../types'
import { EmojiCategory } from './EmojiCategory'
import { KeyboardContext } from '../contexts/KeyboardContext'
import { useKeyboardStore } from '../store/useKeyboardStore'

const CATEGORY_ELEMENT_WIDTH = 37

export const EmojiQuickActions = React.memo(
  () => {
    const { width } = useWindowDimensions()
    const {
      activeCategoryIndex,
      setActiveCategoryIndex,
      onCategoryChangeFailed,
      enableCategoryChangeGesture,
      theme,
      styles: themeStyles,
      shouldAnimateScroll,
      enableCategoryChangeAnimation,
    } = React.useContext(KeyboardContext)
    const { keyboardState } = useKeyboardStore()
    const flatListRef = React.useRef<FlatList>(null)

    const getItemLayout = React.useCallback(
      (_: EmojisByCategory[] | null | undefined, index: number) => ({
        length: width,
        offset: width * index,
        index,
      }),
      [width]
    )

    const [setKeyboardScrollOffsetY] = React.useState(0)

    const renderItem = React.useCallback(
      (props) => <EmojiCategory setKeyboardScrollOffsetY={setKeyboardScrollOffsetY} {...props} />,
      [setKeyboardScrollOffsetY]
    )

    React.useEffect(() => {
      flatListRef.current?.scrollToIndex({
        index: activeCategoryIndex,
        animated: shouldAnimateScroll && enableCategoryChangeAnimation,
      })
    }, [activeCategoryIndex, enableCategoryChangeAnimation, shouldAnimateScroll])

    const keyExtractor = React.useCallback((item: EmojisByCategory) => item.title, [])
    const scrollNav = React.useRef(new Animated.Value(0)).current

    const handleScroll = React.useCallback(
      (el: NativeSyntheticEvent<NativeScrollEvent>) => {
        const index = el.nativeEvent.contentOffset.x / width
        scrollNav.setValue(index * CATEGORY_ELEMENT_WIDTH)
        if (Number.isInteger(index)) setActiveCategoryIndex(index)
      },
      [scrollNav, setActiveCategoryIndex, width]
    )

    console.log(keyboardState.recentlyUsed)

    return (
      <View
        style={[
          styles.container,
          styles.containerShadow,
          themeStyles.container,
          { backgroundColor: theme.container },
        ]}>
        <Animated.FlatList<EmojisByCategory>
          data={keyboardState.recentlyUsed}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          removeClippedSubviews={true}
          ref={flatListRef}
          onScrollToIndexFailed={onCategoryChangeFailed}
          horizontal
          showsHorizontalScrollIndicator={false}
          pagingEnabled
          scrollEventThrottle={16}
          getItemLayout={getItemLayout}
          scrollEnabled={enableCategoryChangeGesture}
          initialNumToRender={1}
          maxToRenderPerBatch={1}
          onScroll={handleScroll}
          keyboardShouldPersistTaps="handled"
        />
      </View>
    )
  },
  () => true
)

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: {
    flex: 1,
    borderRadius: 16,
  },
  containerReverse: { flexDirection: 'column-reverse' },
  containerShadow: {
    shadowColor: 'black',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 5,
    elevation: 10,
  },
})
