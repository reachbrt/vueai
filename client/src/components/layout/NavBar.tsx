import { Link, useLocation } from "wouter";
import { VueAILogo } from "@/components/ui/icons";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Github, Download, MessageCircleCode } from "lucide-react";
import { useMobile } from "@/hooks/use-mobile";

export default function NavBar() {
  const [location] = useLocation();
  const isMobile = useMobile();

  const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
    const isActive = location === href;
    return (
      <Link href={href}>
        <a
          className={cn(
            "border-b-2 inline-flex items-center px-1 pt-1 text-sm font-medium",
            isActive
              ? "border-primary text-foreground"
              : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
          )}
        >
          {children}
        </a>
      </Link>
    );
  };

  return (
    <div className="bg-card border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center md:hidden">
              <VueAILogo className="h-8 w-8" />
              <span className="ml-2 text-lg font-semibold">VueAI</span>
            </div>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink href="/">Overview</NavLink>
              <NavLink href="/chatbot">Documentation</NavLink>
              <NavLink href="/autosuggest">Examples</NavLink>
              <NavLink href="/smartform">Playground</NavLink>
            </div>
          </div>
          <div className="flex items-center">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground p-2">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="ml-2 text-muted-foreground hover:text-foreground p-2">
              <MessageCircleCode className="h-5 w-5" />
            </a>
            
            {!isMobile && (
              <Button className="ml-4" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Install
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
