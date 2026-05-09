# Review Before PR

Before creating a pull request:
- [ ] Build passes (`npm run build`)
- [ ] Lint passes (`npm run lint`)
- [ ] No dead code or commented-out code
- [ ] All states handled: loading, empty, error, edge cases
- [ ] Mock data is consistent
- [ ] No real database or auth dependencies leaked in
- [ ] New files follow naming conventions
- [ ] Check mobile viewport works
- [ ] Check desktop viewport works
- [ ] Remove console.log statements
