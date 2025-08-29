import { useState } from "react";
import { handleNavigationError } from "../utils/navigationHelpers";
import { useOnboarding } from "./useOnboarding";

export interface OnboardingContainerLogicProps {
  onComplete?: () => void;
  onSkip?: () => void;
  screens: Array<{
    title: string;
    subtitle: string;
    description: string;
    iconName: string;
    iconColor: string;
    backgroundColor: string;
    textColor: string;
  }>;
}

export interface OnboardingContainerState {
  currentIndex: number;
}

export interface OnboardingContainerHandlers {
  handleNext: () => void;
  handleSkip: () => void;
  handleComplete: () => void;
  handleIndexChange: (index: number) => void;
  renderScreen: (screen: any, index: number) => React.ReactNode;
}

/**
 * OnboardingContainerコンポーネントのロジックを管理するカスタムフック
 */
export const useOnboardingContainer = ({
  onComplete,
  onSkip,
  screens,
}: OnboardingContainerLogicProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const { completeOnboardingWithNavigation } = useOnboarding();
  const totalScreens = screens.length;

  const handleNext = () => {
    if (currentIndex < totalScreens - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleSkip = async () => {
    try {
      // オンボーディング完了と認証画面への遷移を統合実行
      await completeOnboardingWithNavigation();
      if (onSkip) {
        onSkip();
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      handleNavigationError(error);
    }
  };

  const handleComplete = async () => {
    try {
      // オンボーディング完了と認証画面への遷移を統合実行
      await completeOnboardingWithNavigation();
      if (onComplete) {
        onComplete();
      }
    } catch (error) {
      console.error("Failed to complete onboarding:", error);
      handleNavigationError(error);
    }
  };

  const handleIndexChange = (index: number) => {
    setCurrentIndex(index);
  };

  const renderScreen = (screen: any, index: number) => {
    // この関数はUIコンポーネント側で実装するため、ここではnullを返却
    // 実際のレンダリングはUIコンポーネント側で行う
    return null;
  };

  const state: OnboardingContainerState = {
    currentIndex,
  };

  const handlers: OnboardingContainerHandlers = {
    handleNext,
    handleSkip,
    handleComplete,
    handleIndexChange,
    renderScreen,
  };

  return {
    state,
    handlers,
    totalScreens,
    screens,
  };
};
