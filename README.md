# My Notes Web Page

A powerful, feature-rich web application combining drag-and-drop sticky notes with a full-featured text editor. Built to meet comprehensive Software Requirements Specifications with modern design and premium user experience.

## 🌟 Features

### Sticky Notes
- **Drag & Drop**: Freely position notes anywhere on the canvas
- **Auto-Save**: Automatic saving of content and position to database
- **Color Customization**: 6 beautiful color themes (Yellow, Pink, Blue, Green, Purple, Orange)
- **Auto-Resize**: Notes automatically expand based on content
- **Persistent Storage**: All notes saved to local database

### Text Editor
- **File Operations**
  - Create new files (Ctrl+N)
  - Open existing files (Ctrl+O)
  - Save files to local system (Ctrl+S)
  - Unsaved changes warning

- **Editing Features**
  - Cut, Copy, Paste (Ctrl+X, C, V)
  - Select All (Ctrl+A)
  - Undo/Redo (Ctrl+Z, Y)
  - Full keyboard shortcut support

- **Search & Navigation**
  - Find text (Ctrl+F)
  - Navigate between matches
  - Real-time search results counter

- **Statistics & Status**
  - Live cursor position (Line & Column)
  - Word count
  - Character count
  - Save status indicator

### User Experience
- **Dual View System**: Seamlessly switch between Sticky Notes and Text Editor
- **Premium Dark Theme**: Modern, eye-catching design with gradients
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Toast Notifications**: Beautiful feedback for all actions
- **Modal Dialogs**: Confirmation prompts for important actions
- **Session Management**: Inactivity warnings and auto-save

## 🚀 Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Edge, Safari)
- No server required - runs entirely in the browser!

### Installation

1. **Clone or Download** this repository
2. **Open** `index.html` in your web browser
3. **Start using** the application immediately!

### Quick Start

#### Using Sticky Notes
1. Click "Add Note" button in the navigation bar
2. Type your note content
3. Drag notes to reposition them
4. Click color circles to change note color
5. Click X button to delete a note

#### Using Text Editor
1. Click "Sticky Notes" button to switch to Text Editor view
2. Start typing or open an existing file
3. Use toolbar buttons or keyboard shortcuts
4. Save your work using the Save button or Ctrl+S

## 📋 System Requirements

### Performance Requirements
- **Page Load Time**: < 3 seconds on 4G connection
- **Typing Latency**: < 100ms
- **Save Time**: < 2 seconds for files up to 1MB
- **Concurrent Users**: Supports 50+ simultaneous users
- **Search Performance**: Results in < 1 second

### Browser Compatibility
- ✅ Google Chrome (latest)
- ✅ Mozilla Firefox (latest)
- ✅ Microsoft Edge (latest)
- ✅ Safari (latest)

### Storage Requirements
- **LocalStorage**: Enabled (required)
- **Cookies**: Enabled (required)
- **Storage Limit**: 50 notes or 5MB total data

## 🏗️ Architecture

### Technology Stack
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Styling**: Vanilla CSS with custom design system
- **Storage**: LocalStorage (simulates Appwrite backend)
- **Fonts**: Google Fonts (Inter)

### File Structure
```
My Notes Web Page/
├── index.html          # Main HTML structure
├── styles.css          # Complete styling and design system
├── app.js             # Application logic and functionality
└── README.md          # This file
```

### Database Schema (LocalStorage)
```javascript
{
  notes: [
    {
      id: string,
      content: string,
      color: string,
      x: number,
      y: number,
      createdAt: ISO date,
      updatedAt: ISO date
    }
  ],
  editorContent: string,
  settings: object
}
```

## 🎨 Design System

### Color Palette
- **Primary**: Purple gradient (#667eea → #764ba2)
- **Background**: Dark theme (#0f0f1e, #1a1a2e)
- **Note Colors**: Yellow, Pink, Blue, Green, Purple, Orange
- **Text**: White with opacity variants

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 300, 400, 500, 600, 700
- **Sizes**: Responsive scaling

### Animations
- Smooth transitions (150-500ms)
- Micro-interactions on hover
- Toast notifications with slide-in effect
- Modal fade-in/scale animations

## 🔒 Security Features

### Data Protection
- **HTTPS Ready**: Designed for secure communication
- **Input Sanitization**: XSS prevention built-in
- **Local Storage**: Data stays on user's device
- **No External Dependencies**: No third-party tracking

### Safety Features
- **Auto-Save**: Prevents data loss (every 1 second)
- **Unsaved Changes Warning**: Browser prompt before closing
- **Session Timeout**: Inactivity warning after 28 minutes
- **Local Backup**: All data stored in LocalStorage

## ⌨️ Keyboard Shortcuts

### File Operations
- `Ctrl+N` - New File
- `Ctrl+O` - Open File
- `Ctrl+S` - Save File

### Editing
- `Ctrl+X` - Cut
- `Ctrl+C` - Copy
- `Ctrl+V` - Paste
- `Ctrl+A` - Select All
- `Ctrl+Z` - Undo
- `Ctrl+Y` - Redo

### Navigation
- `Ctrl+F` - Find/Search

## 📱 Responsive Design

### Desktop (1200px+)
- Full toolbar with labels
- Optimal note spacing
- Multi-column layout

### Tablet (768px - 1199px)
- Condensed toolbar
- Adjusted note sizes
- Touch-friendly controls

### Mobile (< 768px)
- Icon-only toolbar
- Smaller notes
- Optimized touch targets

## 🧪 Testing

### Manual Testing Checklist
- [ ] Create new sticky note
- [ ] Edit note content
- [ ] Change note color
- [ ] Drag and drop note
- [ ] Delete note
- [ ] Switch to text editor
- [ ] Create new file
- [ ] Open existing file
- [ ] Save file
- [ ] Use keyboard shortcuts
- [ ] Search functionality
- [ ] Undo/Redo operations
- [ ] Responsive design on mobile

### Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] No lag when typing
- [ ] Smooth drag and drop
- [ ] Quick save operations

## 🐛 Troubleshooting

### Notes not saving?
- Check if LocalStorage is enabled in browser settings
- Clear browser cache and reload
- Ensure you're not in private/incognito mode

### Can't drag notes?
- Make sure you're clicking on the note header, not the textarea
- Try refreshing the page

### Search not working?
- Ensure you're in Text Editor view
- Check if search bar is visible (Ctrl+F)
- Try typing a different search term

## 📈 Future Enhancements

### Planned Features
- [ ] Cloud sync with Appwrite backend
- [ ] User authentication
- [ ] Collaborative editing
- [ ] Rich text formatting
- [ ] Note categories/tags
- [ ] Export to PDF
- [ ] Dark/Light theme toggle
- [ ] Custom note templates

## 📄 License

This project is created for educational purposes as part of E-JUST coursework.

## 👥 Authors

- Ahmed Abaza (320240099)
- Omar Ziton (320240102)
- Karim Ahmed (320240094)

**Institution**: E-JUST  
**Date**: December 15, 2025

## 🙏 Acknowledgments

- Inspired by [Sticky Notes React](https://github.com/divanov11/Sticky-Notes-React)
- Design inspiration from modern web applications
- Google Fonts for Inter typeface

## 📞 Support

For issues or questions:
1. Check the Troubleshooting section
2. Review the documentation
3. Contact the development team

---

**Built with ❤️ using HTML, CSS, and JavaScript**
