import { createContext, useState } from "react";

export interface LayoutContextType {
  displayHeader?: boolean;
  displayNavigation?: boolean;
  displaySearchBar?: boolean;
  showHeader: () => void;
  showNavigation: () => void;
  showSearchBar: () => void;
  hideNavigation: () => void;
  hideSearchBar: () => void;
  hideHeader: () => void;
  showHeaderAndNav: () => void;
}
export const LayoutContext = createContext<LayoutContextType>({
  displayHeader: true,
  displayNavigation: true,
  displaySearchBar: true,
  showHeader: () => ({}),
  showHeaderAndNav: () => ({}),
  showNavigation: () => ({}),
  showSearchBar: () => ({}),
  hideNavigation: () => ({}),
  hideSearchBar: () => ({}),
  hideHeader: () => ({}),
});

interface LayoutProviderProps {
  children?: React.ReactNode;
}

export const LayoutProvider = ({ children }: LayoutProviderProps) => {
  const [displayHeader, setDisplayHeader] = useState<boolean>(true);
  const [displayNavigation, setDisplayNavigation] = useState<boolean>(true);
  const [displaySearchBar, setDisplaySearchBar] = useState<boolean>(true);

  function showHeader() {
    setDisplayHeader(true);
  }
  function hideHeader() {
    setDisplayHeader(false);
  }

  function showHeaderAndNav() {
    setDisplayHeader(true);
    setDisplayNavigation(true);
  }
  function showNavigation() {
    setDisplayNavigation(true);
  }

  function showSearchBar() {
    setDisplaySearchBar(true);
  }

  function hideNavigation() {
    setDisplayNavigation(false);
  }

  function hideSearchBar() {
    setDisplaySearchBar(false);
  }

  return (
    <LayoutContext.Provider
      value={{
        displayNavigation,
        displaySearchBar,
        showNavigation,
        showSearchBar,
        hideNavigation,
        hideSearchBar,
        showHeader,
        hideHeader,
        showHeaderAndNav,
        displayHeader,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
};
