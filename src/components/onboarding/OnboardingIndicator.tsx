import { View } from "react-native";
import Animated from "react-native-reanimated";
import {
  OnboardingIndicatorLogicProps,
  useOnboardingIndicator,
} from "../../hooks/useOnboardingIndicator";

// コンポーネントのProps型定義
export interface OnboardingIndicatorProps
  extends OnboardingIndicatorLogicProps {}

export const OnboardingIndicator: React.FC<OnboardingIndicatorProps> = (
  props
) => {
  const { handlers, size, spacing, currentIndex, totalScreens } =
    useOnboardingIndicator(props);

  return (
    <View
      className="flex-row items-center justify-center"
      style={{ gap: spacing }}
      accessibilityRole="tablist"
      accessibilityLabel={`ページ ${currentIndex + 1} / ${totalScreens}`}
    >
      {Array.from({ length: totalScreens }).map((_, index) => {
        const animatedStyle = handlers.getAnimatedStyle(index);

        return (
          <Animated.View
            key={index}
            className="rounded-full"
            style={[
              {
                width: size,
                height: size,
              },
              animatedStyle,
            ]}
            accessibilityRole="tab"
            accessibilityState={{ selected: index === currentIndex }}
            accessibilityLabel={`ページ ${index + 1}`}
          />
        );
      })}
    </View>
  );
};
