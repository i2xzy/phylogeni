# PhyloGeni Development Planning Document

## Project Overview

PhyloGeni is a phylogenetic tree visualization and exploration platform built with Next.js 16, React 19, Chakra UI, and Supabase. It integrates with Open Tree of Life (OTT), GBIF, and Wikimedia Commons to provide comprehensive biodiversity data.

---

## Current State Assessment

### What's Working Well
- Core tree visualization with D3.js
- Authentication (OAuth + OTP via Supabase)
- Search functionality (dual-source: database + OTT)
- Clade detail pages with image integration
- Responsive design foundation
- Clean project structure with App Router
- Good TypeScript coverage
- CI/CD pipeline with GitHub Actions

### Areas Needing Attention
- Clade editing is marked "under construction"
- E2E tests are outdated (still from template)
- Role-based access control is commented out
- Some deprecated database tables exist
- No unit tests
- Limited error handling in some areas

---

## Priority 1: Critical / Blocking Issues

### 1.1 Complete Clade Editing Feature
**Status:** Under construction
**Location:** `src/app/(user)/clade/[id]/edit/page.tsx`
**Tasks:**
- [ ] Implement form submission logic
- [ ] Connect form to Supabase update operations
- [ ] Add validation for all fields
- [ ] Handle image upload/selection
- [ ] Add success/error feedback
- [ ] Implement permission checks (only editors+ can edit)

### 1.2 Enable Role-Based Access Control
**Status:** Commented out in middleware
**Location:** `src/lib/utils/supabase/middleware.ts`
**Tasks:**
- [ ] Uncomment and activate RBAC logic
- [ ] Create admin-only routes
- [ ] Add curator-level permissions for certain operations
- [ ] Display user role in account page
- [ ] Add UI indicators for permission-restricted actions

### 1.3 Fix/Update E2E Tests
**Status:** Tests are from template, not PhyloGeni
**Location:** `e2e/home.spec.ts`
**Tasks:**
- [ ] Remove template tests
- [ ] Add homepage tests (carousel, navigation)
- [ ] Add authentication flow tests
- [ ] Add tree navigation tests
- [ ] Add search functionality tests
- [ ] Add clade viewing tests

---

## Priority 2: Important Improvements

### 2.1 Error Handling & Loading States
**Tasks:**
- [ ] Add error boundaries for tree visualization
- [ ] Improve API error messages and user feedback
- [ ] Add retry logic for external API calls (OTT, GBIF, Wikimedia)
- [ ] Create consistent loading skeletons across all pages
- [ ] Handle offline/network error states gracefully

### 2.2 Performance Optimization
**Tasks:**
- [ ] Implement tree virtualization for large datasets
- [ ] Add caching layer for OTT API responses
- [ ] Optimize image loading with blur placeholders
- [ ] Add prefetching for common navigation paths
- [ ] Profile and optimize D3 tree rendering

### 2.3 Database Cleanup
**Tasks:**
- [ ] Remove or migrate `transactions_old` table
- [ ] Remove or migrate `users_old` table
- [ ] Add database indexes for common queries
- [ ] Create migration scripts for schema changes
- [ ] Document database schema in README

### 2.4 Search Enhancements
**Location:** `src/app/(user)/search/`
**Tasks:**
- [ ] Add search filters (rank, extant/extinct, source)
- [ ] Implement search pagination
- [ ] Add search history/recent searches
- [ ] Improve search result ranking
- [ ] Add "search as you type" with debouncing

---

## Priority 3: New Features

### 3.1 User Contributions System
**Description:** Allow users to contribute and curate clade data
**Tasks:**
- [ ] Create contribution workflow (submit → review → approve)
- [ ] Add contribution history to user profiles
- [ ] Implement moderation queue for curators
- [ ] Add attribution for contributors
- [ ] Create contribution guidelines page

### 3.2 Favorites & Collections
**Description:** Let users save and organize clades
**Tasks:**
- [ ] Create `favorites` table in database
- [ ] Add favorite button to clade pages
- [ ] Create favorites list page
- [ ] Implement collections/folders for organizing favorites
- [ ] Add sharing functionality for collections

### 3.3 Tree Comparison View
**Description:** Compare two subtrees side by side
**Tasks:**
- [ ] Design comparison UI
- [ ] Implement dual-tree rendering
- [ ] Highlight common ancestors
- [ ] Show divergence points
- [ ] Add metrics (time since divergence, etc.)

### 3.4 Educational Features
**Description:** Add learning-focused features
**Tasks:**
- [ ] Create "featured clades" section on homepage
- [ ] Add taxonomy explainer tooltips
- [ ] Implement guided tours of the tree
- [ ] Create glossary of terms
- [ ] Add quiz/interactive learning mode

### 3.5 Export & Share
**Description:** Allow users to export and share tree views
**Tasks:**
- [ ] Export tree view as image (SVG/PNG)
- [ ] Generate shareable links to specific tree positions
- [ ] Create embed widget for external sites
- [ ] Add social media share buttons
- [ ] Export clade data as JSON/CSV

---

## Priority 4: Technical Debt & Quality

### 4.1 Testing Infrastructure
**Tasks:**
- [ ] Set up Jest for unit testing
- [ ] Add unit tests for utility functions
- [ ] Add component tests with React Testing Library
- [ ] Add API route tests
- [ ] Set up test coverage reporting
- [ ] Add visual regression tests for tree component

### 4.2 Documentation
**Tasks:**
- [ ] Create comprehensive README with setup instructions
- [ ] Document all API endpoints
- [ ] Add JSDoc comments to key functions
- [ ] Create architecture decision records (ADRs)
- [ ] Add CONTRIBUTING.md for contributors

### 4.3 Accessibility
**Tasks:**
- [ ] Audit tree visualization for keyboard navigation
- [ ] Add ARIA labels throughout
- [ ] Ensure color contrast meets WCAG standards
- [ ] Test with screen readers
- [ ] Add skip navigation links

### 4.4 Code Quality
**Tasks:**
- [ ] Add stricter ESLint rules
- [ ] Implement Husky pre-push type checking (currently set up but verify)
- [ ] Create shared constants for magic strings/numbers
- [ ] Refactor large components into smaller pieces
- [ ] Add Storybook for component documentation

---

## Priority 5: Future Considerations

### 5.1 Mobile App
- Consider React Native or PWA for mobile experience
- Offline mode for tree exploration
- Push notifications for contribution updates

### 5.2 API Public Access
- Create public API for third-party integrations
- Rate limiting and API keys
- OpenAPI/Swagger documentation

### 5.3 Internationalization (i18n)
- Multi-language support
- Localized taxonomic names where available
- RTL language support

### 5.4 Analytics & Insights
- Track popular clades/searches
- User engagement metrics
- Contribution statistics dashboard

---

## Suggested Roadmap

### Phase 1 (Next 2-4 weeks)
1. Complete clade editing feature
2. Enable RBAC
3. Fix E2E tests
4. Basic error handling improvements

### Phase 2 (4-8 weeks)
1. Search enhancements
2. Performance optimization
3. Database cleanup
4. Unit testing setup

### Phase 3 (8-12 weeks)
1. Favorites & Collections
2. Export & Share features
3. Accessibility audit
4. Documentation

### Phase 4 (12+ weeks)
1. User contributions system
2. Tree comparison view
3. Educational features
4. Public API consideration

---

## Quick Wins (Can be done in a day or less)

1. Add loading spinners to all async operations
2. Remove deprecated database tables
3. Update Netlify config to use Node 20
4. Add favicon and meta tags improvements
5. Fix any TypeScript strict mode warnings
6. Add "About" page with project information
7. Improve 404 page with helpful navigation
8. Add breadcrumbs to more pages

---

## Notes

- **Supabase Tables:** Consider creating migrations for reproducible schema
- **External APIs:** OTT API can be slow; consider background sync for frequently accessed data
- **Tree Performance:** For very deep trees, consider lazy loading branches
- **Image Sources:** Wikimedia images vary in quality; may want curation layer

---

## Complete Page List (Geni.com-Inspired)

> Inspired by [Geni.com](https://www.geni.com)'s collaborative family tree model, adapted for phylogenetic data. Key concepts: one unified "World Tree" of life, collaborative editing, merge conflict resolution, projects for special interests, and curator-managed quality control.

### Legend
- ✅ Exists
- 🚧 Exists but incomplete
- ❌ Needs to be created

---

### Public Pages (No Auth Required)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Homepage | `/` | ✅ | Landing page with carousel, features, CTA |
| About | `/about` | ❌ | Project info, mission, team |
| Contact | `/contact` | ❌ | Contact form, social links |
| Privacy Policy | `/privacy` | ❌ | Privacy policy for compliance |
| Terms of Service | `/terms` | ❌ | Terms and conditions |
| 404 Not Found | `/not-found` | ❌ | Custom 404 page |
| Public Tree View | `/explore` | ❌ | Read-only tree for non-logged users |
| Public Clade View | `/explore/[id]` | ❌ | Read-only clade detail for sharing |

---

### Authentication Pages

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Sign In | `/auth/sign-in` | ✅ | OAuth + OTP login |
| Sign Up | `/auth/sign-up` | ❌ | Dedicated registration (optional) |
| Auth Callback | `/auth/callback` | ✅ | OAuth callback handler (route) |
| Auth Confirm | `/auth/confirm` | ✅ | OTP confirmation (route) |
| Auth Error | `/auth/error` | ✅ | Authentication error display |
| Forgot Password | `/auth/forgot-password` | ❌ | Password reset request |
| Reset Password | `/auth/reset-password` | ❌ | Password reset form |

---

### Core Tree & Clade Pages (Auth Required)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Tree Explorer | `/tree` | ✅ | Main D3 tree visualization |
| Search | `/search` | ✅ | Search clades and taxa |
| Advanced Search | `/search/advanced` | ❌ | Filter by rank, status, source, date |
| Clade Detail | `/clade/[id]` | ✅ | View clade information |
| Clade Edit | `/clade/[id]/edit` | 🚧 | Edit clade (under construction) |
| Clade History | `/clade/[id]/history` | ❌ | Edit history/revisions with diff view |
| Clade Discussion | `/clade/[id]/discussion` | ❌ | Comments & discussion on this clade |
| Clade Sources | `/clade/[id]/sources` | ❌ | Citations & references for this clade |
| Clade Media | `/clade/[id]/media` | ❌ | Photos, diagrams, videos |
| Clade Timeline | `/clade/[id]/timeline` | ❌ | Evolutionary timeline visualization |
| Node Details | `/node-details` | ✅ | Multi-source node info |
| Create Clade | `/clade/new` | ❌ | Create new clade entry |

---

### Merge & Conflict Resolution Pages (Geni-Inspired)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| My Merge Issues | `/merges` | ❌ | Dashboard of pending merges & conflicts |
| Merge Request | `/merges/[id]` | ❌ | View/approve/reject a merge request |
| Create Merge | `/merges/new` | ❌ | Propose merging two duplicate clades |
| Data Conflicts | `/conflicts` | ❌ | List of conflicting data across sources |
| Conflict Detail | `/conflicts/[id]` | ❌ | Resolve a specific data conflict |
| Tree Matches | `/matches` | ❌ | Suggested duplicate/related clades |
| Consistency Issues | `/issues` | ❌ | Auto-detected data quality problems |

---

### Projects Pages (Geni-Inspired)

> Projects are collaborative groups focused on specific taxonomic groups, time periods, or topics (e.g., "Dinosauria", "Marine Mammals", "Endangered Species", "Cambrian Explosion")

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Projects List | `/projects` | ❌ | Browse all projects |
| Project Detail | `/projects/[id]` | ❌ | Project overview, members, linked clades |
| Project Discussion | `/projects/[id]/discussion` | ❌ | Project-specific discussions |
| Project Members | `/projects/[id]/members` | ❌ | Project member list & roles |
| Project Clades | `/projects/[id]/clades` | ❌ | Clades linked to this project |
| Create Project | `/projects/new` | ❌ | Create a new project |
| Edit Project | `/projects/[id]/edit` | ❌ | Edit project details |
| My Projects | `/account/projects` | ❌ | User's joined projects |

---

### Discussions Pages (Geni-Inspired)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Discussions Home | `/discussions` | ❌ | All public discussions |
| Discussion Thread | `/discussions/[id]` | ❌ | Single discussion thread |
| Create Discussion | `/discussions/new` | ❌ | Start a new discussion |
| Discussion Categories | `/discussions/categories` | ❌ | Browse by category |

---

### User & Profile Pages

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Account Settings | `/account` | ✅ | Profile editing |
| Public Profile | `/user/[username]` | ❌ | Public user profile page |
| My Contributions | `/account/contributions` | ❌ | User's edit history |
| My Favorites | `/account/favorites` | ❌ | Saved clades list |
| My Collections | `/account/collections` | ❌ | Organized clade collections |
| My Projects | `/account/projects` | ❌ | Projects user belongs to |
| My Merge Issues | `/account/merges` | ❌ | User's pending merges |
| Notifications | `/account/notifications` | ❌ | User notifications |
| Collaboration Requests | `/account/requests` | ❌ | Pending collaboration requests |

---

### Curator Pages (Role: Curator+)

> Curators are trusted users who can merge any public clades, resolve conflicts, and moderate content (similar to Geni's curator system)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Curator Dashboard | `/curator` | ❌ | Curator overview & quick actions |
| Pending Merges Queue | `/curator/merges` | ❌ | All pending merge requests |
| Reported Issues | `/curator/reports` | ❌ | User-reported problems |
| Consistency Queue | `/curator/consistency` | ❌ | Auto-detected issues to review |
| User Reports | `/curator/users` | ❌ | Reported/flagged users |

---

### Admin Pages (Role: Admin)

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Admin Dashboard | `/admin` | ❌ | Admin overview & stats |
| User Management | `/admin/users` | ❌ | Manage users & roles |
| User Detail | `/admin/users/[id]` | ❌ | Edit specific user, change role |
| Analytics | `/admin/analytics` | ❌ | Usage statistics, growth metrics |
| Featured Clades | `/admin/featured` | ❌ | Manage homepage features |
| System Settings | `/admin/settings` | ❌ | Site-wide configuration |
| Audit Log | `/admin/audit` | ❌ | All system actions log |
| Curator Management | `/admin/curators` | ❌ | Promote/demote curators |

---

### Educational/Content Pages

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Glossary | `/glossary` | ❌ | Taxonomy terms explained |
| How It Works | `/how-it-works` | ❌ | Guide to using the app |
| Video Tutorials | `/tutorials` | ❌ | Video guides (like Geni) |
| Featured Clades | `/featured` | ❌ | Curated interesting clades |
| Learning Paths | `/learn` | ❌ | Guided educational content |
| Contribution Guide | `/contribute` | ❌ | How to contribute quality data |
| Merge Guide | `/guides/merging` | ❌ | How merging works |
| Naming Conventions | `/guides/naming` | ❌ | Taxonomic naming standards |

---

### Utility Pages

| Page | Route | Status | Description |
|------|-------|--------|-------------|
| Share View | `/share/[id]` | ❌ | Shareable tree position link |
| Embed | `/embed/[id]` | ❌ | Embeddable tree widget |
| Compare Clades | `/compare` | ❌ | Side-by-side clade comparison |
| Compare Trees | `/compare/trees` | ❌ | Compare subtree structures |
| Export | `/export` | ❌ | Export tree/data options |
| Activity Feed | `/activity` | ❌ | Recent changes across the tree |
| Changelog | `/changelog` | ❌ | Site updates and new features |

---

### API Routes

| Route | Method | Status | Description |
|-------|--------|--------|-------------|
| `/api/search` | POST | ✅ | Search clades |
| `/api/search/advanced` | POST | ❌ | Advanced filtered search |
| `/api/clade/[id]` | GET | ✅ | Get clade by ID |
| `/api/clade/[id]` | PUT | ❌ | Update clade |
| `/api/clade/[id]` | DELETE | ❌ | Delete clade (admin) |
| `/api/clade` | POST | ❌ | Create new clade |
| `/api/clade/[id]/history` | GET | ❌ | Get revision history |
| `/api/clade/[id]/discussion` | GET/POST | ❌ | Clade discussions |
| `/api/auth/signout` | POST | ✅ | Sign out user |
| `/api/favorites` | GET/POST | ❌ | User favorites |
| `/api/favorites/[id]` | DELETE | ❌ | Remove favorite |
| `/api/user/profile` | GET/PUT | ❌ | User profile |
| `/api/user/[username]` | GET | ❌ | Public user data |
| `/api/merges` | GET/POST | ❌ | Merge requests |
| `/api/merges/[id]` | GET/PUT | ❌ | Merge request detail/approve |
| `/api/conflicts` | GET | ❌ | Data conflicts list |
| `/api/conflicts/[id]` | PUT | ❌ | Resolve conflict |
| `/api/projects` | GET/POST | ❌ | Projects CRUD |
| `/api/projects/[id]` | GET/PUT/DELETE | ❌ | Project detail |
| `/api/projects/[id]/members` | GET/POST/DELETE | ❌ | Project membership |
| `/api/discussions` | GET/POST | ❌ | Discussions |
| `/api/discussions/[id]` | GET/PUT/DELETE | ❌ | Discussion thread |
| `/api/activity` | GET | ❌ | Activity feed |
| `/api/admin/users` | GET | ❌ | List users (admin) |
| `/api/admin/users/[id]` | PUT | ❌ | Update user role |
| `/api/admin/audit` | GET | ❌ | Audit log |

---

### Summary

| Category | Existing | Needed | Total |
|----------|----------|--------|-------|
| Public | 1 | 7 | 8 |
| Auth | 4 | 3 | 7 |
| Core Tree/Clade | 5 | 7 | 12 |
| Merge & Conflicts | 0 | 7 | 7 |
| Projects | 0 | 8 | 8 |
| Discussions | 0 | 4 | 4 |
| User/Profile | 1 | 8 | 9 |
| Curator | 0 | 5 | 5 |
| Admin | 0 | 8 | 8 |
| Educational | 0 | 8 | 8 |
| Utility | 0 | 7 | 7 |
| **Total Pages** | **11** | **72** | **83** |
| API Routes | 3 | 24 | 27 |

---

### Recommended Implementation Order

**Phase 1 - Core CRUD & Quality:**
1. Complete `/clade/[id]/edit` - enable basic editing
2. Add `/clade/new` - create new clades
3. Add `/clade/[id]/history` - track changes
4. Add API routes for clade CRUD
5. Enable RBAC in middleware

**Phase 2 - Collaboration Foundation:**
6. Add `/user/[username]` - public profiles
7. Add `/account/contributions` - track user work
8. Add `/clade/[id]/discussion` - per-clade comments
9. Add `/activity` - see what's changing
10. Add basic notifications

**Phase 3 - Merge System (Key Geni Feature):**
11. Add `/merges` dashboard
12. Add `/merges/new` - propose merges
13. Add `/merges/[id]` - review merges
14. Add `/conflicts` - data conflict resolution
15. Add `/matches` - suggested duplicates

**Phase 4 - Projects & Community:**
16. Add `/projects` - browse projects
17. Add `/projects/[id]` - project pages
18. Add `/projects/new` - create projects
19. Add `/discussions` - community discussions
20. Add project membership system

**Phase 5 - Curator & Admin:**
21. Add `/curator` dashboard
22. Add curator queues (merges, reports, consistency)
23. Add `/admin` dashboard
24. Add user management
25. Add audit logging

**Phase 6 - Polish & Growth:**
26. Add `/explore` - public read-only tree
27. Add `/share/[id]` - shareable links
28. Add educational content (glossary, guides)
29. Add `/tutorials` - video guides
30. Add `/featured` - curated content

---

### Key Concepts from Geni.com to Implement

| Geni Concept | PhyloGeni Equivalent | Priority |
|--------------|---------------------|----------|
| World Family Tree | World Tree of Life | Core |
| Profile merging | Clade merging (duplicates) | High |
| Tree Matches | Suggested duplicate clades | High |
| Merge Requests | Request to merge protected clades | High |
| Merge Issues | Conflicts dashboard | High |
| Curators | Curator role with special powers | High |
| Projects | Taxonomic interest groups | Medium |
| Discussions | Per-clade and general forums | Medium |
| Consistency Checks | Auto-detect data problems | Medium |
| Collaboration | Request edit access | Medium |
| Source Citations | Already partial, expand | Medium |
| Activity Feed | Recent changes stream | Medium |
| Public Profiles | Show user contributions | Low |
| Video Tutorials | How-to guides | Low |

---

*Last updated: January 31, 2026*

Sources:
- [Geni.com](https://www.geni.com) - Collaborative family tree platform
- [Geni Merging Help](https://help.geni.com/hc/en-us/sections/206535907-Merging)
- [Geni Curators Project](https://www.geni.com/projects/Geni-Curators/9960)
- [Geni Merge Guide](https://www.geni.com/projects/User-Tutorial-Merge-Guide/35503)
