# TODOs

## Clade ranks

- [ ] Enforce "a clade's rank must be finer than every ancestor's rank" **server-side**. It's currently only applied as a dropdown filter (`ranksForContext`) in the edit/create forms; `createClade` and `updateClade` don't validate it, and `moveClade` doesn't re-check that the moved clade's (and its descendants') ranks are still valid under the new parent's lineage. Validate against `rankIndex` in the actions.
- [ ] Validate that a **species** (and finer ranks) requires a **binomial name** (genus + specific epithet), on create and update.
