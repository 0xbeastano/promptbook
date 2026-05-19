# Contributing to PromptBook

We love pull requests! If you wish to contribute to PromptBook, please follow these simple guidelines.

## Local Setup
1. Fork and clone the repository.
2. Run `npm install` to install dependencies.
3. Use `npm run dev` to preview the popup UI.
4. Run `npm run build` to compile the extension to the `dist/` folder.

## Branch Naming Suggestion
Please format your branch names to indicate the type of change:
- `feature/your-feature-name`
- `fix/issue-description`
- `chore/maintenance-work`

## Commit Style Suggestion
We recommend following the [Conventional Commits](https://www.conventionalcommits.org/) specification:
- `feat: add folders support`
- `fix: correct z-index on toast notification`
- `docs: update setup instructions`

## Pull Request Expectations
- Keep PRs focused on a single issue or feature.
- Ensure the code successfully compiles with `npm run build` without any TypeScript errors.
- Test the extension locally in Chrome using "Load unpacked".
- Describe your changes clearly in the PR description using the provided template.
