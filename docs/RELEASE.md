# Release Guide

This document explains how to create a new release for the **SMART CAMPUS UCE - Module 2** project.

The project uses [Semantic Versioning](https://semver.org/) and a `qa → main` workflow.

---

## Branch flow

```text
feature/*  →  qa  →  main  →  tag v*  →  GitHub Release
```

1. Develop new features in `feature/*` branches.
2. Merge feature branches into `qa` for testing.
3. When `qa` is stable, create a pull request from `qa` to `main`.
4. After the PR is approved and merged into `main`, create a release tag.
5. Pushing the tag automatically triggers the GitHub Actions `Release` workflow, which creates the GitHub Release.

---

## Option 1: Use the release script (recommended)

From the repository root, after `qa` has been merged into `main`:

```bash
# Make sure you are on main and it is up to date
git checkout main
git pull origin main

# Run the release helper
./scripts/release.sh
```

The script will:

1. Ask for the new version number (e.g. `1.1.0`).
2. Update `package.json`.
3. Add a new section to `CHANGELOG.md`.
4. Commit the changes.
5. Create an annotated tag (e.g. `v1.1.0`).
6. Push `main` and the tag to GitHub.

After that, GitHub Actions will create the release automatically.

---

## Option 2: Manual release

If you prefer to do it manually, follow these steps.

### 1. Update version in `package.json`

```json
{
  "version": "1.1.0"
}
```

### 2. Update `CHANGELOG.md`

Add a new section under `## [Unreleased]`:

```markdown
## [Unreleased]

## [1.1.0] - YYYY-MM-DD

### Added
- Description of new features.

### Changed
- Description of changes.

### Fixed
- Description of fixes.

[1.1.0]: https://github.com/steandres/SMART-CAMPUS-UCE-MODULE2/releases/tag/v1.1.0
```

### 3. Commit the changes

```bash
git add package.json CHANGELOG.md
git commit -m "chore(release): prepare release v1.1.0"
```

### 4. Create and push the tag

```bash
git tag -a v1.1.0 -m "Release v1.1.0"
git push origin main
git push origin v1.1.0
```

---

## Verify the release

After pushing the tag:

1. Go to **Actions** to see the workflow run:
   https://github.com/steandres/SMART-CAMPUS-UCE-MODULE2/actions

2. Go to **Releases** to see the generated release:
   https://github.com/steandres/SMART-CAMPUS-UCE-MODULE2/releases

---

## Notes

- Always create releases from the `main` branch when possible.
- The tag must start with `v` (e.g. `v1.1.0`) to trigger the release workflow.
- Do not commit personal access tokens or other secrets to the repository.
