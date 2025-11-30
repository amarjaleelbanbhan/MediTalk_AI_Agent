import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Header from "./components/Header";

// Lazy load pages for better performance
const Home = lazy(() => import("./pages/Home"));
const EDA = lazy(() => import("./pages/EDA"));
const Cleaning = lazy(() => import("./pages/Cleaning"));
const FeatureEngineering = lazy(() => import("./pages/FeatureEngineering"));
const Modeling = lazy(() => import("./pages/Modeling"));
const Predictions = lazy(() => import("./pages/Predictions"));
const NotFound = lazy(() => import("./pages/NotFound"));

const LoadingSpinner = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
);

function Router() {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <Suspense fallback={<LoadingSpinner />}>
          <Switch>
            <Route path={"/"} component={Home} />
            <Route path={"/eda"} component={EDA} />
            <Route path={"/cleaning"} component={Cleaning} />
            <Route path={"/feature-engineering"} component={FeatureEngineering} />
            <Route path={"/modeling"} component={Modeling} />
            <Route path={"/predictions"} component={Predictions} />
            <Route path={"/404"} component={NotFound} />
            {/* Final fallback route */}
            <Route component={NotFound} />
          </Switch>
        </Suspense>
      </main>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
