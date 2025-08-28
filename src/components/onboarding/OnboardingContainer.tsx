import { SafeAreaView, View } from "react-native";
import {
  OnboardingContainerLogicProps,
  useOnboardingContainer,
} from "../../hooks/useOnboardingContainer";
import { OnboardingIndicator } from "./OnboardingIndicator";
import { OnboardingPager } from "./OnboardingPager";
import { OnboardingScreen1 } from "./OnboardingScreen1";
import { OnboardingScreen2 } from "./OnboardingScreen2";
import { OnboardingScreen3 } from "./OnboardingScreen3";

// コンポーネントのProps型定義
export interface OnboardingContainerProps
  extends OnboardingContainerLogicProps {}

export const OnboardingContainer: React.FC<OnboardingContainerProps> = (
  props
) => {
  const { state, handlers, totalScreens, screens } =
    useOnboardingContainer(props);

  const renderScreen = (screen: any, index: number) => {
    const isLastScreen = index === totalScreens - 1;

    if (isLastScreen) {
      return (
        <OnboardingScreen3
          key={`screen-${index}`}
          {...screen}
          onComplete={handlers.handleComplete}
          onSkip={handlers.handleSkip}
        />
      );
    }

    if (index === 1) {
      return (
        <OnboardingScreen2
          key={`screen-${index}`}
          {...screen}
          onNext={handlers.handleNext}
          onSkip={handlers.handleSkip}
        />
      );
    }

    // デフォルトは最初の画面
    return (
      <OnboardingScreen1
        key={`screen-${index}`}
        {...screen}
        onNext={handlers.handleNext}
        onSkip={handlers.handleSkip}
      />
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1">
        {/* ページャー */}
        <OnboardingPager
          currentIndex={state.currentIndex}
          onIndexChange={handlers.handleIndexChange}
        >
          {screens.map((screen, index) => (
            <View key={index} style={{ flex: 1 }}>
              {renderScreen(screen, index)}
            </View>
          ))}
        </OnboardingPager>

        {/* ページインジケーター */}
        <View className="absolute bottom-20 left-0 right-0">
          <OnboardingIndicator
            totalScreens={totalScreens}
            currentIndex={state.currentIndex}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};
