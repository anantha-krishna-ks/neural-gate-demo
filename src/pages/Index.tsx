import { LoginForm } from "@/components/LoginForm";

const Index = () => {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Gradient Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{ background: 'var(--gradient-glow)' }}
      />
      
      {/* Animated Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-pulse delay-1000" />
      
      {/* Login Form */}
      <div className="relative z-10">
        <LoginForm />
      </div>
    </main>
  );
};

export default Index;
