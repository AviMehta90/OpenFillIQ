# Generate Extension Icons

Since we don't have icons yet, here are several ways to create placeholder icons for development:

## Option 1: Online Generator (Quickest)

Visit: https://www.favicon-generator.org/ or https://realfavicongenerator.net/

1. Upload any image or create a simple design
2. Generate icons in multiple sizes
3. Download and extract to `public/icons/`
4. Rename files to:
   - `icon-16.png`
   - `icon-32.png`
   - `icon-48.png`
   - `icon-128.png`

## Option 2: Use Placeholder Service

Use URLs from placeholder.com and download:

```bash
cd public/icons/

# Download placeholder icons (requires curl)
curl "https://via.placeholder.com/16x16/667eea/ffffff?text=O" -o icon-16.png
curl "https://via.placeholder.com/32x32/667eea/ffffff?text=O" -o icon-32.png
curl "https://via.placeholder.com/48x48/667eea/ffffff?text=O" -o icon-48.png
curl "https://via.placeholder.com/128x128/667eea/ffffff?text=O" -o icon-128.png
```

## Option 3: Design with Figma/Photoshop

1. Create a new artboard with dimensions: 128x128px
2. Design your icon (consider form/document + lightning/brain iconography)
3. Export at 1x, 2x for different sizes
4. Save as PNG with transparent background

## Option 4: Use Free Icon Resources

Download from:

- [Flaticon](https://www.flaticon.com/)
- [Icons8](https://icons8.com/)
- [Iconfinder](https://www.iconfinder.com/)

Search for keywords: "form", "document", "autofill", "lightning"

## Icon Design Guidelines

- **Simple & Recognizable**: Clear at small sizes (16x16)
- **Consistent Style**: Flat design works best
- **Brand Colors**: Use purple gradient (#667eea to #764ba2)
- **Transparent Background**: PNG format required
- **Concept Ideas**:
  - Document with checkmark
  - Form with lightning bolt
  - Clipboard with sparkles
  - "F" letter stylized

## Temporary Solution

For immediate development, you can use any square PNG images and rename them. The extension will still work, you just won't have a nice icon.

## Final Icons

Before publishing to Chrome Web Store, you'll need professional icons. Consider hiring a designer or using:

- Fiverr
- Upwork
- 99designs

Estimated cost: $20-$100 for a professional icon set.
