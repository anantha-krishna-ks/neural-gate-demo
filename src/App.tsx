
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ItemGenerator from "./pages/ItemGenerator";
import ItemGeneration from "./pages/ItemGeneration";
import QuestionGenerator from "./pages/QuestionGenerator";
import QuestionGenerationLoading from "./pages/QuestionGenerationLoading";
import QuestionResults from "./pages/QuestionResults";
import QuestionRepository from "./pages/QuestionRepository";
import Reports from "./pages/Reports";
import ManageUsers from "./pages/ManageUsers";
import NotFound from "./pages/NotFound";
import ItemSimilarity from "./pages/ItemSimilarity";
import ItemRewriter from "./pages/ItemRewriter";
import SpeechEvaluation from "./pages/SpeechEvaluation";
import ItemMetadata from "./pages/ItemMetadata";
import SessionTimeout from "./components/SessionTimeout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        {/* Global session timeout: 30 minutes of inactivity */}
        <SessionTimeout timeoutMs={1_800_000} />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/item-generator" element={<ItemGenerator />} />
          <Route path="/item-generation" element={<ItemGeneration />} />
          <Route path="/question-generator/:bookCode" element={<QuestionGenerator />} />
          <Route path="/question-generation-loading" element={<QuestionGenerationLoading />} />
          <Route path="/question-results" element={<QuestionResults />} />
          <Route path="/question-repository" element={<QuestionRepository />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/manage-users" element={<ManageUsers />} />
          <Route path="/item-similarity" element={<ItemSimilarity />} />
          <Route path="/item-rewriter" element={<ItemRewriter />} />
          <Route path="/item-metadata" element={<ItemMetadata />} />
          <Route path="/speech-evaluation" element={<SpeechEvaluation />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
