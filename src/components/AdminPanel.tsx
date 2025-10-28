import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Trash2, Download, Upload, Eye, Edit, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface PageData {
  pageId: string;
  pageName: string;
  route: string;
  lastModified?: string;
  hasCustomContent: boolean;
}

const AdminPanel = () => {
  const navigate = useNavigate();
  const [pages, setPages] = useState<PageData[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const allPages: PageData[] = [
    { pageId: "home", pageName: "Home", route: "/", hasCustomContent: false },
    {
      pageId: "about",
      pageName: "About",
      route: "/about",
      hasCustomContent: false,
    },
    {
      pageId: "at-portal",
      pageName: "AT Portal",
      route: "/at-portal",
      hasCustomContent: false,
    },
    {
      pageId: "coverage-report",
      pageName: "Coverage Report",
      route: "/coverage-report",
      hasCustomContent: false,
    },
    {
      pageId: "timesheet",
      pageName: "Timesheet",
      route: "/timesheet",
      hasCustomContent: false,
    },
    {
      pageId: "event-schedule",
      pageName: "Event Schedule",
      route: "/event-schedule",
      hasCustomContent: false,
    },
    {
      pageId: "contact-coordinator",
      pageName: "Contact Coordinator",
      route: "/contact-coordinator",
      hasCustomContent: false,
    },
  ];

  useEffect(() => {
    loadPages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadPages = () => {
    const updatedPages = allPages.map((page) => {
      const storageKey = `page-content-${page.pageId}`;
      const saved = localStorage.getItem(storageKey);

      if (saved) {
        try {
          const data = JSON.parse(saved);
          return {
            ...page,
            hasCustomContent: true,
            lastModified: new Date().toLocaleString(), // In production, store this in the saved data
          };
        } catch (error) {
          console.error(`Error loading page ${page.pageId}:`, error);
          return page;
        }
      }
      return page;
    });
    setPages(updatedPages);
  };

  const handleDeletePage = (pageId: string) => {
    if (
      confirm(
        `Are you sure you want to reset "${pages.find((p) => p.pageId === pageId)?.pageName}" to default? This cannot be undone.`,
      )
    ) {
      const storageKey = `page-content-${pageId}`;
      localStorage.removeItem(storageKey);
      loadPages();
      alert("Page reset successfully!");
    }
  };

  const handleExportPage = (pageId: string) => {
    const storageKey = `page-content-${pageId}`;
    const saved = localStorage.getItem(storageKey);

    if (!saved) {
      alert("No custom content to export for this page.");
      return;
    }

    try {
      const { html, css } = JSON.parse(saved);
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${pages.find((p) => p.pageId === pageId)?.pageName || "Exported Page"}</title>
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>
      `;

      const blob = new Blob([fullHtml], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${pageId}.html`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      alert("Failed to export page");
    }
  };

  const handleExportAll = () => {
    const allData: Record<string, { html: string; css: string }> = {};

    pages.forEach((page) => {
      const storageKey = `page-content-${page.pageId}`;
      const saved = localStorage.getItem(storageKey);
      if (saved) {
        allData[page.pageId] = JSON.parse(saved);
      }
    });

    if (Object.keys(allData).length === 0) {
      alert("No custom content to export.");
      return;
    }

    const blob = new Blob([JSON.stringify(allData, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `all-pages-backup-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportPage = (pageId: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        if (data.html && data.css) {
          const storageKey = `page-content-${pageId}`;
          localStorage.setItem(storageKey, JSON.stringify(data));
          loadPages();
          alert("Page imported successfully!");
        } else {
          alert("Invalid file format. Must contain html and css properties.");
        }
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import page. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleImportAll = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);

        let importCount = 0;
        Object.keys(data).forEach((pageId) => {
          if (data[pageId].html && data[pageId].css) {
            const storageKey = `page-content-${pageId}`;
            localStorage.setItem(storageKey, JSON.stringify(data[pageId]));
            importCount++;
          }
        });

        loadPages();
        alert(`Successfully imported ${importCount} page(s)!`);
      } catch (error) {
        console.error("Import failed:", error);
        alert("Failed to import pages. Please check the file format.");
      }
    };
    reader.readAsText(file);
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    pageId?: string,
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      if (pageId) {
        handleImportPage(pageId, file);
      } else {
        handleImportAll(file);
      }
      e.target.value = ""; // Reset input
    }
  };

  const handleEditPage = (route: string) => {
    navigate(route);
  };

  const handlePreviewPage = (route: string) => {
    window.open(route, "_blank");
  };

  const handleResetAll = () => {
    if (
      confirm(
        "Are you sure you want to reset ALL pages to default? This cannot be undone!",
      )
    ) {
      pages.forEach((page) => {
        const storageKey = `page-content-${page.pageId}`;
        localStorage.removeItem(storageKey);
      });
      loadPages();
      alert("All pages reset successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Visual Editor Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage all editable pages from one place
          </p>
        </div>

        {/* Global Actions */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Global Actions</CardTitle>
            <CardDescription>Manage all pages at once</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button onClick={handleExportAll} variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export All Pages
            </Button>

            <label>
              <input
                type="file"
                accept=".json"
                onChange={(e) => handleFileChange(e)}
                className="hidden"
              />
              <Button variant="outline" asChild>
                <span className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Import All Pages
                </span>
              </Button>
            </label>

            <Button onClick={handleResetAll} variant="destructive">
              <RefreshCw className="w-4 h-4 mr-2" />
              Reset All to Default
            </Button>

            <Button onClick={loadPages} variant="secondary">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </CardContent>
        </Card>

        {/* Pages Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pages.map((page) => (
            <Card
              key={page.pageId}
              className={
                page.hasCustomContent ? "border-blue-500 border-2" : ""
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{page.pageName}</CardTitle>
                  {page.hasCustomContent && (
                    <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                      Custom
                    </span>
                  )}
                </div>
                <CardDescription>
                  Route: {page.route}
                  {page.lastModified && (
                    <div className="text-xs mt-1">
                      Modified: {page.lastModified}
                    </div>
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  <Button
                    onClick={() => handleEditPage(page.route)}
                    size="sm"
                    variant="default"
                    className="flex-1"
                  >
                    <Edit className="w-3 h-3 mr-1" />
                    Edit
                  </Button>

                  <Button
                    onClick={() => handlePreviewPage(page.route)}
                    size="sm"
                    variant="outline"
                    className="flex-1"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    View
                  </Button>

                  <Button
                    onClick={() => handleExportPage(page.pageId)}
                    size="sm"
                    variant="outline"
                    disabled={!page.hasCustomContent}
                    title="Export this page"
                  >
                    <Download className="w-3 h-3" />
                  </Button>

                  <label>
                    <input
                      type="file"
                      accept=".json"
                      onChange={(e) => handleFileChange(e, page.pageId)}
                      className="hidden"
                    />
                    <Button
                      size="sm"
                      variant="outline"
                      asChild
                      title="Import to this page"
                    >
                      <span className="cursor-pointer">
                        <Upload className="w-3 h-3" />
                      </span>
                    </Button>
                  </label>

                  <Button
                    onClick={() => handleDeletePage(page.pageId)}
                    size="sm"
                    variant="destructive"
                    disabled={!page.hasCustomContent}
                    title="Reset to default"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Stats */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <div className="text-3xl font-bold text-gray-900">
                  {pages.length}
                </div>
                <div className="text-sm text-gray-600">Total Pages</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-3xl font-bold text-blue-900">
                  {pages.filter((p) => p.hasCustomContent).length}
                </div>
                <div className="text-sm text-blue-600">Customized</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-3xl font-bold text-green-900">
                  {pages.filter((p) => !p.hasCustomContent).length}
                </div>
                <div className="text-sm text-green-600">Default</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-3xl font-bold text-purple-900">
                  {Math.round(
                    (pages.filter((p) => p.hasCustomContent).length /
                      pages.length) *
                      100,
                  )}
                  %
                </div>
                <div className="text-sm text-purple-600">Completion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50">
          <CardHeader>
            <CardTitle>Quick Help</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>
              <strong>Edit:</strong> Opens the page with visual editor enabled
            </p>
            <p>
              <strong>View:</strong> Opens page in new tab for preview
            </p>
            <p>
              <strong>Export:</strong> Downloads page as HTML file or JSON
              backup
            </p>
            <p>
              <strong>Import:</strong> Restore page from JSON backup
            </p>
            <p>
              <strong>Reset:</strong> Removes custom content and restores
              default
            </p>
            <p className="mt-4 pt-4 border-t border-gray-300">
              <strong>Note:</strong> Pages marked with "Custom" badge have been
              edited. Export your pages regularly to backup your work!
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanel;
