import { useState, useEffect, lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Edit, Wand2, Settings } from "lucide-react";

// Lazy load heavy editor components
const VisualEditor = lazy(() => import("./VisualEditor"));
const InPlaceEditor = lazy(() => import("./InPlaceEditor"));
const EditHistoryManager = lazy(() => import("./EditHistoryManager"));
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface EditablePageWrapperProps {
  pageId: string;
  children: React.ReactNode;
  enableEdit?: boolean;
}

type EditorMode = "none" | "inplace" | "full";

const EditablePageWrapper = ({
  pageId,
  children,
  enableEdit = true,
}: EditablePageWrapperProps) => {
  const [editorMode, setEditorMode] = useState<EditorMode>("none");
  const [savedHtml, setSavedHtml] = useState<string>("");
  const [savedCss, setSavedCss] = useState<string>("");
  const [hasCustomContent, setHasCustomContent] = useState(false);
  const [inPlaceChanges, setInPlaceChanges] = useState<any[]>([]);
  const [showEditButton, setShowEditButton] = useState(false);

  useEffect(() => {
    // Load saved content from localStorage (full page builder) - only if edit mode is enabled
    if (!enableEdit) return;
    
    const storageKey = `page-content-${pageId}`;
    const saved = localStorage.getItem(storageKey);

    if (saved) {
      try {
        const { html, css } = JSON.parse(saved);
        setSavedHtml(html);
        setSavedCss(css);
        setHasCustomContent(true);
      } catch (error) {
        console.error("Error loading saved content:", error);
      }
    }
  }, [pageId, enableEdit]);

  // Separate effect for in-place changes - runs after DOM is ready
  useEffect(() => {
    if (!enableEdit) return;
    
    const inPlaceKey = `in-place-editor-changes-${pageId}`;
    const inPlaceSaved = localStorage.getItem(inPlaceKey);
    if (inPlaceSaved) {
      try {
        const changes = JSON.parse(inPlaceSaved);
        setInPlaceChanges(changes);
        applyInPlaceChanges(changes);
      } catch (error) {
        console.error("Error loading in-place changes:", error);
      }
    }
  }, [pageId, hasCustomContent, enableEdit]);

  // Editor trigger disabled - keeping files for future use
  // Listen for search query changes and check initial value
  // useEffect(() => {
  //   // Check initial search query from sessionStorage
  //   const initialQuery = sessionStorage.getItem("header-search-query") || "";
  //   setShowEditButton(initialQuery.toLowerCase().includes("edit"));

  //   const handleSearchChange = (e: Event) => {
  //     const customEvent = e as CustomEvent<{ query: string }>;
  //     const query = customEvent.detail.query.toLowerCase();
  //     setShowEditButton(query.includes("edit"));
  //   };

  //   window.addEventListener("search-query-changed", handleSearchChange);

  //   return () => {
  //     window.removeEventListener("search-query-changed", handleSearchChange);
  //   };
  // }, []);

  const applyInPlaceChanges = (changes: any[]) => {
    // Apply changes after a short delay to ensure DOM is ready
    setTimeout(() => {
      changes.forEach((change) => {
        let element: HTMLElement | null = null;

        // Strategy 1: Try to find by data-editor-id
        if (change.uniqueId) {
          element = document.querySelector(
            `[data-editor-id="${change.uniqueId}"]`,
          ) as HTMLElement;
        }

        // Strategy 2: If not found and uniqueId starts with "id-", try the actual ID
        if (!element && change.uniqueId?.startsWith("id-")) {
          const actualId = change.uniqueId.replace(/^id-/, "");
          element = document.getElementById(actualId);
        }

        // Strategy 3: Try to find by selector
        if (!element && change.selector) {
          element = document.querySelector(change.selector) as HTMLElement;
        }

        // Strategy 4: Try to find by matching tag, classes, and content
        if (!element && change.tagName && change.classes) {
          const candidates = document.querySelectorAll(
            `${change.tagName}.${change.classes.split(" ").join(".")}`,
          );
          if (candidates.length === 1) {
            element = candidates[0] as HTMLElement;
          }
        }

        // Apply changes if element was found
        if (element) {
          // Assign the data-editor-id so it can be found next time
          if (change.uniqueId && !element.getAttribute("data-editor-id")) {
            element.setAttribute("data-editor-id", change.uniqueId);
          }

          // Apply content changes
          if (change.content && change.content !== element.innerHTML) {
            element.innerHTML = change.content;
          }

          // Apply style changes
          if (change.styles) {
            element.style.cssText = change.styles;
          }
        } else {
          console.warn(
            `Could not find element to apply changes:`,
            change.uniqueId,
            change.selector,
          );
        }
      });
    }, 100);
  };

  const handleSaveFullEditor = (html: string, css: string) => {
    const storageKey = `page-content-${pageId}`;
    localStorage.setItem(storageKey, JSON.stringify({ html, css }));
    setSavedHtml(html);
    setSavedCss(css);
    setHasCustomContent(true);
    setEditorMode("none");

    // Show success message
    alert("Page saved successfully!");
  };

  const handleSaveInPlaceEditor = (changes: any[]) => {
    const inPlaceKey = `in-place-editor-changes-${pageId}`;
    localStorage.setItem(inPlaceKey, JSON.stringify(changes));
    setInPlaceChanges(changes);
    setEditorMode("none");

    // Apply changes immediately
    applyInPlaceChanges(changes);
  };

  const handleClose = () => {
    setEditorMode("none");
  };

  const handleReset = () => {
    if (
      confirm(
        "Are you sure you want to reset this page to default? This will remove both full page and in-place edits. This cannot be undone.",
      )
    ) {
      // Remove full page content
      const storageKey = `page-content-${pageId}`;
      localStorage.removeItem(storageKey);

      // Remove in-place changes
      const inPlaceKey = `in-place-editor-changes-${pageId}`;
      localStorage.removeItem(inPlaceKey);

      setSavedHtml("");
      setSavedCss("");
      setHasCustomContent(false);
      setInPlaceChanges([]);
      window.location.reload();
    }
  };

  const getInitialHtml = () => {
    if (savedHtml) return savedHtml;

    // Try to extract current page HTML
    const mainContent = document.querySelector("main");
    return (
      mainContent?.innerHTML || "<div>Start building your page here!</div>"
    );
  };

  // Full page builder mode
  if (editorMode === "full") {
    return (
      <Suspense fallback={<div className="flex items-center justify-center min-h-screen">Loading editor...</div>}>
        <VisualEditor
          initialHtml={getInitialHtml()}
          initialCss={savedCss}
          onSave={handleSaveFullEditor}
          onClose={handleClose}
        />
      </Suspense>
    );
  }

  // In-place editor mode
  if (editorMode === "inplace") {
    return (
      <div className="relative">
        <Suspense fallback={<div className="fixed top-4 right-4 bg-background p-4 rounded shadow">Loading editor...</div>}>
          <InPlaceEditor onSave={handleSaveInPlaceEditor} onClose={handleClose} />
        </Suspense>
        {hasCustomContent ? (
          <div>
            <style dangerouslySetInnerHTML={{ __html: savedCss }} />
            <div dangerouslySetInnerHTML={{ __html: savedHtml }} />
          </div>
        ) : (
          children
        )}
      </div>
    );
  }

  // Normal view with edit button
  return (
    <div className="relative">
      {/* Edit Button - Fixed position with dropdown */}
      {enableEdit && showEditButton && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                size="lg"
                className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg rounded-full w-14 h-14 p-0"
                title="Edit Page"
              >
                <Settings className="w-6 h-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem
                onClick={() => setEditorMode("inplace")}
                className="cursor-pointer"
              >
                <Wand2 className="w-4 h-4 mr-2" />
                <div>
                  <div className="font-medium">Quick Edit</div>
                  <div className="text-xs text-gray-500">
                    Edit text & styles in place
                  </div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setEditorMode("full")}
                className="cursor-pointer"
              >
                <Edit className="w-4 h-4 mr-2" />
                <div>
                  <div className="font-medium">Page Builder</div>
                  <div className="text-xs text-gray-500">
                    Rebuild page from scratch
                  </div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit History Manager */}
          <Suspense fallback={null}>
            <EditHistoryManager />
          </Suspense>

          {(hasCustomContent || inPlaceChanges.length > 0) && (
            <Button
              onClick={handleReset}
              size="sm"
              variant="outline"
              className="text-xs"
              title="Reset to Default"
            >
              Reset
            </Button>
          )}
        </div>
      )}

      {/* Render custom content or default children */}
      {hasCustomContent ? (
        <div>
          <style dangerouslySetInnerHTML={{ __html: savedCss }} />
          <div dangerouslySetInnerHTML={{ __html: savedHtml }} />
        </div>
      ) : (
        children
      )}
    </div>
  );
};

export default EditablePageWrapper;
