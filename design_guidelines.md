# Design Guidelines: Task Manager Application

## Design Approach

**Selected Approach:** Design System (Material Design) with References from Linear and Todoist

**Justification:** This is a productivity tool prioritizing efficiency, clarity, and natural accessibility through semantic HTML. Material Design provides excellent structure for form-heavy applications while Linear and Todoist offer proven task management UX patterns.

**Core Principles:**
- Semantic HTML first - accessibility through structure, not attributes
- Clear visual hierarchy for task scanning
- Efficient keyboard navigation patterns
- Clean, distraction-free interface

## Typography

**Font Stack:** Inter (Google Fonts) - exceptional readability, works well for task lists

**Scale:**
- Page titles: text-2xl (24px), font-semibold
- Section headers: text-lg (18px), font-medium  
- Task text: text-base (16px), font-normal
- Completed tasks: text-base (16px), line-through, reduced opacity
- Meta info (dates, tags): text-sm (14px), font-normal
- Input fields: text-base (16px), font-normal

## Layout System

**Spacing Primitives:** Tailwind units 2, 4, 6, and 8 (0.5rem, 1rem, 1.5rem, 2rem)

**Structure:**
- Left sidebar: 280px fixed width for categories/lists (w-70)
- Main content: flex-1 with max-w-4xl container
- Right detail panel: 320px (w-80) - shows task details when selected
- Padding: p-6 for main containers, p-4 for cards, p-2 for tight spaces
- Task list spacing: space-y-2 between items
- Form field spacing: space-y-4

**Grid System:**
- Single column task list (no multi-column for tasks)
- Categories in sidebar: single column stack
- Task metadata: inline flex for compact display

## Component Library

### Navigation
**Sidebar Navigation:**
- Fixed left sidebar with category/list navigation
- Each category: flex items with icon + label, p-3, rounded corners
- Active state: distinct background treatment
- "Add New List" button at sidebar bottom

**Top Bar:**
- Search input (full-width with icon)
- User profile section (right-aligned)
- View toggles (list/board view)

### Task Components

**Task List Item:**
- Checkbox (native input[type="checkbox"]) - 20px, left-aligned
- Task text - flex-1, truncate on overflow
- Due date badge (if present) - inline, text-sm
- Priority indicator - subtle left border (4px width)
- Quick actions (edit/delete) - revealed on hover, right-aligned
- Padding: p-4, gap-3 between elements

**Task Detail Panel:**
- Task title (editable heading)
- Checkbox for completion
- Description textarea
- Due date picker
- Priority dropdown
- Category/list selector
- Notes section
- Delete button at bottom

### Forms

**Add Task Input:**
- Prominent at top of task list
- Single-line input with "Add task..." placeholder
- Enter to create, Escape to clear
- Auto-focus on page load
- Padding: p-4, border-2

**Task Edit Form:**
- Inline editing for task name (click to edit)
- Modal or side panel for detailed editing
- All form labels visible (not placeholders)
- Native form elements: `<input>`, `<select>`, `<textarea>`

### Data Display

**Task Counters:**
- Show active/completed counts per category
- Display as badges: text-sm, px-2, py-1, rounded-full
- Position: right side of category name

**Empty States:**
- Center-aligned message
- "Add your first task" prompt
- Minimal illustration or icon (heroicons)

### Interactive Elements

**Buttons:**
- Primary CTA: px-6, py-3, rounded-lg, font-medium
- Secondary actions: px-4, py-2, rounded-md
- Icon buttons: p-2, rounded-md (for quick actions)
- Text buttons: py-1, underline on hover

**Checkboxes:**
- Native `<input type="checkbox">` - 20px × 20px
- Custom focus ring for keyboard navigation
- Clear checked/unchecked states

**Dropdowns:**
- Native `<select>` elements
- Adequate padding: px-3, py-2
- Clear focus states

## Accessibility Implementation

**Semantic HTML Priority:**
- `<main>` for primary content area
- `<nav>` for sidebar navigation
- `<button>` for all clickable actions (never divs)
- `<form>` elements with proper `<label>` associations
- `<ul>`/`<li>` for task lists

**ARIA Usage (Minimal & Strategic):**
- `aria-label` only for icon-only buttons
- `role="status"` for task completion announcements
- Skip links for keyboard navigation
- That's it - no excessive ARIA

**Keyboard Navigation:**
- Tab order: sidebar → search → task list → detail panel
- Enter: complete/uncomplete task checkbox
- Space: toggle checkboxes
- Escape: close modals/panels, clear inputs
- Arrow keys: navigate between tasks in list

**Focus Management:**
- Clear focus indicators on all interactive elements (2px outline)
- Focus trapped in modals when open
- Focus returned to trigger element on modal close

## Component Structure

**Overall Layout:**
```
[Sidebar: Categories] | [Main: Task List + Add Input] | [Detail Panel]
     280px           |        flex-1 (max-w-4xl)      |    320px
```

**Task List Hierarchy:**
1. Add task input (sticky top)
2. Filter/sort controls (if needed)
3. Task items (scrollable)
4. Completed tasks section (collapsible)

**Responsive Behavior:**
- Mobile (<768px): Stack sidebar as drawer (toggle), hide detail panel (use modal)
- Tablet (768-1024px): Collapsible sidebar, full-width main content
- Desktop (>1024px): Three-column layout as described

## Icons
**Library:** Heroicons (via CDN)
- Check circle for completed tasks
- Plus circle for add actions
- Pencil for edit
- Trash for delete
- Calendar for due dates
- Tag for categories

## Animations
**Minimal & Purposeful:**
- Task completion: subtle cross-fade to strikethrough (200ms)
- Checkbox state change: quick scale animation (150ms)
- Modal enter/exit: fade + slide (200ms)
- NO scroll animations, NO parallax, NO decorative motion