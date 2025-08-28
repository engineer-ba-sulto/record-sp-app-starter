import { ScrollView, View } from "react-native";
import {
  OnboardingPagerLogicProps,
  useOnboardingPager,
} from "../../hooks/useOnboardingPager";

// コンポーネントのProps型定義
export interface OnboardingPagerProps extends OnboardingPagerLogicProps {}

export const OnboardingPager: React.FC<OnboardingPagerProps> = ({
  children,
  currentIndex,
  onIndexChange,
}) => {
  const { state, handlers, screenWidth } = useOnboardingPager({
    currentIndex,
    onIndexChange,
  });

  return (
    <ScrollView
      ref={state.scrollViewRef}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onMomentumScrollEnd={handlers.handleMomentumScrollEnd}
      scrollEventThrottle={16}
      className="flex-1"
      accessibilityRole="scrollbar"
      accessibilityLabel="オンボーディング画面のスワイプ"
    >
      {children.map((child, index) => (
        <View
          key={index}
          className="flex-1"
          style={{ width: screenWidth }}
          accessibilityRole="tab"
          accessibilityState={{ selected: index === currentIndex }}
          accessibilityLabel={`オンボーディング画面 ${index + 1}`}
        >
          {child}
        </View>
      ))}
    </ScrollView>
  );
};
