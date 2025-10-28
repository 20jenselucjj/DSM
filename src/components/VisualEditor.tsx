import { useEffect, useRef, useState } from 'react';
import grapesjs, { Editor } from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import gjsPresetWebpage from 'grapesjs-preset-webpage';
import gjsBlocksBasic from 'grapesjs-blocks-basic';
import gjsPluginForms from 'grapesjs-plugin-forms';
import gjsNavbar from 'grapesjs-navbar';
import gjsCountdown from 'grapesjs-component-countdown';
import gjsExport from 'grapesjs-plugin-export';
import gjsTabs from 'grapesjs-tabs';
import gjsCustomCode from 'grapesjs-custom-code';
import gjsTooltip from 'grapesjs-tooltip';
import gjsTyped from 'grapesjs-typed';
import gjsStyleBg from 'grapesjs-style-bg';
import { Button } from '@/components/ui/button';
import { Save, Eye, Code, Download, Upload, X } from 'lucide-react';

interface VisualEditorProps {
  initialHtml?: string;
  initialCss?: string;
  onSave?: (html: string, css: string) => void;
  onClose?: () => void;
}

const VisualEditor = ({
  initialHtml = '',
  initialCss = '',
  onSave,
  onClose
}: VisualEditorProps) => {
  const editorRef = useRef<Editor | null>(null);
  const [isPreview, setIsPreview] = useState(false);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = grapesjs.init({
        container: '#gjs-editor',
        height: '100vh',
        width: 'auto',
        storageManager: {
          type: 'local',
          autosave: true,
          autoload: true,
          stepsBeforeSave: 1,
        },
        deviceManager: {
          devices: [
            {
              name: 'Desktop',
              width: '',
            },
            {
              name: 'Tablet',
              width: '768px',
              widthMedia: '992px',
            },
            {
              name: 'Mobile',
              width: '320px',
              widthMedia: '480px',
            },
          ],
        },
        plugins: [
          gjsPresetWebpage,
          gjsBlocksBasic,
          gjsPluginForms,
          gjsNavbar,
          gjsCountdown,
          gjsExport,
          gjsTabs,
          gjsCustomCode,
          gjsTooltip,
          gjsTyped,
          gjsStyleBg,
        ],
        pluginsOpts: {
          [gjsPresetWebpage as any]: {
            modalImportTitle: 'Import Template',
            modalImportLabel: '<div style="margin-bottom: 10px; font-size: 13px;">Paste here your HTML/CSS and click Import</div>',
            modalImportContent: function(editor: Editor) {
              return editor.getHtml() + '<style>' + editor.getCss() + '</style>';
            },
            filestackOpts: null,
            aviaryOpts: false,
            blocksBasicOpts: { flexGrid: true },
            customStyleManager: [],
          },
          [gjsBlocksBasic as any]: {
            blocks: ['column1', 'column2', 'column3', 'column3-7', 'text', 'link', 'image', 'video', 'map'],
            flexGrid: true,
            stylePrefix: 'gjs-',
          },
          [gjsPluginForms as any]: {
            blocks: ['form', 'input', 'textarea', 'select', 'button', 'label', 'checkbox', 'radio'],
          },
          [gjsNavbar as any]: {},
          [gjsCountdown as any]: {},
          [gjsExport as any]: {
            addExportBtn: true,
            btnLabel: 'Export to ZIP',
            preHtml: '<!DOCTYPE html><html lang="en">',
            postHtml: '</html>',
            preStyle: '<style>',
            postStyle: '</style>',
          },
          [gjsTabs as any]: {},
          [gjsCustomCode as any]: {},
          [gjsTooltip as any]: {},
          [gjsTyped as any]: {},
          [gjsStyleBg as any]: {},
        },
        canvas: {
          styles: [
            'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&display=swap',
          ],
          scripts: [],
        },
        assetManager: {
          uploadText: 'Drop files here or click to upload',
          addBtnText: 'Add Image',
          upload: false,
          autoAdd: true,
        },
        styleManager: {
          sectors: [
            {
              name: 'General',
              open: true,
              buildProps: ['float', 'display', 'position', 'top', 'right', 'left', 'bottom'],
            },
            {
              name: 'Dimension',
              open: false,
              buildProps: ['width', 'height', 'max-width', 'min-height', 'margin', 'padding'],
            },
            {
              name: 'Typography',
              open: false,
              buildProps: [
                'font-family',
                'font-size',
                'font-weight',
                'letter-spacing',
                'color',
                'line-height',
                'text-align',
                'text-decoration',
                'text-shadow',
              ],
            },
            {
              name: 'Decorations',
              open: false,
              buildProps: [
                'opacity',
                'border-radius',
                'border',
                'box-shadow',
                'background-color',
                'background',
              ],
            },
            {
              name: 'Extra',
              open: false,
              buildProps: ['transition', 'perspective', 'transform'],
            },
            {
              name: 'Flex',
              open: false,
              buildProps: [
                'flex-direction',
                'flex-wrap',
                'justify-content',
                'align-items',
                'align-content',
                'order',
                'flex-basis',
                'flex-grow',
                'flex-shrink',
                'align-self',
              ],
            },
          ],
        },
        blockManager: {
          appendTo: '#blocks',
        },
        layerManager: {
          appendTo: '#layers-container',
        },
        traitManager: {
          appendTo: '#trait-container',
        },
        selectorManager: {
          appendTo: '#styles-container',
        },
        panels: {
          defaults: [
            {
              id: 'basic-actions',
              el: '.panel__basic-actions',
              buttons: [
                {
                  id: 'visibility',
                  active: true,
                  className: 'btn-toggle-borders',
                  label: '<i class="fa fa-clone"></i>',
                  command: 'sw-visibility',
                },
                {
                  id: 'fullscreen',
                  command: 'fullscreen',
                  className: 'btn-fullscreen',
                  label: '<i class="fa fa-arrows-alt"></i>',
                },
              ],
            },
            {
              id: 'panel-devices',
              el: '.panel__devices',
              buttons: [
                {
                  id: 'device-desktop',
                  label: '<i class="fa fa-desktop"></i>',
                  command: 'set-device-desktop',
                  active: true,
                  togglable: false,
                },
                {
                  id: 'device-tablet',
                  label: '<i class="fa fa-tablet"></i>',
                  command: 'set-device-tablet',
                  togglable: false,
                },
                {
                  id: 'device-mobile',
                  label: '<i class="fa fa-mobile"></i>',
                  command: 'set-device-mobile',
                  togglable: false,
                },
              ],
            },
          ],
        },
      });

      // Add custom commands
      editor.Commands.add('set-device-desktop', {
        run: (editor) => editor.setDevice('Desktop'),
      });
      editor.Commands.add('set-device-tablet', {
        run: (editor) => editor.setDevice('Tablet'),
      });
      editor.Commands.add('set-device-mobile', {
        run: (editor) => editor.setDevice('Mobile'),
      });

      // Load initial content
      if (initialHtml) {
        editor.setComponents(initialHtml);
      }
      if (initialCss) {
        editor.setStyle(initialCss);
      }

      // Add custom blocks
      editor.BlockManager.add('hero-section', {
        label: 'Hero Section',
        category: 'Custom',
        content: `
          <section style="padding: 100px 20px; text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white;">
            <h1 style="font-size: 48px; margin-bottom: 20px; font-weight: bold;">Welcome to Your Site</h1>
            <p style="font-size: 20px; margin-bottom: 30px;">Create amazing experiences with drag and drop</p>
            <a href="#" style="background: white; color: #667eea; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Get Started</a>
          </section>
        `,
      });

      editor.BlockManager.add('feature-card', {
        label: 'Feature Card',
        category: 'Custom',
        content: `
          <div style="padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px; text-align: center; background: white; margin: 20px;">
            <div style="width: 60px; height: 60px; background: #667eea; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">★</div>
            <h3 style="font-size: 24px; margin-bottom: 15px;">Feature Title</h3>
            <p style="color: #666; line-height: 1.6;">Description of your amazing feature goes here. Edit this text to customize.</p>
          </div>
        `,
      });

      editor.BlockManager.add('cta-section', {
        label: 'Call to Action',
        category: 'Custom',
        content: `
          <section style="padding: 80px 20px; text-align: center; background: #f8f9fa;">
            <h2 style="font-size: 36px; margin-bottom: 20px; color: #333;">Ready to Get Started?</h2>
            <p style="font-size: 18px; color: #666; margin-bottom: 30px;">Join thousands of satisfied customers today</p>
            <a href="#" style="background: #667eea; color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">Start Now</a>
          </section>
        `,
      });

      editor.BlockManager.add('testimonial', {
        label: 'Testimonial',
        category: 'Custom',
        content: `
          <div style="padding: 40px; background: white; border-left: 4px solid #667eea; margin: 20px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            <p style="font-size: 18px; font-style: italic; color: #333; margin-bottom: 20px;">"This is an amazing product! It has completely transformed the way we work."</p>
            <div style="display: flex; align-items: center;">
              <div style="width: 50px; height: 50px; background: #667eea; border-radius: 50%; margin-right: 15px;"></div>
              <div>
                <strong style="display: block; color: #333;">John Doe</strong>
                <span style="color: #666; font-size: 14px;">CEO, Company Name</span>
              </div>
            </div>
          </div>
        `,
      });

      editor.BlockManager.add('pricing-card', {
        label: 'Pricing Card',
        category: 'Custom',
        content: `
          <div style="padding: 40px; border: 2px solid #e0e0e0; border-radius: 10px; text-align: center; background: white; margin: 20px; transition: transform 0.3s;">
            <h3 style="font-size: 24px; margin-bottom: 10px; color: #333;">Basic Plan</h3>
            <div style="font-size: 48px; font-weight: bold; color: #667eea; margin: 20px 0;">$29<span style="font-size: 18px; color: #666;">/mo</span></div>
            <ul style="list-style: none; padding: 0; margin: 20px 0; text-align: left;">
              <li style="padding: 10px; border-bottom: 1px solid #f0f0f0;">✓ Feature 1</li>
              <li style="padding: 10px; border-bottom: 1px solid #f0f0f0;">✓ Feature 2</li>
              <li style="padding: 10px; border-bottom: 1px solid #f0f0f0;">✓ Feature 3</li>
            </ul>
            <a href="#" style="background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block; margin-top: 20px;">Choose Plan</a>
          </div>
        `,
      });

      editor.BlockManager.add('contact-form', {
        label: 'Contact Form',
        category: 'Custom',
        content: `
          <form style="max-width: 600px; margin: 40px auto; padding: 40px; background: white; border-radius: 10px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
            <h2 style="margin-bottom: 30px; color: #333; text-align: center;">Get In Touch</h2>
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Name</label>
              <input type="text" placeholder="Your name" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;" />
            </div>
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Email</label>
              <input type="email" placeholder="your@email.com" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px;" />
            </div>
            <div style="margin-bottom: 20px;">
              <label style="display: block; margin-bottom: 8px; color: #333; font-weight: 500;">Message</label>
              <textarea placeholder="Your message" style="width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 5px; font-size: 16px; min-height: 120px;"></textarea>
            </div>
            <button type="submit" style="background: #667eea; color: white; padding: 14px 40px; border: none; border-radius: 5px; font-weight: bold; font-size: 16px; cursor: pointer; width: 100%;">Send Message</button>
          </form>
        `,
      });

      editor.BlockManager.add('footer', {
        label: 'Footer',
        category: 'Custom',
        content: `
          <footer style="background: #2c3e50; color: white; padding: 60px 20px 20px;">
            <div style="max-width: 1200px; margin: 0 auto; display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 40px; margin-bottom: 40px;">
              <div>
                <h4 style="font-size: 20px; margin-bottom: 20px;">Company</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">About Us</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">Careers</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">Contact</a></li>
                </ul>
              </div>
              <div>
                <h4 style="font-size: 20px; margin-bottom: 20px;">Products</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">Features</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">Pricing</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">API</a></li>
                </ul>
              </div>
              <div>
                <h4 style="font-size: 20px; margin-bottom: 20px;">Resources</h4>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">Blog</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">Documentation</a></li>
                  <li style="margin-bottom: 10px;"><a href="#" style="color: #bbb; text-decoration: none;">Support</a></li>
                </ul>
              </div>
            </div>
            <div style="text-align: center; padding-top: 20px; border-top: 1px solid #445566; color: #bbb;">
              <p>© 2024 Your Company. All rights reserved.</p>
            </div>
          </footer>
        `,
      });

      editorRef.current = editor;
    }

    return () => {
      // Cleanup if needed
    };
  }, [initialHtml, initialCss]);

  const handleSave = () => {
    if (editorRef.current && onSave) {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();
      onSave(html, css);
    }
  };

  const handlePreview = () => {
    if (editorRef.current) {
      const command = isPreview ? 'preview' : 'preview';
      editorRef.current.runCommand(command);
      setIsPreview(!isPreview);
    }
  };

  const handleExport = () => {
    if (editorRef.current) {
      const html = editorRef.current.getHtml();
      const css = editorRef.current.getCss();
      const fullHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Exported Page</title>
  <style>${css}</style>
</head>
<body>
${html}
</body>
</html>
      `;

      const blob = new Blob([fullHtml], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'page.html';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleViewCode = () => {
    if (editorRef.current) {
      editorRef.current.runCommand('open-code');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Top Toolbar */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-900 text-white border-b border-gray-700">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold">Visual Editor</h2>
          <span className="text-sm text-gray-400">- Drag and drop to build your page</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="panel__devices"></div>
          <div className="panel__basic-actions"></div>

          <Button
            onClick={handleViewCode}
            size="sm"
            variant="outline"
            className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
          >
            <Code className="w-4 h-4 mr-2" />
            Code
          </Button>

          <Button
            onClick={handlePreview}
            size="sm"
            variant="outline"
            className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>

          <Button
            onClick={handleExport}
            size="sm"
            variant="outline"
            className="bg-transparent border-gray-600 text-white hover:bg-gray-800"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>

          <Button
            onClick={handleSave}
            size="sm"
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>

          {onClose && (
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="text-white hover:bg-gray-800"
            >
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Editor Layout */}
      <div className="flex h-[calc(100vh-53px)]">
        {/* Left Sidebar - Blocks */}
        <div className="w-64 bg-gray-100 border-r border-gray-300 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-gray-700">Blocks</h3>
            <div id="blocks"></div>
          </div>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <div id="gjs-editor"></div>
        </div>

        {/* Right Sidebar - Settings */}
        <div className="w-80 bg-gray-100 border-l border-gray-300 overflow-y-auto">
          <div className="p-4">
            <h3 className="font-semibold mb-3 text-gray-700">Layers</h3>
            <div id="layers-container" className="mb-6"></div>

            <h3 className="font-semibold mb-3 text-gray-700">Styles</h3>
            <div id="styles-container" className="mb-6"></div>

            <h3 className="font-semibold mb-3 text-gray-700">Traits</h3>
            <div id="trait-container"></div>
          </div>
        </div>
      </div>

      <style>{`
        #gjs-editor {
          height: 100%;
          overflow: hidden;
        }

        .gjs-one-bg {
          background-color: #ffffff;
        }

        .gjs-two-color {
          color: #1f2937;
        }

        .gjs-three-bg {
          background-color: #f3f4f6;
        }

        .gjs-four-color {
          color: #374151;
        }

        .gjs-block {
          width: 100%;
          min-height: 80px;
          padding: 10px;
          margin: 8px 0;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .gjs-block:hover {
          background: #f9fafb;
          border-color: #667eea;
          transform: translateY(-2px);
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .gjs-block-label {
          font-size: 13px;
          font-weight: 500;
          color: #374151;
        }

        .gjs-category-title {
          font-weight: 600;
          padding: 10px 0;
          color: #1f2937;
          border-bottom: 2px solid #667eea;
          margin-bottom: 10px;
        }

        .gjs-block svg, .gjs-block img {
          width: 100%;
          height: auto;
          max-height: 50px;
          object-fit: contain;
        }

        /* Canvas styling */
        .gjs-cv-canvas {
          background-color: #ffffff;
          width: 100%;
          height: 100%;
        }

        .gjs-frame {
          border: none;
        }

        /* Toolbar buttons */
        .gjs-toolbar {
          background: #667eea;
          border-radius: 4px;
        }

        .gjs-toolbar-item {
          color: white;
        }

        /* Component selected state */
        .gjs-selected {
          outline: 2px solid #667eea !important;
        }

        /* Panel buttons */
        .panel__basic-actions button,
        .panel__devices button {
          background: transparent;
          border: 1px solid #4b5563;
          color: white;
          padding: 8px 12px;
          margin: 0 4px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
        }

        .panel__basic-actions button:hover,
        .panel__devices button:hover {
          background: #374151;
        }

        .panel__devices button.gjs-pn-active {
          background: #667eea;
          border-color: #667eea;
        }

        /* Trait and Style Manager */
        .gjs-traits-label,
        .gjs-sm-sector-title {
          font-weight: 600;
          color: #1f2937;
          padding: 8px 0;
        }

        .gjs-field {
          background: white;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          padding: 6px 10px;
          width: 100%;
        }

        .gjs-field:focus {
          outline: none;
          border-color: #667eea;
          box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }

        /* Layer Manager */
        .gjs-layer {
          background: white;
          margin: 4px 0;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }

        .gjs-layer:hover {
          background: #f9fafb;
        }

        .gjs-layer.gjs-selected {
          background: #ede9fe;
          border-color: #667eea;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #555;
        }
      `}</style>
    </div>
  );
};

export default VisualEditor;
