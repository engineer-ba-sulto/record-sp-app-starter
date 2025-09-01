import { useEffect } from "react";
import {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";

export interface OnboardingIndicatorLogicProps {
  totalScreens: number;
  currentIndex: number;
  activeColor?: string;
  inactiveColor?: string;
  size?: number;
  spacing?: number;
}

export interface OnboardingIndicatorState {
  animatedIndex: any;
}

export interface OnboardingIndicatorHandlers {
  getAnimatedStyle: (index: number) => any;
}

/**
 * OnboardingIndicatorコンポーネントのロジックを管理するカスタムフック
 */
export const useOnboardingIndicator = ({
  totalScreens,
  currentIndex,
  activeColor = "#2563eb",
  inactiveColor = "#d1d5db",
  size = 8,
  spacing = 8,
}: OnboardingIndicatorLogicProps) => {
  const animatedIndex = useSharedValue(currentIndex);

  useEffect(() => {
    animatedIndex.value = withSpring(currentIndex, {
      damping: 15,
      stiffness: 150,
    });
  }, [currentIndex]);

  const getAnimatedStyle = (index: number) => {
    return useAnimatedStyle(() => {
      const isActive = index === animatedIndex.value;
      const scale = interpolate(
        animatedIndex.value,
        [index - 1, index, index + 1],
        [0.8, 1.2, 0.8],
        "clamp"
      );

      return {
        transform: [
          { scale: withTiming(isActive ? scale : 0.8, { duration: 200 }) },
        ],
        backgroundColor: withTiming(isActive ? activeColor : inactiveColor, {
          duration: 200,
        }),
      };
    });
  };

  const state: OnboardingIndicatorState = {
    animatedIndex,
  };

  const handlers: OnboardingIndicatorHandlers = {
    getAnimatedStyle,
  };

  return {
    state,
    handlers,
    size,
    spacing,
    currentIndex,
    totalScreens,
  };
};
