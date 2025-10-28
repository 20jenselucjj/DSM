# Visual Editor Installation & Usage Guide

## 🎨 Overview

Your site now has a **complete Wix-like visual editor** powered by GrapesJS! You can drag and drop elements, resize components, edit text, change styles, and much more - all without coding.

## 📦 Installation

### Step 1: Install Dependencies

Run one of the following commands based on your package manager:

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Using bun:**
```bash
bun install
```

**Using pnpm:**
```bash
pnpm install
```

This will install all the required GrapesJS packages:
- `grapesjs` - Core visual editor
- `grapesjs-preset-webpage` - Webpage builder preset with common blocks
- `grapesjs-blocks-basic` - Basic building blocks (columns, text, images, etc.)
- `grapesjs-plugin-forms` - Form elements (inputs, buttons, selects, etc.)
- `grapesjs-navbar` - Navigation bar components
- `grapesjs-component-countdown` - Countdown timer components
- `grapesjs-plugin-export` - Export to HTML/CSS
- `grapesjs-tabs` - Tab components
- `grapesjs-custom-code` - Custom HTML/CSS/JS code blocks
- `grapesjs-tooltip` - Tooltip components
- `grapesjs-tui-image-editor` - Image editing capabilities
- `grapesjs-typed` - Typing animation effects
- `grapesjs-style-bg` - Advanced background styling

### Step 2: Start Development Server

```bash
npm run dev
```

## 🚀 Usage

### Enabling Visual Editor on Pages

I've already wrapped your **Index (Home) page** with the visual editor. To enable it on other pages:

1. Import the `EditablePageWrapper` component:
```tsx
import EditablePageWrapper from "@/components/EditablePageWrapper";
```

2. Wrap your page content:
```tsx
const YourPage = () => {
  return (
    <EditablePageWrapper pageId="unique-page-id" enableEdit={true}>
      {/* Your existing page content */}
    </EditablePageWrapper>
  );
};
```

### Example: Making the About Page Editable

```tsx
// src/pages/About.tsx
import EditablePageWrapper from "@/components/EditablePageWrapper";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const About = () => {
  return (
    <EditablePageWrapper pageId="about" enableEdit={true}>
      <div className="min-h-screen">
        <Header />
        <main>
          {/* Your about page content */}
        </main>
        <Footer />
      </div>
    </EditablePageWrapper>
  );
};

export default About;
```

## 🎯 Features

### 1. **Drag & Drop**
- Drag blocks from the left sidebar onto your page
- Rearrange elements by dragging them
- Drop elements into containers

### 2. **Pre-built Components**
- **Hero Section** - Eye-catching landing sections
- **Feature Cards** - Showcase features with icons
- **Call to Action** - Conversion-focused sections
- **Testimonials** - Customer reviews
- **Pricing Cards** - Product/service pricing
- **Contact Forms** - Get in touch forms
- **Footers** - Professional footer sections
- **Navigation Bars** - Header menus
- **Tabs** - Tabbed content
- **Countdown Timers** - Time-sensitive offers
- **And many more!**

### 3. **Responsive Design**
Click the device icons in the toolbar to preview:
- 🖥️ **Desktop** - Full-width view
- 📱 **Tablet** - 768px width
- 📱 **Mobile** - 320px width

### 4. **Style Editor**
Select any element and use the right sidebar to customize:
- **Typography** - Font, size, weight, color, alignment
- **Dimensions** - Width, height, margins, padding
- **Decorations** - Borders, shadows, backgrounds, opacity
- **Position** - Float, display, position (absolute, relative, etc.)
- **Flex** - Flexbox properties for layouts
- **Extra** - Transitions, transforms, animations

### 5. **Layer Manager**
- View all components in a hierarchical tree
- Show/hide elements
- Lock elements to prevent accidental changes
- Navigate complex structures easily

### 6. **Traits Panel**
Edit element attributes:
- IDs and Classes
- Links (href, target)
- Images (src, alt)
- Form attributes
- Custom attributes

### 7. **Code Editor**
Click the "Code" button to:
- View generated HTML/CSS
- Edit code directly
- Import existing HTML/CSS

### 8. **Export**
Click "Export" to download your page as a complete HTML file with embedded CSS.

### 9. **Auto-Save**
Your changes are automatically saved to browser's localStorage.

## 🎨 How to Use the Editor

### Starting the Editor

1. Navigate to any page with the editor enabled
2. Look for the **purple circular Edit button** in the bottom-right corner
3. Click it to open the visual editor

### Building Your Page

1. **Add Components:**
   - Browse blocks in the left sidebar
   - Click or drag a block onto the canvas
   - The block will be added to your page

2. **Edit Text:**
   - Double-click any text element
   - Type your content
   - Click outside to finish editing

3. **Style Elements:**
   - Single-click to select an element
   - Use the right sidebar to adjust styles
   - Changes apply instantly

4. **Move Elements:**
   - Click and drag elements to reposition
   - Drop into different containers
   - Use the layer manager for precise control

5. **Resize Elements:**
   - Select an element
   - Adjust width/height in the Dimensions section
   - Or use the style manager for responsive units

6. **Delete Elements:**
   - Select the element
   - Press Delete key or use the toolbar delete button

### Saving Your Work

1. Click the **"Save"** button in the top toolbar
2. Your changes are saved to localStorage
3. Refresh the page to see your changes live

### Resetting to Default

1. Click the small **"Reset"** button below the Edit button
2. Confirm you want to reset
3. The page returns to its original design

## 🔧 Advanced Customization

### Adding Custom Blocks

Edit `src/components/VisualEditor.tsx` and add new blocks:

```typescript
editor.BlockManager.add('my-custom-block', {
  label: 'My Custom Block',
  category: 'Custom',
  content: `
    <div style="padding: 20px; background: #f0f0f0;">
      <h2>Custom Block Title</h2>
      <p>Custom content here</p>
    </div>
  `,
});
```

### Customizing Styles

The editor styling can be customized in the `<style>` section at the bottom of `VisualEditor.tsx`.

### Changing Storage

By default, pages are saved to localStorage. To use a backend:

1. Modify the `handleSave` function in `EditablePageWrapper.tsx`
2. Send HTML/CSS to your API endpoint
3. Load saved content from your API in `useEffect`

Example with API:
```typescript
const handleSave = async (html: string, css: string) => {
  try {
    await fetch('/api/save-page', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pageId, html, css }),
    });
    alert('Page saved successfully!');
  } catch (error) {
    console.error('Save failed:', error);
    alert('Failed to save page');
  }
};
```

## 🎯 Tips & Tricks

1. **Use Layers Manager** - For complex layouts, the layer manager (right sidebar) makes it easy to select nested elements

2. **Mobile-First Design** - Build for mobile first, then adjust for larger screens using device preview

3. **Copy & Paste** - Select an element and use Ctrl+C / Ctrl+V to duplicate it

4. **Undo/Redo** - Use Ctrl+Z / Ctrl+Y (or Cmd on Mac)

5. **Fullscreen Mode** - Click the fullscreen icon in the toolbar for more space

6. **Custom Code** - Use the "Custom Code" block to add any HTML/CSS/JavaScript

7. **Symbols** - Create reusable components that update everywhere when changed

8. **View Borders** - Click the border icon to see element boundaries while editing

9. **Keyboard Shortcuts:**
   - `Delete` - Remove selected element
   - `Ctrl/Cmd + C` - Copy
   - `Ctrl/Cmd + V` - Paste
   - `Ctrl/Cmd + Z` - Undo
   - `Ctrl/Cmd + Shift + Z` - Redo
   - `Arrow Keys` - Move selected element

## 📱 Making All Pages Editable

To enable the visual editor on ALL your pages, wrap each page component:

```tsx
// src/pages/About.tsx
import EditablePageWrapper from "@/components/EditablePageWrapper";

const About = () => (
  <EditablePageWrapper pageId="about">
    {/* content */}
  </EditablePageWrapper>
);

// src/pages/ATPortal.tsx
const ATPortal = () => (
  <EditablePageWrapper pageId="at-portal">
    {/* content */}
  </EditablePageWrapper>
);

// src/pages/CoverageReport.tsx
const CoverageReport = () => (
  <EditablePageWrapper pageId="coverage-report">
    {/* content */}
  </EditablePageWrapper>
);

// And so on for each page...
```

**Important:** Each page must have a unique `pageId` to save content separately.

## 🔒 Production Considerations

### Disable Editing for Users

To disable the edit button in production:

```tsx
<EditablePageWrapper 
  pageId="home" 
  enableEdit={process.env.NODE_ENV === 'development'}
>
```

### Admin-Only Editing

Create an admin check:

```tsx
import { useAuth } from '@/hooks/useAuth';

const YourPage = () => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <EditablePageWrapper pageId="home" enableEdit={isAdmin}>
      {/* content */}
    </EditablePageWrapper>
  );
};
```

## 🐛 Troubleshooting

### Editor Not Loading
- Ensure all dependencies are installed: `npm install`
- Check browser console for errors
- Clear browser cache and localStorage

### Changes Not Saving
- Check browser console for errors
- Ensure localStorage is not disabled
- Try a different browser

### Styles Not Applying
- Make sure to click "Save" after making changes
- Check that CSS is not being overridden by global styles
- Use more specific selectors if needed

### Components Disappearing
- Check the Layers Manager - element might be hidden
- Look for z-index issues
- Ensure element has content and dimensions

## 📚 Resources

- [GrapesJS Documentation](https://grapesjs.com/docs/)
- [GrapesJS GitHub](https://github.com/GrapesJS/grapesjs)
- [Plugin List](https://grapesjs.com/docs/plugins/)
- [API Reference](https://grapesjs.com/docs/api/)
- [Community Forum](https://github.com/GrapesJS/grapesjs/discussions)

## 🎉 You're Ready!

Your site now has professional-grade visual editing capabilities. Start building amazing pages without writing a single line of code!

**Need help?** Check the GrapesJS documentation or the troubleshooting section above.

**Happy Building! 🚀**