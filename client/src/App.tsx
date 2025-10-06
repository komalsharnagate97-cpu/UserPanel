import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Login from "@/pages/login";
import Signup from "@/pages/signup";
import Layout from "@/components/layout";
import Dashboard from "@/pages/dashboard";
import Products from "@/pages/products";
import Referral from "@/pages/referral";
import Connect from "@/pages/connect";
import Notifications from "@/pages/notifications";
import FAQ from "@/pages/faq";
import Profile from "@/pages/profile";

function Router() {
  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/signup" component={Signup} />
      <Route path="/" component={() => (
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      <Route path="/dashboard" component={() => (
        <Layout>
          <Dashboard />
        </Layout>
      )} />
      <Route path="/products" component={() => (
        <Layout>
          <Products />
        </Layout>
      )} />
      <Route path="/referral" component={() => (
        <Layout>
          <Referral />
        </Layout>
      )} />
      <Route path="/connect" component={() => (
        <Layout>
          <Connect />
        </Layout>
      )} />
      <Route path="/notifications" component={() => (
        <Layout>
          <Notifications />
        </Layout>
      )} />
      <Route path="/faq" component={() => (
        <Layout>
          <FAQ />
        </Layout>
      )} />
      <Route path="/profile" component={() => (
        <Layout>
          <Profile />
        </Layout>
      )} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <div className="dark">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
