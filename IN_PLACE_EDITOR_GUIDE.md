# 🎯 In-Place Editor Guide - Edit Your Existing Site Directly

## ✨ Overview

The **In-Place Editor** lets you edit your **existing website content** directly! Click any text, heading, button, or section and instantly modify:
- Text content
- Font size, weight, and family
- Colors (text and background)
- Spacing, alignment, and styling
- All visual properties

This is perfect for quick edits to your existing pages without rebuilding from scratch.

## 🚀 Quick Start

### 1. Open the Editor

1. Navigate to any page on your site
2. Click the **purple Settings button** (⚙️) in the bottom-right corner
3. Select **"Quick Edit"** from the dropdown menu
4. The in-place editor activates!

### 2. Edit Content

1. **Hover** over any text element - it will highlight in blue
2. **Click** the element to select it - it turns purple
3. **Type** to edit the text content directly
4. Use the **side panel** to adjust styles

### 3. Save Changes

1. Click **"Save Changes"** button in the top toolbar
2. Your edits are saved to localStorage
3. Refresh to see changes persist!

## 🎨 What You Can Edit

### Editable Elements
✅ **Headings** - H1, H2, H3, H4, H5, H6
✅ **Paragraphs** - All text blocks
✅ **Buttons** - Button text and styles
✅ **Links** - Link text and appearance
✅ **Spans** - Inline text elements
✅ **Divs** - Container elements
✅ **Sections** - Large page sections
✅ **List items** - Li elements
✅ **Labels** - Form labels
✅ **Table cells** - TD, TH elements

### Example: Editing Your Hero Section

Your hero heading says:
```
QUALITY MEDICAL
COVERAGE AND
TRUSTED CARE
FOR ATHLETES,
TEAMS, AND
EVENTS
```

**To edit it:**
1. Click the Settings button (⚙️)
2. Choose "Quick Edit"
3. Click the large heading
4. The side panel appears with controls
5. Adjust **Font Size** slider to make it bigger/smaller
6. Change **Font Weight** to make it bolder
7. Pick a new **Text Color** if desired
8. Click **Save Changes**

## 🛠️ Style Controls

When you select an element, the side panel shows these controls:

### Typography
- **Font Size** (8px - 120px)
  - Use slider to adjust
  - Perfect for headlines vs body text

- **Font Weight** (Light to Black)
  - Light (300)
  - Normal (400)
  - Medium (500)
  - Semi Bold (600)
  - Bold (700)
  - Extra Bold (800)
  - Black (900)

### Colors
- **Text Color**
  - Color picker for visual selection
  - Hex input for precise colors
  - Applies to text content

- **Background Color**
  - Color picker
  - Hex input
  - Changes element background

### Text Alignment
- **Left** - Align text left
- **Center** - Center text
- **Right** - Align text right

### Text Style
- **Italic** - Toggle italic style
- **Underline** - Toggle underline

### Spacing
- **Letter Spacing** (-5px to 20px)
  - Adjust space between letters
  - Negative values bring letters closer
  - Positive values spread them apart

- **Line Height** (0.5 to 3)
  - Adjust vertical space between lines
  - Lower = tighter spacing
  - Higher = more breathing room

### Visual
- **Border Radius** (0px - 50px)
  - Round corners of elements
  - Great for buttons and cards

## 📋 Common Use Cases

### Change Headline Size
1. Click the Settings button → Quick Edit
2. Click your headline (e.g., "QUALITY MEDICAL COVERAGE...")
3. Adjust **Font Size** slider
4. Adjust **Font Weight** if needed
5. Save

### Change Text Colors
1. Enter Quick Edit mode
2. Click any text element
3. Click the **Text Color** color picker
4. Choose your color
5. Save

### Update Button Text
1. Quick Edit mode
2. Click the button
3. Type new text directly
4. Adjust button styles (background, padding, etc.)
5. Save

### Center a Heading
1. Quick Edit mode
2. Click heading
3. Click the **Center** alignment button
4. Save

### Make Text Bold
1. Quick Edit mode
2. Click text element
3. Change **Font Weight** to Bold (700) or higher
4. Save

### Adjust Line Spacing
1. Quick Edit mode
2. Click paragraph or text block
3. Adjust **Line Height** slider
4. See changes in real-time
5. Save

## 🎯 Tips & Tricks

### 1. Hover to Locate
- Move your mouse around to see what's editable
- Blue highlight shows hoverable elements
- Purple highlight shows selected element

### 2. Click Carefully
- Click directly on the text you want to edit
- If you select the wrong element, click the × in the purple overlay

### 3. Real-Time Preview
- All changes happen instantly
- You see exactly what you get
- No need to preview - it's already live!

### 4. Deselect Before Selecting New
- Click the × on the purple overlay to deselect
- Or click directly on another element

### 5. Save Often
- Changes only persist after clicking "Save Changes"
- Browser refresh without saving will lose edits
- Save button is in the top toolbar

### 6. Use Color Hex Codes
- If you have a brand color, enter the hex code directly
- Example: #667eea for purple
- More precise than color picker

### 7. Test Responsive
- Edit on desktop
- Check on mobile/tablet
- Some styles may need adjustment per device

## 🔄 Two Editor Modes

Your site now has **TWO editing options**:

### 1. Quick Edit (In-Place Editor)
**Use for:**
- Changing text content
- Adjusting font sizes
- Tweaking colors
- Quick style changes
- Editing existing layout

**Best when:**
- You like your layout
- Just need content/style updates
- Want fast edits

### 2. Page Builder (Full Editor)
**Use for:**
- Complete page redesigns
- Adding new sections
- Drag & drop components
- Building from scratch
- Major layout changes

**Best when:**
- Creating new pages
- Major redesigns
- Adding complex components
- Building landing pages

### Switching Between Modes

Click the Settings button (⚙️) and choose:
- **"Quick Edit"** = In-Place Editor
- **"Page Builder"** = Full GrapesJS Editor

## 💾 Saving & Storage

### How Changes Are Saved

**In-Place Editor:**
- Saves to `localStorage`
- Key: `in-place-editor-changes-${pageId}`
- Stores: content + styles for each element
- Per-page storage

**Page Builder:**
- Separate storage
- Key: `page-content-${pageId}`
- Stores: complete HTML + CSS

**Both can coexist!**
- Quick edits override page builder content
- Each saved independently
- Reset removes both

### Viewing Saved Data

Open browser DevTools → Application → Local Storage:
- `in-place-editor-changes-home` - Home page quick edits
- `page-content-home` - Home page full rebuild

### Exporting Changes

Currently saved to localStorage. To export:
1. Open browser DevTools
2. Console tab
3. Type: `localStorage.getItem('in-place-editor-changes-home')`
4. Copy the JSON output
5. Save to file for backup

### Backend Integration (Optional)

To save to your server instead:

Edit `src/components/InPlaceEditor.tsx`, find `handleSave`:

```typescript
const handleSave = async () => {
  const changesArray = Array.from(changes.entries()).map(([element, data]) => ({
    selector: getElementSelector(element),
    content: element.innerHTML,
    styles: element.style.cssText,
  }));

  // Send to your API
  await fetch('/api/save-page-edits', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ pageId, changes: changesArray })
  });

  alert('Changes saved!');
};
```

## 🔒 Access Control

### Current Setup
Editor enabled in development only:
```typescript
const enableEditing = import.meta.env.DEV;
```

### Production Options

**Option 1: Disable in Production**
```typescript
// Keep current - only works in dev mode
const enableEditing = import.meta.env.DEV;
```

**Option 2: Admin Only**
```typescript
const { user } = useAuth();
const enableEditing = user?.role === 'admin';
```

**Option 3: Password Protected**
```typescript
const [unlocked, setUnlocked] = useState(false);
const enableEditing = unlocked;

// Show password prompt before enabling
```

## 🐛 Troubleshooting

### Editor Button Not Showing
**Problem:** No Settings button visible
**Solutions:**
- Ensure `enableEdit={true}` on EditablePageWrapper
- Check `enableEditing` variable in App.tsx
- Clear browser cache
- Check console for errors

### Can't Click Element
**Problem:** Element not selectable
**Solutions:**
- Try clicking directly on text
- Element may not be in editable selectors list
- Check if element is inside iframe
- Try clicking parent element

### Changes Not Saving
**Problem:** Click save but changes lost on refresh
**Solutions:**
- Ensure localStorage is enabled
- Not in private/incognito mode
- Check localStorage quota
- Check browser console for errors

### Styles Not Applying
**Problem:** Style changes don't take effect
**Solutions:**
- Check for CSS specificity issues
- More specific styles may override
- Try using !important (in code)
- Check for conflicting global styles

### Can't See Side Panel
**Problem:** Selected but no controls
**Solutions:**
- Scroll right - panel is fixed right side
- Browser window may be too narrow
- Try fullscreen browser
- Check z-index conflicts

### Element Jumps or Moves
**Problem:** Element position changes when selecting
**Solutions:**
- This is the overlay, not the element moving
- The element stays in place
- Overlay is visual only

### Wrong Element Selected
**Problem:** Clicking selects parent/child instead
**Solutions:**
- Click the × to deselect
- Click more precisely on desired element
- Try clicking several times
- Use browser DevTools to inspect

## 📚 Advanced Usage

### Custom Element Selectors

To make additional elements editable, edit `InPlaceEditor.tsx`:

```typescript
const editableSelectors = [
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'p', 'span', 'a', 'button',
  'div', 'section', 'article',
  'li', 'td', 'th', 'label',
  // Add your custom selectors:
  '.my-custom-class',
  '#my-custom-id',
  '[data-editable]'
].join(',');
```

### Add More Style Controls

Add new controls in the side panel section of `InPlaceEditor.tsx`:

```typescript
{/* Custom control */}
<div className="space-y-2">
  <Label>Text Transform</Label>
  <Select
    value={elementStyles.textTransform}
    onValueChange={(value) => updateStyle('textTransform', value)}
  >
    <SelectTrigger><SelectValue /></SelectTrigger>
    <SelectContent>
      <SelectItem value="none">None</SelectItem>
      <SelectItem value="uppercase">UPPERCASE</SelectItem>
      <SelectItem value="lowercase">lowercase</SelectItem>
      <SelectItem value="capitalize">Capitalize</SelectItem>
    </SelectContent>
  </Select>
</div>
```

### Preserve Changes Across Builds

Changes are stored in localStorage by default. To persist:

1. **Export before build:**
   - Get localStorage values
   - Save to JSON files

2. **Commit to CSS:**
   - Copy generated styles
   - Add to your CSS file
   - Remove localStorage dependency

3. **Use Backend:**
   - Save to database
   - Load from API on page load
   - See Backend Integration section

## 🎓 Real-World Examples

### Example 1: Update Hero Heading
**Goal:** Make "QUALITY MEDICAL COVERAGE..." bigger and bolder

**Steps:**
1. Click Settings → Quick Edit
2. Click the hero heading
3. Font Size slider → increase to 60px
4. Font Weight → Bold (700)
5. Letter Spacing → increase to 0.15em
6. Click "Save Changes"
7. Refresh page - changes persist!

### Example 2: Change Button Colors
**Goal:** Update "LEARN MORE HERE" button

**Steps:**
1. Quick Edit mode
2. Click the button
3. Text Color → Change to white (#ffffff)
4. Background Color → Change to blue (#667eea)
5. Border Radius → 25px for more rounded
6. Save Changes

### Example 3: Adjust Testimonial Text
**Goal:** Make testimonial text more readable

**Steps:**
1. Quick Edit mode
2. Click testimonial paragraph
3. Font Size → increase to 18px
4. Line Height → increase to 1.8
5. Letter Spacing → increase to 0.5px
6. Save Changes

### Example 4: Update Footer Links
**Goal:** Change footer link colors

**Steps:**
1. Quick Edit mode
2. Click each footer link
3. Text Color → your brand color
4. Font Weight → Medium (500)
5. Save after each link

## 🚀 Workflow Best Practices

### 1. Plan Before Editing
- Know what you want to change
- Have colors/sizes ready
- Take screenshots of original

### 2. Edit in Logical Order
- Top to bottom
- Header → Hero → Content → Footer
- Group similar changes

### 3. Save Frequently
- Save after each major change
- Don't do too much before saving
- Prevents losing work

### 4. Test on Multiple Devices
- Edit on desktop
- View on mobile
- Adjust if needed
- Some sizes may need tweaking

### 5. Keep Backups
- Export localStorage data
- Take screenshots
- Note hex colors used
- Document major changes

### 6. Use Consistent Styles
- Same font sizes for headers
- Consistent spacing
- Brand colors throughout
- Professional appearance

## 🎉 You're Ready!

The In-Place Editor gives you:
- ✅ Direct editing of existing content
- ✅ Real-time visual feedback
- ✅ Easy style adjustments
- ✅ No coding required
- ✅ Fast workflow

**Start editing your site content now!**

Click the Settings button → Quick Edit → Click any text → Make it awesome!

---

**Need more power?** Try the Page Builder (Full Editor) for complete page redesigns!

**Questions?** See the other documentation files or check browser console for errors.

**Happy Editing! 🎨✨**