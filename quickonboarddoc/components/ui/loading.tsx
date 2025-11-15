import { Ghost } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative">
        <Ghost className="w-8 h-8 text-primary animate-bounce" />
        <div className="absolute inset-0 animate-ping">
          <Ghost className="w-8 h-8 text-primary opacity-20" />
        </div>
      </div>
    </div>
  );
}

export function LoadingPage({ message = "Loading..." }: { message?: string } = {}) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center space-y-4">
        <div className="relative inline-block">
          <Ghost className="w-16 h-16 text-primary animate-float" />
          <div className="absolute inset-0 animate-ping">
            <Ghost className="w-16 h-16 text-primary opacity-20" />
          </div>
        </div>
        <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      </div>
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export function LoadingCard({ message = "Loading..." }: { message?: string } = {}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Ghost className="w-12 h-12 text-primary animate-float" />
        <div className="absolute inset-0 animate-ping">
          <Ghost className="w-12 h-12 text-primary opacity-20" />
        </div>
      </div>
      <p className="text-sm text-muted-foreground animate-pulse">{message}</p>
      <style jsx>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        .animate-float {
          animation: float 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1">
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce" />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-100" />
      <div className="w-2 h-2 rounded-full bg-primary animate-bounce delay-200" />
    </div>
  );
}

export function LoadingButton({ children }: { children: React.ReactNode }) {
  return (
    <span className="flex items-center gap-2">
      <Ghost className="w-4 h-4 animate-bounce" />
      {children}
    </span>
  );
}
