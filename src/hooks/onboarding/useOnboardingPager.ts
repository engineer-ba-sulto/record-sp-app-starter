import { useEffect, useRef } from "react";
import { Dimensions, ScrollView } from "react-native";

const { width: screenWidth } = Dimensions.get("window");

export interface OnboardingPagerLogicProps {
  currentIndex: number;
  onIndexChange: (index: number) => void;
  children: React.ReactNode[];
}

export interface OnboardingPagerState {
  scrollViewRef: React.RefObject<ScrollView>;
}

export interface OnboardingPagerHandlers {
  handleMomentumScrollEnd: (event: any) => void;
}

/**
 * OnboardingPagerコンポーネントのロジックを管理するカスタムフック
 */
export const useOnboardingPager = ({
  currentIndex,
  onIndexChange,
}: Omit<OnboardingPagerLogicProps, "children">) => {
  const scrollViewRef = useRef<ScrollView>(null);

  const handleMomentumScrollEnd = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / screenWidth);
    if (index !== currentIndex) {
      onIndexChange(index);
    }
  };

  // 現在のインデックスが変更された時にScrollViewをスクロール
  useEffect(() => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: currentIndex * screenWidth,
        animated: true,
      });
    }
  }, [currentIndex]);

  const state: OnboardingPagerState = {
    scrollViewRef,
  };

  const handlers: OnboardingPagerHandlers = {
    handleMomentumScrollEnd,
  };

  return {
    state,
    handlers,
    screenWidth,
  };
};
