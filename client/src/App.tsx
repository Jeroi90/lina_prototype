import { useState, useCallback } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import MainFeed from "@/pages/MainFeed";
import SubjectSelect from "@/pages/SubjectSelect";
import ReviewEditor from "@/pages/ReviewEditor";
import ReviewDetail from "@/pages/ReviewDetail";
import BalanceGameDetail from "@/pages/BalanceGameDetail";
import BestFeed from "@/pages/BestFeed";
import MyPage from "@/pages/MyPage";
import MyReviews from "@/pages/MyReviews";
import PushSettings from "@/pages/PushSettings";
import ServicePolicy from "@/pages/ServicePolicy";
import Terms from "@/pages/Terms";
import { type FeedItem } from "@/lib/feedData";

type Screen = "feed" | "select" | "editor" | "detail" | "balance" | "bestfeed" | "mypage" | "myreviews" | "push" | "policy" | "terms";

function App() {
  const [screen, setScreen] = useState<Screen>("feed");
  const [editorType, setEditorType] = useState("claim");
  const [editorProduct, setEditorProduct] = useState<string | undefined>();
  const [detailItem, setDetailItem] = useState<FeedItem | null>(null);
  const [feedKey, setFeedKey] = useState(0);
  const [balanceCardIdx, setBalanceCardIdx] = useState(0);

  const goToFeed = useCallback(() => {
    setFeedKey((k) => k + 1);
    setScreen("feed");
  }, []);

  const goToSelect = useCallback(() => {
    setScreen("select");
  }, []);

  const goToEditor = useCallback((type: string, productName?: string) => {
    setEditorType(type);
    setEditorProduct(productName);
    setScreen("editor");
  }, []);

  const goToDetail = useCallback((item: FeedItem) => {
    setDetailItem(item);
    setScreen("detail");
  }, []);

  const goToBalanceGame = useCallback((idx: number) => {
    setBalanceCardIdx(idx);
    setScreen("balance");
  }, []);

  const goToBestFeed = useCallback(() => {
    setScreen("bestfeed");
  }, []);

  const goToMyPage = useCallback(() => {
    setScreen("mypage");
  }, []);

  const handleEditorSubmit = useCallback(() => {
    goToFeed();
  }, [goToFeed]);

  const handleBalanceFromSelect = useCallback(() => {
    setBalanceCardIdx(0);
    setScreen("balance");
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="bg-gray-100 flex justify-center min-h-screen font-sans text-gray-800">
          <div className="w-full max-w-[480px] bg-white shadow-2xl relative min-h-screen">
            <MainFeed
              key={feedKey}
              onWrite={goToSelect}
              onDetail={goToDetail}
              onBalanceGame={goToBalanceGame}
              onBestAll={goToBestFeed}
              onMyPage={goToMyPage}
            />

            {screen === "select" && (
              <SubjectSelect onClose={goToFeed} onSelect={goToEditor} onBalanceGame={handleBalanceFromSelect} />
            )}

            {screen === "editor" && (
              <ReviewEditor
                type={editorType}
                productName={editorProduct}
                onClose={() => setScreen("select")}
                onSubmit={handleEditorSubmit}
              />
            )}

            {screen === "detail" && detailItem && (
              <ReviewDetail item={detailItem} onBack={goToFeed} />
            )}

            {screen === "balance" && (
              <BalanceGameDetail initialCardIdx={balanceCardIdx} onBack={goToFeed} />
            )}

            {screen === "bestfeed" && (
              <BestFeed onBack={goToFeed} onDetail={goToDetail} />
            )}

            {screen === "mypage" && (
              <MyPage
                onBack={goToFeed}
                onMyReviews={() => setScreen("myreviews")}
                onPush={() => setScreen("push")}
                onPolicy={() => setScreen("policy")}
                onTerms={() => setScreen("terms")}
              />
            )}

            {screen === "myreviews" && (
              <MyReviews
                onBack={() => setScreen("mypage")}
                onDetail={goToDetail}
                onBalanceGame={goToBalanceGame}
              />
            )}

            {screen === "push" && (
              <PushSettings onBack={() => setScreen("mypage")} />
            )}

            {screen === "policy" && (
              <ServicePolicy onBack={() => setScreen("mypage")} />
            )}

            {screen === "terms" && (
              <Terms onBack={() => setScreen("mypage")} />
            )}
          </div>
        </div>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
