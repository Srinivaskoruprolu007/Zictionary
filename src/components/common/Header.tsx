import React, { useState } from "react"; // Import useState
import Link from "next/link";
import Image from "next/image"; // Import Image component
import { ThemeToggle } from "@/components/common/ThemeToggle";
import { Button } from "@/components/ui/button"; // Import Button
import { Archive, AlertTriangle, Home, Menu, X } from "lucide-react"; // Import icons

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center justify-between">
        <Link
          href="/"
          className="flex items-center space-x-2 mr-6"
          onClick={closeMobileMenu}
        >
          {/* Replace SVG with Image component */}
          <Image
            src="/logo.jpg"
            alt="Zictionary Logo"
            width={32}
            height={32}
            className="h-8 w-8"
          />
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-accent text-transparent bg-clip-text">
            Zictionary
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-grow">
          <Link href="/">
            <Button
              variant="ghost"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Home className="mr-2 h-4 w-4" /> Home
            </Button>
          </Link>
          <Link href="/archive">
            <Button
              variant="ghost"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <Archive className="mr-2 h-4 w-4" /> Archive
            </Button>
          </Link>
          <Link href="/boomer-traps">
            <Button
              variant="ghost"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <AlertTriangle className="mr-2 h-4 w-4" /> Boomer Traps
            </Button>
          </Link>
        </nav>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-background border-b border-border/40 shadow-md">
          <nav className="flex flex-col space-y-1 px-4 py-4">
            <Link href="/" onClick={closeMobileMenu}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Home className="mr-2 h-4 w-4" /> Home
              </Button>
            </Link>
            <Link href="/archive" onClick={closeMobileMenu}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Archive className="mr-2 h-4 w-4" /> Archive
              </Button>
            </Link>
            <Link href="/boomer-traps" onClick={closeMobileMenu}>
              <Button
                variant="ghost"
                className="w-full justify-start text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <AlertTriangle className="mr-2 h-4 w-4" /> Boomer Traps
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
