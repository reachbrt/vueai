import { Link, useLocation } from "wouter";
import { VueAILogo, ChatbotIcon, AutosuggestIcon, SmartFormIcon, CoreIcon } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Github } from "lucide-react";

interface SidebarProps {
  closeSidebar?: () => void;
}

export default function Sidebar({ closeSidebar }: SidebarProps) {
  const [location] = useLocation();

  const NavItem = ({
    href,
    icon: Icon,
    children,
  }: {
    href: string;
    icon: React.ComponentType<any>;
    children: React.ReactNode;
  }) => {
    const isActive = location === href;
    return (
      <Link href={href} onClick={closeSidebar}>
        <a
          className={cn(
            "flex items-center px-4 py-2 text-sm font-medium",
            isActive
              ? "text-primary bg-primary/10 border-l-4 border-primary"
              : "text-foreground/60 hover:bg-muted/50 border-l-4 border-transparent"
          )}
        >
          <Icon className={cn("mr-3", isActive ? "text-primary" : "text-muted-foreground")} />
          {children}
        </a>
      </Link>
    );
  };

  return (
    <div className="bg-sidebar h-full w-64 flex-shrink-0 border-r border-border flex flex-col">
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <VueAILogo className="h-8 w-8" />
          <span className="text-lg font-semibold">VueAI</span>
          <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 px-2 py-0.5 rounded-full">
            Beta
          </span>
        </div>
      </div>

      <div className="py-4 flex-1 overflow-auto">
        <div className="px-4 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Packages
        </div>
        <NavItem href="/chatbot" icon={ChatbotIcon}>
          @vueai/chatbot
        </NavItem>
        <NavItem href="/autosuggest" icon={AutosuggestIcon}>
          @vueai/autosuggest
        </NavItem>
        <NavItem href="/smartform" icon={SmartFormIcon}>
          @vueai/smartform
        </NavItem>
        <NavItem href="/" icon={CoreIcon}>
          @vueai/core
        </NavItem>

        <div className="px-4 mt-6 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Documentation
        </div>
        <NavItem href="/" icon={() => <span className="i-fas-book mr-3 text-muted-foreground"></span>}>
          Getting Started
        </NavItem>
        <NavItem href="/" icon={() => <span className="i-fas-code mr-3 text-muted-foreground"></span>}>
          API Reference
        </NavItem>
        <NavItem href="/" icon={() => <span className="i-fas-server mr-3 text-muted-foreground"></span>}>
          Configuration
        </NavItem>
      </div>

      <div className="border-t border-border p-4">
        <div className="flex items-center justify-between mb-2">
          <Button
            variant="outline"
            size="sm"
            className="w-full flex items-center justify-center gap-2"
            asChild
          >
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              <Github className="h-4 w-4" />
              <span>GitHub</span>
            </a>
          </Button>
        </div>
        <div className="text-xs text-muted-foreground">
          Version 1.0.0-beta
        </div>
      </div>
    </div>
  );
}
