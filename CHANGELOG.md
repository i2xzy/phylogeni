# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## 0.2.0 (2026-06-03)


### ⚠ BREAKING CHANGES

* **pages:** pages are different
* update chakra-ui to v2

### Features

* add release-please action (manual trigger) 9d2f21b
* **components:** add a few suggestions to the search bar dialogue 78097f3
* **components:** add contact form ca8e35f
* **components:** add revisions breadcrumb and unify entity link styling b313a9e
* **components:** get clade images from wikimedia by name, add SidebarButton component 1d147b2
* **components:** improve tree view with client-side sidebar daadc57
* **components:** improve tree view with client-side sidebar b033785
* **components:** new carousel component using just transform and transition 270c45d
* **components:** new results in node details 27db7fe
* **components:** new search bar component 268699d
* **components:** polish clade revision history feed and diff dialog c91344c
* **components:** rebuild clade revision history as a Geni-style feed on clade_revisions edaf0ca
* **components:** show parent on create revisions via target_clade_id 759f555
* enable clade editing for editors with revision history d2fbe67
* **layout:** add theme toggle ([#6](undefined/undefined/undefined/issues/6)) 93df3bb
* migrate to app router ([#132](undefined/undefined/undefined/issues/132)) adcefc3
* **pages:** 'added home page' 2e9f49b
* **pages:** add clade revision page 4a2a134
* **pages:** add custom 404 page ([#7](undefined/undefined/undefined/issues/7)) 7ce47c0
* **pages:** add custom 500 page ([#120](undefined/undefined/undefined/issues/120)) 0559175
* **pages:** add new page for clade edit ccfd871
* **pages:** added auth pages and supabase cbf4fb6
* **pages:** get data from supabase for tree and sidebar f622f88
* **pages:** migrate node-details from terminusdb to supabase 2dd54dc
* **pages:** new page for clade info that is linked to from tree sidebar ba87587
* **pages:** signin 20a5f8f
* **pages:** tree page b3aed16
* re-add next-pwa ([#95](undefined/undefined/undefined/issues/95)) d924ab6
* rework Contact section and store messages in Supabase 1aef3d4
* **samples:** revamp sample home 495734b
* setup e2e and add sample e2e test ([#106](undefined/undefined/undefined/issues/106)) 716faaa
* **styles:** migrate to chakra ui v3 5fec7a8
* **types:** regenerate supabase types with taxa.legacy_mongo_id and clade_revisions 6ec81ee
* **utils:** add new utils to get data from ott and gbif 2b48949


### Bug Fixes

* adjust manifest to function 57eeed2
* change 404 image to use chakra image 44ed6dc
* **components:** add use client to SearchButton 37913a4
* **components:** changed clade variable to other to compare changes d423dfa
* **components:** resolve type and effect lint issues in CladeHistoryTable 7bf73b3
* **components:** title the changes dialog with the current clade name 516abd3
* **deps:** update all dependencies ([#129](undefined/undefined/undefined/issues/129)) 7dd7a6b
* fix security issue with next 0d976ec
* fix security issue with next 52774b2
* **layout:** add og image and replace default cdc7e13
* **layout:** adjust middleware matcher to allow opengraph-image without auth 7d0da49
* **layout:** hide sign-in button on auth pages c6853d8
* **layout:** hide sign-in button on auth pages 680bf92
* **pages:** bypass middleware if url starts with images 8f41532
* **pages:** create a server side sidebar component and stream content 672d43d
* **pages:** create clade type manually to avoid issues with difference in database names af71ff6
* **pages:** fix auth error page search params e04f2c2
* **pages:** fix login flow 53b7331
* **pages:** link clade parent to its clade page 2044c6a
* revise typing 2f4d662
* revise typing 7473e71
* run turbo codemod 5a4f24a
* **styles:** revise customTheme b2b92bd
* use asChild pattern for Chakra UI Link with NextLink a307024
* **utils:** install @types/uuid a72cbc4
* **utils:** move uuid to dev deps fcd5a97


### Chores

* 📦 update chakra-ui to v2 ([#83](undefined/undefined/undefined/issues/83)) f880daf


### Improvements

* add motion box, use absolute import ec530a9
* add spacing b621bb2
* adjust external links 4542e82
* change chakra-ui imports to @chakra-ui/react e78cf3a
* **components:** add TextLink for consistent entity-link styling 16f76c4
* **components:** renamed cladediff function 64392c4
* enable transition on change theme bc51d59
* migrate from deprecated middleware convention to proxy 1bc1213
* migrate from deprecated middleware convention to proxy be52aa6
* move meta viewport to document deca9b5
* **pages:** clean up revisions page and comment out child-nodes filter e96bc29
* **pages:** create new auth layout and custom signin form ea1e3e5
* **pages:** drop redundant root-parent query in getSubtree 0039b78
* **pages:** page props eec0590
* **pages:** page props dae9040
* **pages:** repoint frontend from legacy clades table to taxa 05c0058
* **pages:** simplify nodeId resolution in getSubtree 6091427
* refactor customTheme d6fd000
* remove turbo scripts 24546de
* remove turbo scripts c483d18
* remove unused import, prettify d6b40d7
* resize image & improve a11y sample component ([#114](undefined/undefined/undefined/issues/114)) a08b5e8
* revise chakra-ui imports 64c928b
* **style:** rename theme.ts to customTheme.ts 3887cb1
* turbo 2e58823
* turbo e5db06d
* turbo 5a8228f
* turbo 4118c8c
* **types:** move shared clade types into types/database 8d2e230
* update default font to figtree 195bbc6
* upgrade packages 0bcbde2
* **utils:** let getCladeDetails own its supabase client 35f404e
* **utils:** reuse Clade and CladeSnapshot types in the edit action 78c40de
* **utils:** use clade naming instead of taxa in frontend symbols 345c97b
