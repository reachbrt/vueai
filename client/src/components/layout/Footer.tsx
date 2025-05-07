import { Link } from "wouter";
import { Github, Twitter, Slack, Package } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-border pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4">Products</h3>
            <ul className="space-y-2">
              <li><Link href="/chatbot"><a className="text-sm text-foreground/60 hover:text-foreground">@vueai/chatbot</a></Link></li>
              <li><Link href="/autosuggest"><a className="text-sm text-foreground/60 hover:text-foreground">@vueai/autosuggest</a></Link></li>
              <li><Link href="/smartform"><a className="text-sm text-foreground/60 hover:text-foreground">@vueai/smartform</a></Link></li>
              <li><Link href="/"><a className="text-sm text-foreground/60 hover:text-foreground">@vueai/core</a></Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4">Resources</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Documentation</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Examples</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Playground</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Storybook</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4">Community</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">GitHub</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Discord</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Twitter</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Stack Overflow</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground tracking-wider uppercase mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">About</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Blog</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Careers</a></li>
              <li><a href="#" className="text-sm text-foreground/60 hover:text-foreground">Contact</a></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-8 border-t border-border pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Github className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Twitter className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Slack className="h-5 w-5" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <Package className="h-5 w-5" />
            </a>
          </div>
          <p className="mt-8 text-base text-muted-foreground md:mt-0 md:order-1">
            &copy; 2023 VueAI. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
