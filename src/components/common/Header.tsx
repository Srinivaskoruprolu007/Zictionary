import Link from 'next/link';
import { ThemeToggle } from '@/components/common/ThemeToggle';
import { Button } from '@/components/ui/button'; // Import Button
import { Archive, AlertTriangle, Home } from 'lucide-react'; // Import icons

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link href="/" className="flex items-center space-x-2 mr-6">
           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-primary">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/>
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
          </svg>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            Zictionary
          </span>
        </Link>

        {/* Navigation Links */}
        <nav className="flex items-center space-x-4 lg:space-x-6 flex-grow">
           <Link href="/" passHref legacyBehavior>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                 <Home className="mr-2 h-4 w-4" /> Home
              </Button>
            </Link>
            <Link href="/archive" passHref legacyBehavior>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                 <Archive className="mr-2 h-4 w-4" /> Archive
              </Button>
            </Link>
             <Link href="/boomer-traps" passHref legacyBehavior>
              <Button variant="ghost" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                 <AlertTriangle className="mr-2 h-4 w-4" /> Boomer Traps
              </Button>
            </Link>
        </nav>


        <div className="flex items-center space-x-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
