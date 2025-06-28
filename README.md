<img height="100" src="https://hero-canvas.vercel.app/icons/splash.png">

# Hero Canvas


## Frontend
- **Technologies**: React with TypeScript, Fabric.js
![FrontEnd](https://skillicons.dev/icons?i=react,ts&perline=5) <img height="50" src="https://i.postimg.cc/TPBj9PVX/image.png">

## Backend
- **Technologies**: Node.js, PostgreSQL (hosted on NHost)
![FrontEnd](https://skillicons.dev/icons?i=nodejs,express,postgresql&perline=5)

## Implemented Features

### General Features
1. **Canvas Creation**: Users can create canvases in various sizes (e.g., Logo, A4 Portrait, Reels).
[![image.png](https://i.postimg.cc/jqD0235w/image.png)](https://postimg.cc/grbBBD3m)
2. **Canvas Storage**: Created canvases are automatically saved to the database, allowing users to view their own canvases.
3. **Canvas Publishing**: Users can publish their canvases, making them accessible to all users.
4. **Template Management**: Templates are displayed in a masonry grid view with a search feature for easy discovery.
[![image.png](https://i.postimg.cc/d1XfGv17/image.png)](https://postimg.cc/9Rd1j6yV)

---
### Editor Features
1. **Canvas Rendering**: Smooth rendering of canvases in different sizes with comprehensive zoom controls.
2. **Canvas Customization**: Ability to change canvas background color.
3. **Element Opacity**: Control opacity for any element on the canvas.
4. **Context Menu**: Right-click context menu provides:
   - Undo, Redo
   - Copy, Paste elements
   - Duplicate elements
   - Layer control (Bring Forward, Send Backward)
   - Reset zoom
   - Set/Remove Background
<img src="https://i.postimg.cc/9XbVwwPK/Screenshot-2025-06-28-091121.png">
5. **Sidebar Features**:
   - **Image Uploading**: Users can upload images, stored in the cloud and accessible to all users.
   - **Textbox**: Add textboxes with editing options, including bold, italic, underline, color, font family, and font size.
   - **Shapes**: Access a library of SVG shapes and upload custom SVG (string) shapes. Shape options include fill color, stroke color, and stroke width. Shapes can be searched and filtered by category.
   - **AI Integration**: Utilizes Gemini Flash 2.0 for image generation based on prompts with customizable image ratios. A Hugging Face model removes backgrounds from generated images, which can be added to the canvas or downloaded.
   [![Screenshot-2025-06-28-091213.png](https://i.postimg.cc/L60pNdbV/Screenshot-2025-06-28-091213.png)](https://postimg.cc/hfx6tYgJ)

6. **Export Options**: Export canvases in JPG and PNG formats with selectable quality and resolution.

[![image.png](https://i.postimg.cc/Pf39kWQX/image.png)](https://postimg.cc/WtZXGJyC)

7. **Save Functionality**: Save entire canvas as a template in the database. Users can choose to make templates public, adding tags and descriptions for efficient searchability. 

[![image.png](https://i.postimg.cc/Px63THZ3/image.png)](https://postimg.cc/KkMrDd0B)
---
## Features to Be Implemented
1. Image cropping
2. Image clipping
3. Image filtering
4. Text effects: shadow, glow, text background, gradient
5. Real-time saving to the database to preserve editing state
6. Multipage canvas support
7. Export in GIF and PDF formats

---
## Features to Be Enhanced
1. Upgrade the image generation model
2. Host a proprietary machine learning model for background removal