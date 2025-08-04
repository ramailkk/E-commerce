# Frontend Refactor & Component Consolidation

## Summary of Changes

- **Component Reorganization**
  - Moved files from `Vendor/` directory to a unified `components/` directory.
  - Renamed and restructured files for consistency.

- **New Components Created**
  - `CustomCheckbox.js` and `CustomCheckbox.css`
  - `DualRangeSlider.js` and `DualRangeSlider.css`
  - `ProductCard.js` and `ProductCard.css`
  - `ProductPage.js`
  - `Sidebar.js` and `Sidebar.css`
  - `StarRatingFilter.js` and `StarRatingFilter.css`

- **Responsive Design**
  - Updated product listing and portal page for mobile compatibility.
  - Sidebar collapses on smaller screen sizes.
  - Applied custom CSS along with Bootstrap utilities.

- **Backend**
  - No changes made to backend logic or APIs in this update.

- **Goal**
  - Components are designed to be reused across different user roles: admin, vendor, user, and guest.
  - Only minimal visual or behavioral differences should be needed per role.

