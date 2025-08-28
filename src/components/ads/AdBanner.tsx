import { View } from "react-native";
import { BannerAd, BannerAdSize } from "react-native-google-mobile-ads";
import { AdBannerLogicProps, useAdBanner } from "../../hooks/useAdBanner";

// コンポーネントのProps型定義
export interface AdBannerProps extends AdBannerLogicProps {}

export const AdBanner: React.FC<AdBannerProps> = (props) => {
  const { state, handlers } = useAdBanner(props);

  // エラー状態または未表示の場合は何も表示しない
  if (state.hasError || !state.isVisible) {
    return null;
  }

  return (
    <View>
      <BannerAd
        unitId={state.adUnitId}
        size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        onAdLoaded={handlers.handleAdLoaded}
        onAdFailedToLoad={handlers.handleAdFailedToLoad}
        onAdOpened={handlers.handleAdOpened}
        onAdClosed={handlers.handleAdClosed}
      />
    </View>
  );
};

export default AdBanner;
