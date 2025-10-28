import { useState, useEffect, useRef, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Save,
  X,
  Type,
  Move,
  Trash2,
  Copy,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Italic,
  Underline,
  RotateCcw,
  History,
} from "lucide-react";
import EditHistoryManager from "./EditHistoryManager";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Moveable from "react-moveable";

interface InPlaceEditorProps {
  onSave?: (changes: any) => void;
  onClose?: () => void;
}

interface ElementChange {
  uniqueId: string;
  content: string;
  styles: string;
  originalContent: string;
  originalStyles: string;
}

const InPlaceEditor = ({ onSave, onClose }: InPlaceEditorProps) => {
  const [isActive, setIsActive] = useState(false);
  const [selectedElement, setSelectedElement] = useState<HTMLElement | null>(
    null,
  );
  const [hoveredElement, setHoveredElement] = useState<HTMLElement | null>(
    null,
  );
  const [elementStyles, setElementStyles] = useState<any>({});
  const [changes, setChanges] = useState<Map<string, ElementChange>>(new Map());
  const [isDragging, setIsDragging] = useState(false);
  const [hiddenElements, setHiddenElements] = useState<Set<string>>(new Set());
  const [lockedElements, setLockedElements] = useState<Set<string>>(new Set());
  const moveableRef = useRef<any>(null);
  const editorIdCounter = useRef(0);

  // Editable element selectors
  const editableSelectors = [
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "p",
    "span",
    "a",
    "button",
    "div",
    "section",
    "article",
    "li",
    "td",
    "th",
    "label",
    "img",
  ].join(",");

  // Get or assign unique ID to element
  const getUniqueId = (element: HTMLElement): string => {
    // First, check if element already has data-editor-id
    let uniqueId = element.getAttribute("data-editor-id");
    if (uniqueId) {
      return uniqueId;
    }

    // Try to use existing id attribute
    if (element.id) {
      uniqueId = `id-${element.id}`;
      element.setAttribute("data-editor-id", uniqueId);
      return uniqueId;
    }

    // Create stable ID based on element path and content
    const tagName = element.tagName.toLowerCase();
    const classes = Array.from(element.classList).slice(0, 2).join("-");
    const textContent =
      element.textContent?.slice(0, 20).replace(/\s+/g, "-") || "";
    const parent = element.parentElement;
    const siblings = parent ? Array.from(parent.children) : [];
    const index = siblings.indexOf(element);

    // Create a more stable identifier
    if (classes) {
      uniqueId = `${tagName}-${classes}-${index}`;
    } else if (textContent) {
      uniqueId = `${tagName}-${textContent}-${index}`;
    } else {
      uniqueId = `${tagName}-${index}-${editorIdCounter.current++}`;
    }

    // Clean up the ID to make it valid
    uniqueId = uniqueId.replace(/[^a-zA-Z0-9-_]/g, "-").replace(/-+/g, "-");

    element.setAttribute("data-editor-id", uniqueId);
    return uniqueId;
  };

  // Get element by unique ID
  const getElementByUniqueId = (uniqueId: string): HTMLElement | null => {
    return document.querySelector(
      `[data-editor-id="${uniqueId}"]`,
    ) as HTMLElement;
  };

  useEffect(() => {
    if (isActive) {
      document.body.style.userSelect = "none";

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;

        // Don't select if clicking on editor controls
        if (
          target.closest(".in-place-editor-controls") ||
          target.closest(".in-place-editor-panel") ||
          target.closest(".moveable-control")
        ) {
          return;
        }

        // Check if element is editable
        if (
          target.matches(editableSelectors) ||
          target.closest(editableSelectors)
        ) {
          e.preventDefault();
          e.stopPropagation();
          const element = target.matches(editableSelectors)
            ? target
            : (target.closest(editableSelectors) as HTMLElement);

          const uniqueId = getUniqueId(element);
          if (!lockedElements.has(uniqueId)) {
            selectElement(element);
          }
        }
      };

      const handleMouseMove = (e: MouseEvent) => {
        if (selectedElement || isDragging) return;

        const target = e.target as HTMLElement;

        if (
          target.closest(".in-place-editor-controls") ||
          target.closest(".in-place-editor-panel") ||
          target.closest(".moveable-control")
        ) {
          setHoveredElement(null);
          return;
        }

        if (
          target.matches(editableSelectors) ||
          target.closest(editableSelectors)
        ) {
          const element = target.matches(editableSelectors)
            ? target
            : (target.closest(editableSelectors) as HTMLElement);
          if (element !== hoveredElement) {
            setHoveredElement(element);
          }
        } else {
          setHoveredElement(null);
        }
      };

      document.addEventListener("click", handleClick, true);
      document.addEventListener("mousemove", handleMouseMove);

      return () => {
        document.removeEventListener("click", handleClick, true);
        document.removeEventListener("mousemove", handleMouseMove);
        document.body.style.userSelect = "";
      };
    }
  }, [
    isActive,
    selectedElement,
    hoveredElement,
    isDragging,
    editableSelectors,
    lockedElements,
  ]);

  const selectElement = (element: HTMLElement) => {
    const uniqueId = getUniqueId(element);
    setSelectedElement(element);
    setHoveredElement(null);

    // Remove the saved changes indicator if present
    element.style.outline = "";
    element.style.outlineOffset = "";

    // Store original content if not already stored
    if (!changes.has(uniqueId)) {
      const newChange: ElementChange = {
        uniqueId,
        content: element.innerHTML,
        styles: element.style.cssText,
        originalContent: element.innerHTML,
        originalStyles: element.style.cssText,
      };
      setChanges(new Map(changes.set(uniqueId, newChange)));
    }

    // Ensure element has positioning for transforms to work
    const computed = window.getComputedStyle(element);
    if (computed.position === "static") {
      element.style.position = "relative";
    }

    // Get computed styles
    const getFontWeight = (weight: string): string => {
      const weightMap: { [key: string]: string } = {
        normal: "400",
        bold: "700",
        lighter: "300",
        bolder: "900",
      };
      // Convert to string and handle edge cases
      const convertedWeight = weightMap[weight.toLowerCase()] || weight;
      // Ensure it's a valid numeric string, default to 400 if not
      const numericWeight = parseInt(convertedWeight);
      if (isNaN(numericWeight) || numericWeight < 100 || numericWeight > 900) {
        return "400";
      }
      return String(numericWeight);
    };

    const normalizeFontFamily = (fontFamily: string): string => {
      // Extract first font family from comma-separated list and remove quotes
      const firstFont = fontFamily.split(",")[0].trim().replace(/['"]/g, "");

      // Map common system fonts to their select values
      const fontMap: { [key: string]: string } = {
        Arial: "Arial, sans-serif",
        "Helvetica Neue": "'Helvetica Neue', Helvetica, sans-serif",
        Helvetica: "'Helvetica Neue', Helvetica, sans-serif",
        "Times New Roman": "'Times New Roman', Times, serif",
        Georgia: "Georgia, serif",
        "Courier New": "'Courier New', Courier, monospace",
        Verdana: "Verdana, sans-serif",
        "Trebuchet MS": "'Trebuchet MS', sans-serif",
        "Comic Sans MS": "'Comic Sans MS', cursive",
        Impact: "Impact, sans-serif",
        "Lucida Console": "'Lucida Console', Monaco, monospace",
        "Palatino Linotype":
          "'Palatino Linotype', 'Book Antiqua', Palatino, serif",
        Tahoma: "Tahoma, sans-serif",
        "Gill Sans": "'Gill Sans', sans-serif",
        "Century Gothic": "'Century Gothic', sans-serif",
        "system-ui": "system-ui, -apple-system, sans-serif",
      };

      return fontMap[firstFont] || fontFamily;
    };

    setElementStyles({
      fontSize: parseInt(computed.fontSize),
      fontWeight: getFontWeight(computed.fontWeight),
      color: rgbToHex(computed.color),
      backgroundColor:
        computed.backgroundColor !== "rgba(0, 0, 0, 0)"
          ? rgbToHex(computed.backgroundColor)
          : "#ffffff",
      textAlign: computed.textAlign,
      fontFamily: normalizeFontFamily(computed.fontFamily),
      lineHeight: parseFloat(computed.lineHeight) || 1.5,
      letterSpacing: parseFloat(computed.letterSpacing) || 0,
      textDecoration: computed.textDecoration,
      fontStyle: computed.fontStyle,
      padding: computed.padding,
      margin: computed.margin,
      borderRadius: parseInt(computed.borderRadius) || 0,
      width: element.offsetWidth,
      height: element.offsetHeight,
      opacity: parseFloat(computed.opacity) || 1,
    });

    // Make element editable for text content
    if (
      [
        "H1",
        "H2",
        "H3",
        "H4",
        "H5",
        "H6",
        "P",
        "SPAN",
        "A",
        "BUTTON",
        "LABEL",
      ].includes(element.tagName)
    ) {
      element.contentEditable = "true";
      element.focus();

      // Listen for content changes
      element.addEventListener("input", handleContentChange);
    }
  };

  const handleContentChange = (e: Event) => {
    const element = e.target as HTMLElement;
    const uniqueId = getUniqueId(element);
    const change = changes.get(uniqueId);

    if (change) {
      change.content = element.innerHTML;
      setChanges(new Map(changes));
    }
  };

  const deselectElement = () => {
    if (selectedElement) {
      selectedElement.contentEditable = "false";
      selectedElement.blur();
      selectedElement.removeEventListener("input", handleContentChange);
      setSelectedElement(null);
    }
  };

  const rgbToHex = (rgb: string): string => {
    if (rgb.startsWith("#")) return rgb;
    const match = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return "#000000";
    const r = parseInt(match[1]);
    const g = parseInt(match[2]);
    const b = parseInt(match[3]);
    return "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
  };

  const updateStyle = (property: string, value: any) => {
    if (!selectedElement) return;

    const uniqueId = getUniqueId(selectedElement);
    const change = changes.get(uniqueId);

    let styleValue = value;
    if (
      typeof value === "number" &&
      !["fontWeight", "opacity", "lineHeight"].includes(property)
    ) {
      styleValue = `${value}px`;
    }

    (selectedElement.style as any)[property] = styleValue;

    if (change) {
      change.styles = selectedElement.style.cssText;
      setChanges(new Map(changes));
    }

    setElementStyles((prev: any) => ({ ...prev, [property]: value }));
  };

  const handleSave = () => {
    const changesArray = Array.from(changes.values()).map((change) => {
      const element = getElementByUniqueId(change.uniqueId);
      return {
        uniqueId: change.uniqueId,
        content: element?.innerHTML || change.content,
        styles: element?.style.cssText || change.styles,
        selector: element ? getReadableSelector(element) : "",
        tagName: element?.tagName.toLowerCase() || "",
        classes: element ? Array.from(element.classList).join(" ") : "",
      };
    });

    if (onSave) {
      onSave(changesArray);
    }

    // Save to localStorage
    const pageId = window.location.pathname.replace(/\//g, "-") || "home";
    localStorage.setItem(
      `in-place-editor-changes-${pageId}`,
      JSON.stringify(changesArray),
    );

    // Also save a flag indicating we should apply changes on load
    localStorage.setItem(`in-place-editor-active-${pageId}`, "true");

    alert(
      `Changes saved successfully!\n\n${changesArray.length} element(s) modified.\n\nNote: Changes are stored in your browser and will persist until you clear browser data or reset the page.`,
    );
  };

  const handleExportManual = () => {
    const pageId = window.location.pathname.replace(/\//g, "-") || "home";
    const changesArray = Array.from(changes.values()).map((change) => {
      const element = getElementByUniqueId(change.uniqueId);
      return {
        uniqueId: change.uniqueId,
        content: element?.innerHTML || change.content,
        styles: element?.style.cssText || change.styles,
        selector: element ? getReadableSelector(element) : "",
        tagName: element?.tagName.toLowerCase() || "",
        classes: element ? Array.from(element.classList).join(" ") : "",
        id: element?.id || "",
      };
    });

    let exportText = `# MANUAL CODE EXPORT - ${pageId.toUpperCase()}
Generated: ${new Date().toLocaleString()}
Page: ${window.location.pathname}
Changes: ${changesArray.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPY & PASTE INTO YOUR CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    changesArray.forEach((change, index) => {
      exportText += `\n──── Change ${index + 1}: ${change.tagName.toUpperCase()} ────\n`;
      exportText += `Location: ${change.selector}\n`;
      if (change.id) exportText += `ID: ${change.id}\n`;
      if (change.classes) exportText += `Classes: ${change.classes}\n`;
      exportText += `\nHTML:\n\`\`\`html\n`;

      const attrs = [];
      if (change.id) attrs.push(`id="${change.id}"`);
      if (change.classes) attrs.push(`class="${change.classes}"`);
      attrs.push(`data-editor-id="${change.uniqueId}"`);
      if (change.styles) attrs.push(`style="${change.styles}"`);

      exportText += `<${change.tagName}${attrs.length > 0 ? " " + attrs.join(" ") : ""}>\n`;
      if (change.content && change.content.length < 150) {
        exportText += `  ${change.content}\n`;
      }
      exportText += `</${change.tagName}>\n\`\`\`\n`;
    });

    exportText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`json
${JSON.stringify(changesArray, null, 2)}
\`\`\`
`;

    navigator.clipboard
      .writeText(exportText)
      .then(() => {
        alert(
          `✅ Manual Code Export copied!\n\n${changesArray.length} change(s) ready to paste into your code.`,
        );
      })
      .catch(() => {
        const blob = new Blob([exportText], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `manual-export-${pageId}-${Date.now()}.md`;
        a.click();
        URL.revokeObjectURL(url);
        alert(`✅ Manual export downloaded!`);
      });
  };

  const handleExportAI = () => {
    const pageId = window.location.pathname.replace(/\//g, "-") || "home";
    const fileName = pageId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");

    const changesArray = Array.from(changes.values()).map((change) => {
      const element = getElementByUniqueId(change.uniqueId);
      return {
        uniqueId: change.uniqueId,
        styles: element?.style.cssText || change.styles,
        selector: element ? getReadableSelector(element) : "",
        tagName: element?.tagName.toLowerCase() || "",
        classes: element ? Array.from(element.classList).join(" ") : "",
        id: element?.id || "",
      };
    });

    const aiPrompt = `Apply ${changesArray.length} style changes to src/pages/${fileName}.tsx:

${changesArray
  .map((change, i) => {
    const identifier = change.id
      ? `id="${change.id}"`
      : change.classes
        ? `className="${change.classes}"`
        : `selector: ${change.selector}`;

    return `${i + 1}. Find <${change.tagName}> with ${identifier}
   - Add: data-editor-id="${change.uniqueId}"
   - Add/update: style="${change.styles}"`;
  })
  .join("\n\n")}

Keep all existing code, props, and functionality. Only add the data-editor-id attribute and update inline styles.`;

    navigator.clipboard
      .writeText(aiPrompt)
      .then(() => {
        alert(
          `✅ AI Prompt copied to clipboard!\n\nPaste this directly into ChatGPT, Claude, or any AI assistant.`,
        );
      })
      .catch(() => {
        const blob = new Blob([aiPrompt], { type: "text/plain" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `ai-prompt-${pageId}-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);
        alert(`✅ AI prompt downloaded!`);
      });
  };

  const getReadableSelector = (element: HTMLElement): string => {
    if (element.id) return `#${element.id}`;
    const classes = Array.from(element.classList).slice(0, 2).join(".");
    return classes
      ? `${element.tagName.toLowerCase()}.${classes}`
      : element.tagName.toLowerCase();
  };

  const handleDelete = () => {
    if (
      !selectedElement ||
      !confirm("Delete this element? This can be undone before saving.")
    )
      return;

    const uniqueId = getUniqueId(selectedElement);
    selectedElement.style.display = "none";
    setHiddenElements(new Set(hiddenElements.add(uniqueId)));
    deselectElement();
  };

  const handleDuplicate = () => {
    if (!selectedElement) return;

    const clone = selectedElement.cloneNode(true) as HTMLElement;
    clone.removeAttribute("data-editor-id"); // Will get new ID when selected
    selectedElement.parentNode?.insertBefore(
      clone,
      selectedElement.nextSibling,
    );

    alert("Element duplicated! Click on the new element to edit it.");
  };

  const handleToggleVisibility = () => {
    if (!selectedElement) return;

    const uniqueId = getUniqueId(selectedElement);
    if (hiddenElements.has(uniqueId)) {
      selectedElement.style.display = "";
      hiddenElements.delete(uniqueId);
      setHiddenElements(new Set(hiddenElements));
    } else {
      selectedElement.style.display = "none";
      hiddenElements.add(uniqueId);
      setHiddenElements(new Set(hiddenElements));
      deselectElement();
    }
  };

  const handleToggleLock = () => {
    if (!selectedElement) return;

    const uniqueId = getUniqueId(selectedElement);
    if (lockedElements.has(uniqueId)) {
      lockedElements.delete(uniqueId);
      setLockedElements(new Set(lockedElements));
    } else {
      lockedElements.add(uniqueId);
      setLockedElements(new Set(lockedElements));
      deselectElement();
    }
  };

  const handleReset = () => {
    if (!selectedElement) return;

    const uniqueId = getUniqueId(selectedElement);
    const change = changes.get(uniqueId);

    if (change && confirm("Reset this element to original state?")) {
      selectedElement.innerHTML = change.originalContent;
      selectedElement.style.cssText = change.originalStyles;
      changes.delete(uniqueId);
      setChanges(new Map(changes));
      deselectElement();
    }
  };

  const handleClose = () => {
    if (
      changes.size > 0 &&
      !confirm("Close without saving? All unsaved changes will be lost.")
    ) {
      return;
    }

    // Restore original content for unsaved changes
    changes.forEach((change) => {
      const element = getElementByUniqueId(change.uniqueId);
      if (element) {
        element.innerHTML = change.originalContent;
        element.style.cssText = change.originalStyles;
        element.contentEditable = "false";
        element.removeAttribute("data-editor-id");
      }
    });

    setIsActive(false);
    setSelectedElement(null);
    setHoveredElement(null);
    setChanges(new Map());
    setHiddenElements(new Set());
    setLockedElements(new Set());

    if (onClose) {
      onClose();
    }
  };

  // Apply saved changes when editor becomes active
  useEffect(() => {
    if (isActive) {
      const pageId = window.location.pathname.replace(/\//g, "-") || "home";
      const savedChanges = localStorage.getItem(
        `in-place-editor-changes-${pageId}`,
      );

      if (savedChanges) {
        try {
          const parsedChanges = JSON.parse(savedChanges);

          // Pre-assign data-editor-id attributes to elements so they can be found
          parsedChanges.forEach((change: any) => {
            const element = document.querySelector(
              `[data-editor-id="${change.uniqueId}"]`,
            ) as HTMLElement;
            if (element) {
              // Element already has the ID, add visual indicator
              element.style.outline = "2px dashed rgba(34, 197, 94, 0.5)";
              element.style.outlineOffset = "2px";
              return;
            }

            // Try to find element by selector and assign the saved ID
            if (change.selector) {
              const foundElement = document.querySelector(
                change.selector,
              ) as HTMLElement;
              if (
                foundElement &&
                !foundElement.getAttribute("data-editor-id")
              ) {
                foundElement.setAttribute("data-editor-id", change.uniqueId);
                // Add visual indicator
                foundElement.style.outline =
                  "2px dashed rgba(34, 197, 94, 0.5)";
                foundElement.style.outlineOffset = "2px";
              }
            }
          });
        } catch (error) {
          console.error("Error loading saved changes:", error);
        }
      }
    }
  }, [isActive]);

  if (!isActive) {
    return (
      <Button
        onClick={() => setIsActive(true)}
        className="fixed bottom-6 right-6 z-50 rounded-full w-14 h-14 shadow-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        title="Edit Page Content"
      >
        <Type className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <>
      {/* Hover overlay */}
      {hoveredElement && !selectedElement && (
        <div
          className="fixed pointer-events-none z-[9998] border-2 border-blue-400 bg-blue-400/10 transition-all duration-100"
          style={{
            top: `${hoveredElement.getBoundingClientRect().top + window.scrollY}px`,
            left: `${hoveredElement.getBoundingClientRect().left + window.scrollX}px`,
            width: `${hoveredElement.offsetWidth}px`,
            height: `${hoveredElement.offsetHeight}px`,
            borderRadius: "4px",
          }}
        >
          <div className="absolute -top-6 left-0 bg-blue-500 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
            Click to edit: {hoveredElement.tagName.toLowerCase()}
          </div>
        </div>
      )}

      {/* Moveable component for drag and resize */}
      {selectedElement && (
        <Moveable
          ref={moveableRef}
          target={selectedElement}
          draggable={true}
          resizable={true}
          rotatable={false}
          snappable={true}
          snapThreshold={5}
          isDisplaySnapDigit={true}
          snapGap={true}
          snapDirections={{
            top: true,
            left: true,
            bottom: true,
            right: true,
            center: true,
            middle: true,
          }}
          elementSnapDirections={{
            top: true,
            left: true,
            bottom: true,
            right: true,
            center: true,
            middle: true,
          }}
          onDragStart={() => {
            setIsDragging(true);
            if (selectedElement) selectedElement.contentEditable = "false";
          }}
          onDrag={({ target, transform }) => {
            target.style.transform = transform;
          }}
          onDragEnd={() => {
            setIsDragging(false);
            if (selectedElement) {
              const uniqueId = getUniqueId(selectedElement);
              const change = changes.get(uniqueId);
              if (change) {
                change.styles = selectedElement.style.cssText;
                setChanges(new Map(changes));
              }
            }
          }}
          onResizeStart={() => {
            setIsDragging(true);
            if (selectedElement) selectedElement.contentEditable = "false";
          }}
          onResize={({ target, width, height, delta }: any) => {
            target.style.width = `${width}px`;
            target.style.height = `${height}px`;

            // Update the element styles state to reflect changes in the panel
            setElementStyles((prev: any) => ({
              ...prev,
              width: width,
              height: height,
            }));
          }}
          onResizeEnd={() => {
            setIsDragging(false);
            if (selectedElement) {
              const uniqueId = getUniqueId(selectedElement);
              const change = changes.get(uniqueId);
              if (change) {
                change.styles = selectedElement.style.cssText;
                setChanges(new Map(changes));
              }
            }
          }}
        />
      )}

      {/* Top toolbar */}
      <div className="in-place-editor-controls fixed top-0 left-0 right-0 z-[10000] bg-gradient-to-r from-purple-900 to-blue-900 text-white px-4 py-3 shadow-2xl">
        <div className="flex items-center justify-between max-w-full mx-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5" />
              <h2 className="text-lg font-semibold">Quick Edit Mode</h2>
            </div>
            {selectedElement ? (
              <span className="text-sm text-blue-200 bg-blue-800/50 px-3 py-1 rounded-full">
                Editing:{" "}
                <strong>{selectedElement.tagName.toLowerCase()}</strong> (
                {getUniqueId(selectedElement)})
              </span>
            ) : (
              <span className="text-sm text-gray-300">
                👆 Click any element to edit |
                <span className="text-green-300 ml-1">
                  Green outline = saved changes
                </span>
              </span>
            )}
            {changes.size > 0 && (
              <span className="text-xs bg-yellow-500 text-black px-2 py-1 rounded-full font-semibold">
                {changes.size} unsaved change{changes.size !== 1 ? "s" : ""}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <EditHistoryManager />
            {changes.size > 0 && (
              <>
                <Button
                  onClick={handleExportManual}
                  size="sm"
                  variant="outline"
                  className="bg-blue-600 hover:bg-blue-700 text-white border-blue-500"
                  title="Export for manual code editing"
                >
                  📋 Manual Export
                </Button>
                <Button
                  onClick={handleExportAI}
                  size="sm"
                  variant="outline"
                  className="bg-purple-600 hover:bg-purple-700 text-white border-purple-500"
                  title="Export as AI prompt"
                >
                  🤖 AI Prompt
                </Button>
              </>
            )}
            <Button
              onClick={handleSave}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </Button>
            <Button
              onClick={handleClose}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              <X className="w-4 h-4 mr-2" />
              Close
            </Button>
          </div>
        </div>
      </div>

      {/* Side panel for style editing */}
      {selectedElement && (
        <Card className="in-place-editor-panel fixed right-4 top-20 z-[10000] w-96 max-h-[calc(100vh-100px)] overflow-y-auto bg-white shadow-2xl border-2 border-purple-500">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="border-b pb-3 bg-gradient-to-r from-purple-50 to-blue-50 -m-4 p-4 mb-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Type className="w-5 h-5 text-purple-600" />
                  Element Editor
                </h3>
                <Button size="sm" variant="ghost" onClick={deselectElement}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <p className="text-xs text-gray-600">
                Editing:{" "}
                <strong>{selectedElement.tagName.toLowerCase()}</strong>
              </p>
              <p className="text-xs text-gray-500">
                ID: {getUniqueId(selectedElement)}
              </p>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">
                Quick Actions
              </Label>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDuplicate}
                  className="w-full"
                >
                  <Copy className="w-3 h-3 mr-1" />
                  Duplicate
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleReset}
                  className="w-full"
                >
                  <RotateCcw className="w-3 h-3 mr-1" />
                  Reset
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleVisibility}
                  className="w-full"
                >
                  {hiddenElements.has(getUniqueId(selectedElement)) ? (
                    <>
                      <Eye className="w-3 h-3 mr-1" />
                      Show
                    </>
                  ) : (
                    <>
                      <EyeOff className="w-3 h-3 mr-1" />
                      Hide
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleToggleLock}
                  className="w-full"
                >
                  {lockedElements.has(getUniqueId(selectedElement)) ? (
                    <>
                      <Unlock className="w-3 h-3 mr-1" />
                      Unlock
                    </>
                  ) : (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Lock
                    </>
                  )}
                </Button>
              </div>
              <Button
                size="sm"
                variant="destructive"
                onClick={handleDelete}
                className="w-full"
              >
                <Trash2 className="w-3 h-3 mr-1" />
                Delete Element
              </Button>
            </div>

            {/* Image/Icon Replacement */}
            {selectedElement.tagName === "IMG" && (
              <div className="space-y-3 border-t pt-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Image Source
                </Label>
                <div className="space-y-2">
                  <Label className="text-xs">Image URL</Label>
                  <Input
                    type="text"
                    value={(selectedElement as HTMLImageElement).src || ""}
                    onChange={(e) => {
                      if (selectedElement.tagName === "IMG") {
                        (selectedElement as HTMLImageElement).src =
                          e.target.value;
                        const uniqueId = getUniqueId(selectedElement);
                        const change = changes.get(uniqueId);
                        if (change) {
                          change.content = selectedElement.innerHTML;
                          setChanges(new Map(changes));
                        }
                      }
                    }}
                    placeholder="https://example.com/image.jpg"
                    className="h-9 text-xs"
                  />
                  <div className="text-xs text-gray-500">Or upload a file:</div>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file && selectedElement.tagName === "IMG") {
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          (selectedElement as HTMLImageElement).src = event
                            .target?.result as string;
                          const uniqueId = getUniqueId(selectedElement);
                          const change = changes.get(uniqueId);
                          if (change) {
                            change.content = selectedElement.innerHTML;
                            setChanges(new Map(changes));
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="h-9 text-xs cursor-pointer"
                  />
                  <div className="space-y-2">
                    <Label className="text-xs">Alt Text</Label>
                    <Input
                      type="text"
                      value={(selectedElement as HTMLImageElement).alt || ""}
                      onChange={(e) => {
                        if (selectedElement.tagName === "IMG") {
                          (selectedElement as HTMLImageElement).alt =
                            e.target.value;
                          const uniqueId = getUniqueId(selectedElement);
                          const change = changes.get(uniqueId);
                          if (change) {
                            setChanges(new Map(changes));
                          }
                        }
                      }}
                      placeholder="Description of image"
                      className="h-9 text-xs"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SVG/Icon Replacement */}
            {(selectedElement.tagName === "SVG" ||
              selectedElement.querySelector("svg") ||
              selectedElement.classList.contains("lucide") ||
              selectedElement.querySelector("[class*='icon']")) && (
              <div className="space-y-3 border-t pt-3">
                <Label className="text-sm font-semibold text-gray-700">
                  Icon/SVG Content
                </Label>
                <div className="space-y-2">
                  <Label className="text-xs">
                    Replace with SVG code or icon
                  </Label>
                  <textarea
                    value={selectedElement.innerHTML || ""}
                    onChange={(e) => {
                      selectedElement.innerHTML = e.target.value;
                      const uniqueId = getUniqueId(selectedElement);
                      const change = changes.get(uniqueId);
                      if (change) {
                        change.content = e.target.value;
                        setChanges(new Map(changes));
                      }
                    }}
                    placeholder="<svg>...</svg> or icon markup"
                    className="w-full h-32 px-3 py-2 text-xs border rounded font-mono"
                  />
                  <div className="text-xs text-gray-500">
                    Paste SVG code or use a service like{" "}
                    <a
                      href="https://lucide.dev"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      Lucide Icons
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Typography */}
            <div className="space-y-3 border-t pt-3">
              <Label className="text-sm font-semibold text-gray-700">
                Typography
              </Label>

              {/* Font Size */}
              <div className="space-y-2">
                <Label className="flex items-center justify-between text-xs">
                  Font Size
                  <span className="text-purple-600 font-mono">
                    {elementStyles.fontSize}px
                  </span>
                </Label>
                <Slider
                  value={[elementStyles.fontSize || 16]}
                  onValueChange={([value]) => updateStyle("fontSize", value)}
                  min={8}
                  max={120}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Font Weight */}
              <div className="space-y-2">
                <Label className="text-xs">Font Weight</Label>
                <Select
                  value={String(elementStyles.fontWeight) || "400"}
                  onValueChange={(value) => updateStyle("fontWeight", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select weight" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100">Thin (100)</SelectItem>
                    <SelectItem value="200">Extra Light (200)</SelectItem>
                    <SelectItem value="300">Light (300)</SelectItem>
                    <SelectItem value="400">Normal (400)</SelectItem>
                    <SelectItem value="500">Medium (500)</SelectItem>
                    <SelectItem value="600">Semi Bold (600)</SelectItem>
                    <SelectItem value="700">Bold (700)</SelectItem>
                    <SelectItem value="800">Extra Bold (800)</SelectItem>
                    <SelectItem value="900">Black (900)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Font Family */}
              <div className="space-y-2">
                <Label className="text-xs">Font Family</Label>
                <Select
                  value={elementStyles.fontFamily || "inherit"}
                  onValueChange={(value) => updateStyle("fontFamily", value)}
                >
                  <SelectTrigger className="h-9">
                    <SelectValue placeholder="Select font" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inherit">Inherit</SelectItem>
                    <SelectItem value="Arial, sans-serif">Arial</SelectItem>
                    <SelectItem value="'Helvetica Neue', Helvetica, sans-serif">
                      Helvetica
                    </SelectItem>
                    <SelectItem value="'Times New Roman', Times, serif">
                      Times New Roman
                    </SelectItem>
                    <SelectItem value="Georgia, serif">Georgia</SelectItem>
                    <SelectItem value="'Courier New', Courier, monospace">
                      Courier New
                    </SelectItem>
                    <SelectItem value="Verdana, sans-serif">Verdana</SelectItem>
                    <SelectItem value="'Trebuchet MS', sans-serif">
                      Trebuchet MS
                    </SelectItem>
                    <SelectItem value="'Comic Sans MS', cursive">
                      Comic Sans MS
                    </SelectItem>
                    <SelectItem value="Impact, sans-serif">Impact</SelectItem>
                    <SelectItem value="'Lucida Console', Monaco, monospace">
                      Lucida Console
                    </SelectItem>
                    <SelectItem value="'Palatino Linotype', 'Book Antiqua', Palatino, serif">
                      Palatino
                    </SelectItem>
                    <SelectItem value="Tahoma, sans-serif">Tahoma</SelectItem>
                    <SelectItem value="'Gill Sans', sans-serif">
                      Gill Sans
                    </SelectItem>
                    <SelectItem value="'Century Gothic', sans-serif">
                      Century Gothic
                    </SelectItem>
                    <SelectItem value="system-ui, -apple-system, sans-serif">
                      System UI
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Text Color */}
              <div className="space-y-2">
                <Label className="text-xs">Text Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={elementStyles.color || "#000000"}
                    onChange={(e) => updateStyle("color", e.target.value)}
                    className="w-16 h-9 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={elementStyles.color || "#000000"}
                    onChange={(e) => updateStyle("color", e.target.value)}
                    className="flex-1 h-9 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Background Color */}
              <div className="space-y-2">
                <Label className="text-xs">Background Color</Label>
                <div className="flex gap-2">
                  <Input
                    type="color"
                    value={elementStyles.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateStyle("backgroundColor", e.target.value)
                    }
                    className="w-16 h-9 cursor-pointer"
                  />
                  <Input
                    type="text"
                    value={elementStyles.backgroundColor || "#ffffff"}
                    onChange={(e) =>
                      updateStyle("backgroundColor", e.target.value)
                    }
                    className="flex-1 h-9 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Text Align */}
              <div className="space-y-2">
                <Label className="text-xs">Text Align</Label>
                <div className="grid grid-cols-4 gap-1">
                  <Button
                    size="sm"
                    variant={
                      elementStyles.textAlign === "left" ? "default" : "outline"
                    }
                    onClick={() => updateStyle("textAlign", "left")}
                    className="h-9"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      elementStyles.textAlign === "center"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => updateStyle("textAlign", "center")}
                    className="h-9"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      elementStyles.textAlign === "right"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => updateStyle("textAlign", "right")}
                    className="h-9"
                  >
                    <AlignRight className="w-4 h-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      elementStyles.textAlign === "justify"
                        ? "default"
                        : "outline"
                    }
                    onClick={() => updateStyle("textAlign", "justify")}
                    className="h-9"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Text Style */}
              <div className="space-y-2">
                <Label className="text-xs">Text Style</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={
                      elementStyles.fontStyle === "italic"
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateStyle(
                        "fontStyle",
                        elementStyles.fontStyle === "italic"
                          ? "normal"
                          : "italic",
                      )
                    }
                    className="h-9"
                  >
                    <Italic className="w-4 h-4 mr-1" />
                    Italic
                  </Button>
                  <Button
                    size="sm"
                    variant={
                      elementStyles.textDecoration?.includes("underline")
                        ? "default"
                        : "outline"
                    }
                    onClick={() =>
                      updateStyle(
                        "textDecoration",
                        elementStyles.textDecoration?.includes("underline")
                          ? "none"
                          : "underline",
                      )
                    }
                    className="h-9"
                  >
                    <Underline className="w-4 h-4 mr-1" />
                    Underline
                  </Button>
                </div>
              </div>

              {/* Letter Spacing */}
              <div className="space-y-2">
                <Label className="flex items-center justify-between text-xs">
                  Letter Spacing
                  <span className="text-purple-600 font-mono">
                    {elementStyles.letterSpacing}px
                  </span>
                </Label>
                <Slider
                  value={[elementStyles.letterSpacing || 0]}
                  onValueChange={([value]) =>
                    updateStyle("letterSpacing", value)
                  }
                  min={-5}
                  max={20}
                  step={0.5}
                  className="w-full"
                />
              </div>

              {/* Line Height */}
              <div className="space-y-2">
                <Label className="flex items-center justify-between text-xs">
                  Line Height
                  <span className="text-purple-600 font-mono">
                    {elementStyles.lineHeight}
                  </span>
                </Label>
                <Slider
                  value={[elementStyles.lineHeight || 1.5]}
                  onValueChange={([value]) => updateStyle("lineHeight", value)}
                  min={0.5}
                  max={3}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Dimensions & Spacing */}
            <div className="space-y-3 border-t pt-3">
              <Label className="text-sm font-semibold text-gray-700">
                Dimensions & Effects
              </Label>

              {/* Border Radius */}
              <div className="space-y-2">
                <Label className="flex items-center justify-between text-xs">
                  Border Radius
                  <span className="text-purple-600 font-mono">
                    {elementStyles.borderRadius}px
                  </span>
                </Label>
                <Slider
                  value={[elementStyles.borderRadius || 0]}
                  onValueChange={([value]) =>
                    updateStyle("borderRadius", value)
                  }
                  min={0}
                  max={50}
                  step={1}
                  className="w-full"
                />
              </div>

              {/* Opacity */}
              <div className="space-y-2">
                <Label className="flex items-center justify-between text-xs">
                  Opacity
                  <span className="text-purple-600 font-mono">
                    {elementStyles.opacity}
                  </span>
                </Label>
                <Slider
                  value={[elementStyles.opacity || 1]}
                  onValueChange={([value]) => updateStyle("opacity", value)}
                  min={0}
                  max={1}
                  step={0.1}
                  className="w-full"
                />
              </div>
            </div>

            {/* Help */}
            <div className="border-t pt-3 text-xs text-gray-600 space-y-1 bg-blue-50 -m-4 mt-4 p-4">
              <p className="font-semibold text-gray-700 mb-2">💡 Tips:</p>
              <p>
                • <strong>Click text</strong> to edit content directly
              </p>
              <p>
                • <strong>Drag handles</strong> to move or resize
              </p>
              <p>
                • <strong>All changes</strong> are per-element (won't affect
                others)
              </p>
              <p>
                • <strong>Save often</strong> to keep your work
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Help text */}
      {!selectedElement && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[10000] bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
          <p className="text-sm font-medium">
            ✨ Click any element to start editing • Drag to move • Resize with
            handles
          </p>
        </div>
      )}
    </>
  );
};

export default InPlaceEditor;
