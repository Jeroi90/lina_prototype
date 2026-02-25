import { useState, useCallback } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Switch, Route, useLocation } from "wouter";
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
import NotFound from "@/pages/not-found";
import { type FeedItem } from "@/lib/feedData";

function AppRouter() {
  const [, setLocation] = useLocation();
  const [editorType, setEditorType] = useState("claim");
  const [editorProduct, setEditorProduct] = useState<string | undefined>();
  const [feedKey, setFeedKey] = useState(0);
  const [balanceCardIdx, setBalanceCardIdx] = useState(0);

  const goToFeed = useCallback(() => {
    setFeedKey((k) => k + 1);
    setLocation("/");
  }, [setLocation]);

  const goToSelect = useCallback(() => {
    setLocation("/select");
  }, [setLocation]);

  const goToEditor = useCallback((type: string, productName?: string) => {
    setEditorType(type);
    setEditorProduct(productName);
    setLocation("/editor");
  }, [setLocation]);

  const goToDetail = useCallback((item: FeedItem) => {
    setLocation(`/detail/${item.id}`);
  }, [setLocation]);

  const goToBalanceGame = useCallback((idx: number) => {
    setBalanceCardIdx(idx);
    setLocation("/balance");
  }, [setLocation]);

  const goToBestFeed = useCallback(() => {
    setLocation("/best");
  }, [setLocation]);

  const goToMyPage = useCallback(() => {
    setLocation("/mypage");
  }, [setLocation]);

  const handleEditorSubmit = useCallback(() => {
    goToFeed();
  }, [goToFeed]);

  const handleBalanceFromSelect = useCallback(() => {
    setBalanceCardIdx(0);
    setLocation("/balance");
  }, [setLocation]);

  return (
    <div className="bg-gray-100 flex justify-center min-h-screen font-sans text-gray-800">
      <div className="w-full max-w-[480px] bg-white shadow-2xl relative min-h-screen">
        <Switch>
          <Route path="/">
            <MainFeed
              key={feedKey}
              onWrite={goToSelect}
              onDetail={goToDetail}
              onBalanceGame={goToBalanceGame}
              onBestAll={goToBestFeed}
              onMyPage={goToMyPage}
            />
          </Route>

          <Route path="/select">
            <SubjectSelect onClose={goToFeed} onSelect={goToEditor} onBalanceGame={handleBalanceFromSelect} />
          </Route>

          <Route path="/editor">
            <ReviewEditor
              type={editorType}
              productName={editorProduct}
              onClose={() => setLocation("/select")}
              onSubmit={handleEditorSubmit}
            />
          </Route>

          <Route path="/detail/:id">
            {(params) => (
              <ReviewDetail itemId={parseInt(params.id)} onBack={goToFeed} />
            )}
          </Route>

          <Route path="/balance">
            <BalanceGameDetail initialCardIdx={balanceCardIdx} onBack={goToFeed} />
          </Route>

          <Route path="/best">
            <BestFeed onBack={goToFeed} onDetail={goToDetail} />
          </Route>

          <Route path="/mypage">
            <MyPage
              onBack={goToFeed}
              onMyReviews={() => setLocation("/myreviews")}
              onPush={() => setLocation("/push")}
              onPolicy={() => setLocation("/policy")}
              onTerms={() => setLocation("/terms")}
            />
          </Route>

          <Route path="/myreviews">
            <MyReviews
              onBack={() => setLocation("/mypage")}
              onDetail={goToDetail}
              onBalanceGame={goToBalanceGame}
            />
          </Route>

          <Route path="/push">
            <PushSettings onBack={() => setLocation("/mypage")} />
          </Route>

          <Route path="/policy">
            <ServicePolicy onBack={() => setLocation("/mypage")} />
          </Route>

          <Route path="/terms">
            <Terms onBack={() => setLocation("/mypage")} />
          </Route>

          <Route>
            <NotFound />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRouter />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
