import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Trash2,
  History,
  Eye,
  EyeOff,
  AlertTriangle,
  Clock,
  FileText,
  Download,
  FileDown,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChangeItem {
  uniqueId: string;
  content: string;
  styles: string;
  selector: string;
  tagName?: string;
  classes?: string;
}

interface PageEdits {
  pageId: string;
  changes: ChangeItem[];
  timestamp: number;
  changeCount: number;
}

const EditHistoryManager = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [pageEdits, setPageEdits] = useState<PageEdits[]>([]);
  const [expandedPages, setExpandedPages] = useState<Set<string>>(new Set());
  const [selectedChange, setSelectedChange] = useState<{
    pageId: string;
    change: ChangeItem;
  } | null>(null);

  // Load all edit history from localStorage
  const loadEditHistory = () => {
    const edits: PageEdits[] = [];

    // Scan localStorage for in-place-editor changes
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("in-place-editor-changes-")) {
        const pageId = key.replace("in-place-editor-changes-", "");
        const data = localStorage.getItem(key);

        if (data) {
          try {
            const changes = JSON.parse(data);
            edits.push({
              pageId,
              changes,
              timestamp: Date.now(), // We could enhance this by storing timestamps
              changeCount: changes.length,
            });
          } catch (e) {
            console.error(`Failed to parse changes for ${pageId}:`, e);
          }
        }
      }
    }

    // Also scan for full page content (from VisualEditor)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("page-content-")) {
        const pageId = key.replace("page-content-", "");
        // Check if we already have this page from in-place edits
        if (!edits.find((e) => e.pageId === pageId)) {
          edits.push({
            pageId,
            changes: [
              {
                uniqueId: "full-page-content",
                content: "Full page rebuild",
                styles: "",
                selector: "Full Page",
                tagName: "page",
              },
            ],
            timestamp: Date.now(),
            changeCount: 1,
          });
        }
      }
    }

    setPageEdits(edits);
  };

  useEffect(() => {
    if (isOpen) {
      loadEditHistory();
    }
  }, [isOpen]);

  // Delete a specific change from a page
  const deleteChange = (pageId: string, uniqueId: string) => {
    if (
      !confirm("Delete this change? This will remove it from your saved edits.")
    ) {
      return;
    }

    const key = `in-place-editor-changes-${pageId}`;
    const data = localStorage.getItem(key);

    if (data) {
      try {
        const changes = JSON.parse(data);
        const updatedChanges = changes.filter(
          (c: ChangeItem) => c.uniqueId !== uniqueId,
        );

        if (updatedChanges.length > 0) {
          localStorage.setItem(key, JSON.stringify(updatedChanges));
        } else {
          // If no changes left, remove the entire key
          localStorage.removeItem(key);
        }

        loadEditHistory();
        alert("Change deleted successfully! Refresh the page to see updates.");
      } catch (e) {
        console.error("Failed to delete change:", e);
        alert("Failed to delete change.");
      }
    }
  };

  // Delete all edits for a specific page
  const deletePageEdits = (pageId: string) => {
    if (
      !confirm(
        `Delete ALL edits for "${pageId}"? This will remove all quick edits and full page content. This cannot be undone.`,
      )
    ) {
      return;
    }

    // Remove quick edits
    localStorage.removeItem(`in-place-editor-changes-${pageId}`);
    localStorage.removeItem(`in-place-editor-active-${pageId}`);

    // Remove full page content
    localStorage.removeItem(`page-content-${pageId}`);

    loadEditHistory();
    alert(
      `All edits for "${pageId}" deleted! Refresh the page to see the default content.`,
    );
  };

  // Clear ALL edit history
  const clearAllEdits = () => {
    if (
      !confirm(
        "⚠️ CLEAR ALL EDITS?\n\nThis will delete ALL page edits from ALL pages. This action cannot be undone!\n\nAre you absolutely sure?",
      )
    ) {
      return;
    }

    // Confirm again for safety
    if (
      !confirm(
        "Last chance! This will permanently delete all your edits. Continue?",
      )
    ) {
      return;
    }

    const keysToDelete: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.startsWith("in-place-editor-") || key.startsWith("page-content-"))
      ) {
        keysToDelete.push(key);
      }
    }

    keysToDelete.forEach((key) => localStorage.removeItem(key));

    loadEditHistory();
    alert(
      `Successfully cleared ${keysToDelete.length} edit entries! Refresh any pages to see default content.`,
    );
  };

  const togglePageExpand = (pageId: string) => {
    const newExpanded = new Set(expandedPages);
    if (newExpanded.has(pageId)) {
      newExpanded.delete(pageId);
    } else {
      newExpanded.add(pageId);
    }
    setExpandedPages(newExpanded);
  };

  const formatPageId = (pageId: string) => {
    return pageId
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const totalChanges = pageEdits.reduce(
    (sum, page) => sum + page.changeCount,
    0,
  );

  // Export changes for manual code editing
  const exportPageManual = (pageId: string, changes: ChangeItem[]) => {
    let exportText = `# MANUAL CODE EXPORT - ${pageId.toUpperCase()}
Generated: ${new Date().toLocaleString()}
Page ID: ${pageId}
Changes: ${changes.length}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
COPY & PASTE INTO YOUR CODE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

`;

    changes.forEach((change, index) => {
      exportText += `\n──── Change ${index + 1}: ${change.tagName?.toUpperCase() || "ELEMENT"} ────\n`;
      exportText += `Location: ${change.selector}\n`;
      exportText += `\nHTML:\n\`\`\`html\n`;

      const tag = change.tagName || "div";
      const attrs = [];
      if (change.classes) attrs.push(`class="${change.classes}"`);
      attrs.push(`data-editor-id="${change.uniqueId}"`);
      if (change.styles) attrs.push(`style="${change.styles}"`);

      exportText += `<${tag}${attrs.length > 0 ? " " + attrs.join(" ") : ""}>\n`;
      if (change.content && change.content.length < 150) {
        exportText += `  ${change.content}\n`;
      }
      exportText += `</${tag}>\n\`\`\`\n`;
    });

    exportText += `\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
JSON DATA
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

\`\`\`json
${JSON.stringify(changes, null, 2)}
\`\`\`
`;

    navigator.clipboard
      .writeText(exportText)
      .then(() => {
        alert(
          `✅ Manual Code Export copied!\n\n${changes.length} change(s) for "${pageId}".`,
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

  // Export changes as AI prompt
  const exportPageAI = (pageId: string, changes: ChangeItem[]) => {
    const fileName = pageId
      .split("-")
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join("");

    const aiPrompt = `Apply ${changes.length} style changes to src/pages/${fileName}.tsx:

${changes
  .map((change, i) => {
    const identifier = change.classes
      ? `className="${change.classes}"`
      : `selector: ${change.selector}`;

    return `${i + 1}. Find <${change.tagName || "div"}> with ${identifier}
   - Add: data-editor-id="${change.uniqueId}"
   - Add/update: style="${change.styles}"`;
  })
  .join("\n\n")}

Keep all existing code, props, and functionality. Only add the data-editor-id attribute and update inline styles.`;

    navigator.clipboard
      .writeText(aiPrompt)
      .then(() => {
        alert(
          `✅ AI Prompt copied!\n\nPaste into ChatGPT, Claude, or any AI assistant.`,
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          title="Manage Edit History"
        >
          <History className="w-4 h-4" />
          Edit History
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <History className="w-5 h-5 text-purple-600" />
            Edit History Manager
          </DialogTitle>
          <DialogDescription>
            View and manage all your page edits. Changes are stored in your
            browser's local storage.
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-between border-b pb-3">
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <span className="font-semibold">{pageEdits.length}</span> page(s)
              with edits
            </div>
            <div className="text-sm">
              <span className="font-semibold">{totalChanges}</span> total
              change(s)
            </div>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={clearAllEdits}
            disabled={pageEdits.length === 0}
            className="gap-2"
          >
            <Trash2 className="w-4 h-4" />
            Clear All Edits
          </Button>
        </div>

        {pageEdits.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <History className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No Edit History
            </h3>
            <p className="text-sm text-gray-500 max-w-md">
              You haven't made any edits yet. Use Quick Edit mode or Page
              Builder to start editing pages.
            </p>
          </div>
        ) : (
          <ScrollArea className="flex-1 pr-4">
            <div className="space-y-4">
              {pageEdits.map((page) => {
                const isExpanded = expandedPages.has(page.pageId);
                return (
                  <Card key={page.pageId} className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => togglePageExpand(page.pageId)}
                          className="p-1 h-8 w-8"
                        >
                          {isExpanded ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </Button>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {formatPageId(page.pageId)}
                          </h3>
                          <p className="text-xs text-gray-500">
                            Page ID: {page.pageId}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-semibold">
                          {page.changeCount} change
                          {page.changeCount !== 1 ? "s" : ""}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            exportPageManual(page.pageId, page.changes)
                          }
                          className="gap-2 bg-blue-50 hover:bg-blue-100"
                          title="Export for manual code editing"
                        >
                          📋 Manual
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            exportPageAI(page.pageId, page.changes)
                          }
                          className="gap-2 bg-purple-50 hover:bg-purple-100"
                          title="Export as AI prompt"
                        >
                          🤖 AI
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePageEdits(page.pageId)}
                          className="gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete All
                        </Button>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="mt-4 space-y-2 border-t pt-3">
                        {page.changes.map((change, idx) => (
                          <div
                            key={change.uniqueId}
                            className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex-shrink-0 w-8 h-8 bg-purple-100 text-purple-700 rounded-full flex items-center justify-center font-semibold text-sm">
                              {idx + 1}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <FileText className="w-4 h-4 text-gray-500" />
                                <span className="font-mono text-sm font-semibold text-gray-700">
                                  {change.selector || change.uniqueId}
                                </span>
                                {change.tagName && (
                                  <span className="text-xs bg-gray-200 px-2 py-0.5 rounded">
                                    {change.tagName}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-600 mb-2">
                                <strong>ID:</strong> {change.uniqueId}
                              </div>
                              {change.styles && (
                                <div className="text-xs text-gray-500 font-mono bg-white p-2 rounded border mb-2 overflow-x-auto">
                                  <strong>Styles:</strong>{" "}
                                  {change.styles.slice(0, 100)}
                                  {change.styles.length > 100 ? "..." : ""}
                                </div>
                              )}
                              {change.content &&
                                change.uniqueId !== "full-page-content" && (
                                  <div className="text-xs text-gray-500 bg-white p-2 rounded border overflow-x-auto max-h-24 overflow-y-auto">
                                    <strong>Content:</strong>{" "}
                                    {change.content.slice(0, 200)}
                                    {change.content.length > 200 ? "..." : ""}
                                  </div>
                                )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                deleteChange(page.pageId, change.uniqueId)
                              }
                              className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </ScrollArea>
        )}

        <div className="border-t pt-3 flex items-start gap-2 text-xs text-gray-500">
          <AlertTriangle className="w-4 h-4 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div>
            <strong>Note:</strong> Changes are stored in your browser's local
            storage. Clearing browser data will remove all edits. After deleting
            changes, refresh the page to see the original content.
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditHistoryManager;
