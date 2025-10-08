
import { useState, useEffect } from "react"
import { Search, Sparkles, ArrowRight, BarChart, Clock, Star, Users, FileText, Brain, Database, BookOpen, RefreshCw, GitCompare, Image, MessageSquare, ScanLine, PenTool, BarChart3, Bot } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { AppSidebar } from "@/components/AppSidebar"
import { ProfileDropdown } from "@/components/ProfileDropdown"
import { Link, useNavigate } from "react-router-dom"

// Import tool images
import itemGenerationImage from "@/assets/item-generation.png"
import itemWriterImage from "@/assets/item-writer.png"
import itemMetadataImage from "@/assets/item-metadata.png"
import courseGeneratorImage from "@/assets/course-generator.png"
import itemRewriterImage from "@/assets/item-rewriter.png"
import itemSimilarityImage from "@/assets/item-similarity.png"
import docChatImage from "@/assets/doc-chat-ncert.png"
import ocrImage from "@/assets/ocr.png"
import comingSoonImage from "@/assets/coming-soon.png"
import { AppDetail, getAppDetails, subscribeToApp } from "@/api";
import { PageLoader } from "@/components/ui/loader";

// Extend the Window interface to include showToast (if it exists)
declare global {
  interface Window {
    showToast?: (message: string, type?: string) => void;
    toast?: (message: string, options?: { type?: string }) => void;
  }
}




const Dashboard = () => {
  // Filter: "All", "Active Subscription", "Yet to Approve"
  const [activeTab, setActiveTab] = useState("All")
  const [subscriptionFilter, setSubscriptionFilter] = useState("All");
  const navigate = useNavigate();
  // Store user info in state so it updates if localStorage changes
  const [userInfo, setUserInfo] = useState(() => {
    return JSON.parse(sessionStorage.getItem("userInfo") || "{}")
  });
  const customerCode = userInfo.customerCode || "";
  const orgCode = userInfo.orgCode || "";
  const userCode = userInfo.userCode || "";
  const userRole = userInfo.userRole || "";
  const username = userInfo.username || "";

  const [apps, setApps] = useState<AppDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Listen for localStorage changes 
  useEffect(() => {
    const handleStorage = () => {
      const latestUserInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}")
      setUserInfo(latestUserInfo);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Always re-fetch when userCode/orgCode change
  useEffect(() => {
    // Defensive: re-read userInfo from localStorage in case it changed
    const latestUserInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}")
    setUserInfo(latestUserInfo);
    const _userCode = latestUserInfo.userCode || "";
    const _orgCode = latestUserInfo.orgCode || "";
    if (!_userCode || !_orgCode) {
      setApps([]);
      setError("User not logged in or missing codes");
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    getAppDetails(_userCode, _orgCode, 1)
      .then((data) => {
        console.log("API raw response:", data);
        setApps(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        setError((err && err.message) || "Failed to load apps");
        setApps([]);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [userInfo.userCode, userInfo.orgCode]);

  const tabs = [
    "All", "AI Generation", "Content Creation", "Education",
    "Assessment", "Analytics", "AI Tools", "AI Interaction"
  ]

  const getIconForTool = (toolId: string) => {
    const iconMap = {
      "IG": Brain,
      "ACCA_IG": PenTool,
      "IM": Database,
      "ACCA_CG": BookOpen,
      "IR": RefreshCw,
      "IS": GitCompare,
      "course-generator-2": BookOpen,
      "scenario-and": FileText,
      "doc-chat-ncert": MessageSquare,
      "doc-chat-moby": MessageSquare,
      "OCR": ScanLine,
      "EEZS": BarChart3,
      "EEV": BarChart3,
      "TF": BarChart,
      "Stdif": Image,
      "AIP": Bot
    }
    return iconMap[toolId] || Sparkles
  }

  // Map appCode to image
  const getImageForTool = (appCode: string) => {
    const imageMap: Record<string, string> = {
      "IG": itemGenerationImage,
      "ACCA_IG": itemWriterImage,
      "IM": itemMetadataImage,
      "ACCA_CG": courseGeneratorImage,
      "IR": itemRewriterImage,
      "IS": itemSimilarityImage,
      "CG": docChatImage,
      "OCR": ocrImage,
      // "GG": GlossaryGenerator,
      // "CD": ContentDetector,
      // "DS": DocumentScanner,
      // "SE": SpeechEvaluation,
      // "AIP": AIPersona,
      // "Stdif": ImageGenerator,
      // "TF": TestForensics,
      // "EEZS": EssayEvaluationZeroShot,
      // "EEV": EssayEvaluationFineTuned,
      // Add more mappings as needed
    };
    return imageMap[appCode] || comingSoonImage;
  };

  const getCategoryForTool = (appCode: string) => {
    const categoryMap: Record<string, string> = {
      "IG": "AI Generation",
      "ACCA_IG": "Content Creation",
      "IM": "Metadata",
      "ACCA_CG": "Course Generation",
      "IR": "Item Rewriter",
      "IS": "Item Similarity",
      "CG": "Doc Chat",
      "OCR": "OCR",
      "GG": "Glossary Generator",
      "CD": "Content Detector",
      "DS": "Document Scanner",
      "SE": "Speech evaluation",
      "AIP": "AI Persona",
      "Stdif": "Image Generator",
      "TF": "Test Forensics",
      "EEZS": "Essay Evaluation - Zero shot",
      "EEV": "Essay Evaluation - Fine tuned",
      // Add more mappings as needed
    };
    return categoryMap[appCode] || "Unknown Category";
  };

  // Map appCode to route path
  const getPathForTool = (appCode: string) => {
    const pathMap: Record<string, string> = {
      // Existing known routes
      "IG": "/item-generation",
      "IR": "/item-rewriter",
      "IM": "/item-metadata",
      // New Item Similarity route
      "IS": "/item-similarity",
      // Speech Evaluation route
      "SE": "/speech-evaluation",
      // Add more mappings as needed
    };
    return pathMap[appCode] || "/item-generation"; // fallback
  };

  // Use apps from API if available, otherwise fallback to static list
  const aiTools = Array.isArray(apps) ? apps.map(app => {
    // Updated subscription logic:
    // isSubscribed === 0: Subscribed (green, disabled)
    // isSubscribed === 1: Waiting for Approval (yellow, disabled)
    // isSubscribed === 2: Launch App (blue, enabled)
    // else: Subscribe (gray, disabled)
    let badge = "Subscribe";
    let badgeColor = "bg-gray-400";
    let buttonLabel = "Subscribe";
    let buttonColor = "bg-gray-400 hover:bg-gray-400 cursor-not-allowed";
    let buttonDisabled = false;
    if (app.isSubscribed === 0) {
      badge = "Subscribe";
      badgeColor = "bg-green-500";
      buttonLabel = "Subscribe";
      buttonColor = "bg-green-500 hover:bg-green-600";
      buttonDisabled = false;
    } else if (app.isSubscribed === 1) {
      badge = "Waiting for Approval";
      badgeColor = "bg-yellow-500";
      buttonLabel = "Waiting for Approval";
      buttonColor = "bg-yellow-500 hover:bg-yellow-500 cursor-not-allowed";
      buttonDisabled = true;
    } else if (app.isSubscribed === 2) {
      badge = "Launch App";
      badgeColor = "bg-blue-500";
      buttonLabel = "Launch App";
      buttonColor = "bg-blue-600 hover:bg-blue-700";
      buttonDisabled = false;
    }
    return {
      id: app.appCode || app.appID?.toString() || "default-id",
      title: app.applicationName || "Untitled App",
      description: app.appDescription || "No description available.",
      path: getPathForTool((app.appCode || "").toString()), // Route based on appCode
      image: getImageForTool((app.appCode || "").toString()),
      category: getCategoryForTool((app.appCode || "").toString()),
      badge,
      badgeColor,
      buttonLabel,
      buttonColor,
      buttonDisabled,
      icon: getIconForTool((app.appCode || app.appID?.toString() || "").toString()),
      isSubscribed: app.isSubscribed
    };
  }) : [];

  // Subscription filter logic
  let filteredTools = aiTools;
  if (subscriptionFilter === "Active Subscription") {
    filteredTools = filteredTools.filter(tool => tool.isSubscribed === 2);
  } else if (subscriptionFilter === "Yet to Approve") {
    filteredTools = filteredTools.filter(tool => tool.isSubscribed === 1);
  }
  // Category filter logic
  filteredTools = activeTab === "All" ? filteredTools : filteredTools.filter(tool => tool.category === activeTab);

  // Debug: Log ItemRewriter tool status
  useEffect(() => {
  
    const itemRewriterTool = aiTools.find(tool => tool.id === "IR");
    console.log('ItemRewriter Tool Status:', {
      exists: !!itemRewriterTool,
      status: itemRewriterTool?.isSubscribed,
      path: itemRewriterTool?.path,
      buttonLabel: itemRewriterTool?.buttonLabel
    });
  }, [aiTools]);

  return (
    <div className="min-h-screen bg-gray-50">
      <AppSidebar />
      <div className="ml-0 lg:ml-52 min-h-screen flex flex-col">
        {loading && (
          <PageLoader text="Loading tools..." />
        )}
        {error && (
          <div className="flex justify-center items-center h-40 text-lg text-red-600">{error}</div>
        )}
        {/* Only render dashboard if not loading and no error */}
        {!loading && !error && (
          <>
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
              <div className="flex h-16 items-center justify-between px-6">
                <div className="flex items-center gap-4">
                  <div>
                    <h1 className="text-lg font-bold text-gray-900">Welcome Back, {userInfo.username ? userInfo.username : "User"}!</h1>
                    {/* You can display more user info here if needed */}
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">

                  </div>
                  <div className="relative hidden md:block">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search AI tools..."
                      className="pl-10 w-60 lg:w-80 border-gray-200"
                    />
                  </div>
                  <ProfileDropdown />
                </div>
              </div>
            </header>
            {/* Page Title */}
            <div className="p-6 pb-4">
              <h1 className="text-2xl font-bold text-gray-900 mb-2">AI Tools Dashboard</h1>
              <p className="text-gray-600">Explore our comprehensive suite of AI-powered educational tools</p>
            </div>
            {/* Subscription Filter Buttons */}
            <div className="flex gap-4 mb-4 p-6 pb-4">
              <Button
                variant={subscriptionFilter === "All" ? "default" : "outline"}
                onClick={() => setSubscriptionFilter("All")}
                className={`px-4 py-2 rounded-lg text-sm ${subscriptionFilter === "All" ? "bg-blue-600 text-white" : "bg-white text-gray-700 border-gray-200"}`}
              >
                All
              </Button>
              <Button
                variant={subscriptionFilter === "Active Subscription" ? "default" : "outline"}
                onClick={() => setSubscriptionFilter("Active Subscription")}
                className={`px-4 py-2 rounded-lg text-sm ${subscriptionFilter === "Active Subscription" ? "bg-green-600 text-white" : "bg-white text-gray-700 border-gray-200"}`}
              >
                Active Subscription
              </Button>
              <Button
                variant={subscriptionFilter === "Yet to Approve" ? "default" : "outline"}
                onClick={() => setSubscriptionFilter("Yet to Approve")}
                className={`px-4 py-2 rounded-lg text-sm ${subscriptionFilter === "Yet to Approve" ? "bg-yellow-500 text-white" : "bg-white text-gray-700 border-gray-200"}`}
              >
                Yet to Approve
              </Button>
            </div>
            {/* Stats Cards */}
            <div className="px-6 pb-6">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="p-6 bg-blue-50 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Sparkles className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium text-gray-700">Available Tools</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{aiTools.length}</div>
                  <div className="text-sm font-medium text-blue-600">AI-Powered Solutions</div>
                </Card>
                <Card className="p-6 bg-green-50 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Star className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="font-medium text-gray-700">Active Access</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{aiTools.filter(t => t.badge === "").length}</div>
                  <div className="text-sm font-medium text-green-600">Tools Subscribed</div>
                </Card>
                <Card className="p-6 bg-purple-50 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                    </div>
                    <span className="font-medium text-gray-700">Explore More</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{aiTools.length - aiTools.filter(t => t.badge === "Subscribe").length}</div>
                  <div className="text-sm font-medium text-purple-600">Advanced Features</div>
                </Card>
                <Card className="p-6 bg-orange-50 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                      <Clock className="h-4 w-4 text-orange-600" />
                    </div>
                    <span className="font-medium text-gray-700">Today's Usage</span>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">847</div>
                  <div className="text-sm font-medium text-orange-600">Tokens Generated</div>
                </Card>
              </div>
            </div>
            {/* Main Content */}
            <main className="flex-1 px-6 pb-6">
              {/* Filter Tabs */}
              <div className="flex gap-2 mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <Button
                    key={tab}
                    variant={activeTab === tab ? "default" : "outline"}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-lg whitespace-nowrap text-sm transition-all ${activeTab === tab
                        ? "bg-blue-600 hover:bg-blue-700 text-white shadow-sm"
                        : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50 hover:border-blue-300"
                      }`}
                  >
                    {tab}
                  </Button>
                ))}
              </div>
              {/* AI Tools Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredTools.map((tool) => {
                  const IconComponent = tool.icon;
                  return (
                    <Card key={tool.id} className="group bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-1">
                      <div className="relative">
                        <img
                          src={tool.image}
                          alt={tool.title}
                          className="w-full h-40 object-cover rounded-t-lg"
                        />
                        {/* Tool Icon Overlay */}
                        <div className="absolute top-3 left-3 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-lg flex items-center justify-center shadow-sm">
                          <IconComponent className="h-4 w-4 text-gray-700" />
                        </div>
                        {tool.badge && (
                          <div className={`absolute top-3 right-3 px-2 py-1 rounded-md text-xs text-white font-medium ${tool.badgeColor} shadow-sm`}>
                            {tool.badge}
                          </div>
                        )}
                        <div className="absolute bottom-3 right-3 px-2 py-1 rounded-md text-xs font-medium text-gray-700 bg-white/90 backdrop-blur-sm shadow-sm">
                          {tool.category}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">{tool.title}</h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{tool.description}</p>
                        <Button
                          className={`w-full text-white transition-all duration-200 hover:scale-[1.02] ${tool.buttonColor}`}
                          size="sm"
                          disabled={tool.isSubscribed === 1}
                          onClick={async () => {
                            if (tool.isSubscribed === 0) {
                              // Get user info from localStorage
                              const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
                              const usercode = userInfo.userCode || "";
                              const orgcode = userInfo.orgCode || "";
                              const appcode = tool.id;
                              try {
                                const result = await subscribeToApp(usercode, orgcode, appcode);
                                if (result.success) {
                                  // Show modal or toast as per image, then refresh on OK
                                  if (window?.toast) {
                                    window.toast("Thank you for subscribing. Your subscription will be active after super admin approval.", { type: "success" });
                                    setTimeout(() => window.location.reload());
                                  } else if (window?.showToast) {
                                    window.showToast("Thank you for subscribing. Your subscription will be active after super admin approval.", "success");
                                    setTimeout(() => window.location.reload());
                                  } else {
                                    alert("Thank you for subscribing. Your subscription will be active after super admin approval.");
                                    window.location.reload();
                                  }
                                } else {
                                  if (window?.toast) {
                                    window.toast(result.message || "Subscription failed.", { type: "error" });
                                  } else if (window?.showToast) {
                                    window.showToast(result.message || "Subscription failed.", "error");
                                  } else {
                                    alert(result.message || "Subscription failed.");
                                  }
                                }
                              } catch (err) {
                                if (window?.toast) {
                                  window.toast("Subscription failed.", { type: "error" });
                                } else if (window?.showToast) {
                                  window.showToast("Subscription failed.", "error");
                                } else {
                                  alert("Subscription failed.");
                                }
                              }
                              return;
                            } else if (tool.isSubscribed === 1) {
                              if (window?.toast) {
                                window.toast("Your subscription request is pending approval.", { type: "info" });
                              } else if (window?.showToast) {
                                window.showToast("Your subscription request is pending approval.", "info");
                              } else {
                                alert("Your subscription request is pending approval.");
                              }
                              return;
                            } else if (tool.isSubscribed === 2) {
                              navigate(tool.path);
                              return;
                            } else {
                              if (window?.toast) {
                                window.toast("Please contact your administrator to subscribe to this app.", { type: "info" });
                              } else if (window?.showToast) {
                                window.showToast("Please contact your administrator to subscribe to this app.", "info");
                              } else {
                                alert("Please contact your administrator to subscribe to this app.");
                              }
                              return;
                            }
                          }}
                        >
                          <Sparkles className="h-4 w-4 mr-2" />
                          {tool.buttonLabel}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
              {/* Footer */}
              <footer className="mt-12 pt-8 border-t border-gray-200 text-center">
                <p className="text-sm text-gray-500">
                  © 2025 Excelsoftt Technologies Ltd. All rights reserved. |
                  <span className="ml-2">Help Center</span> |
                  <span className="ml-2">Privacy Policy</span> |
                  <span className="ml-2">Terms of Service</span> |
                  <span className="ml-4">Version 1.0.0</span> |
                  <span className="ml-2 flex items-center gap-1">Powered by
                    <img
                      src="/lovable-uploads/b5b0f5a8-9552-4635-8c44-d5e6f994179c.png"
                      alt="AI-Levate"
                      className="h-4 w-auto"
                    />
                  </span>
                </p>
              </footer>
            </main>
          </>
        )}
      </div>
    </div>
  );
}

export default Dashboard

