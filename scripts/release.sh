#!/usr/bin/env bash
set -euo pipefail

# SMART CAMPUS UCE - Module 2
# Release helper script
#
# Usage:
#   ./scripts/release.sh
#
# This script will:
#   1. Ask for the new version number (e.g. 1.1.0)
#   2. Update package.json
#   3. Add a new entry to CHANGELOG.md
#   4. Commit the changes
#   5. Create an annotated Git tag (v1.1.0)
#   6. Push the current branch and the tag to origin
#
# After pushing the tag, the GitHub Actions "Release" workflow will
# automatically create a GitHub Release for you.

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

CURRENT_BRANCH=$(git branch --show-current)
TODAY=$(date +%Y-%m-%d)

echo "=========================================="
echo "  SMART CAMPUS UCE - Release Helper"
echo "=========================================="
echo ""

# Recommended branch check
echo "Current branch: $CURRENT_BRANCH"
if [[ "$CURRENT_BRANCH" != "main" ]]; then
    echo ""
    echo "WARNING: Releases are normally created from the 'main' branch."
    echo "Your current branch is '$CURRENT_BRANCH'."
    read -r -p "Do you want to continue anyway? [y/N] " confirm
    if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
        echo "Aborted."
        exit 0
    fi
fi

# Check for a clean working tree
if ! git diff --quiet || ! git diff --cached --quiet; then
    echo "ERROR: Working tree is not clean. Please commit or stash your changes first."
    exit 1
fi

# Read new version
read -r -p "Enter the new version number (e.g. 1.1.0): " VERSION
if [[ -z "$VERSION" ]]; then
    echo "ERROR: Version cannot be empty."
    exit 1
fi

TAG="v$VERSION"

# Check if tag already exists
if git rev-parse "$TAG" >/dev/null 2>&1; then
    echo "ERROR: Tag $TAG already exists."
    exit 1
fi

# Update package.json
if command -v jq >/dev/null 2>&1; then
    jq ".version = \"$VERSION\"" package.json > package.json.tmp
    mv package.json.tmp package.json
else
    sed -i "s/\"version\": \"[^\"]*\"/\"version\": \"$VERSION\"/" package.json
fi

# Update CHANGELOG.md
if [[ -f CHANGELOG.md ]]; then
    awk -v ver="$VERSION" -v today="$TODAY" '
        BEGIN { inserted=0 }
        /^## \[Unreleased\]/ && !inserted {
            print
            print ""
            print "## [" ver "] - " today
            inserted=1
            next
        }
        { print }
    ' CHANGELOG.md > CHANGELOG.md.tmp
    mv CHANGELOG.md.tmp CHANGELOG.md
else
    cat > CHANGELOG.md <<EOF
# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [$VERSION] - $TODAY

### Added

- Describe new features here.

[$VERSION]: https://github.com/steandres/SMART-CAMPUS-UCE-MODULE2/releases/tag/$TAG
EOF
fi

echo ""
echo "Updated files:"
git diff --stat
echo ""

read -r -p "Continue with commit and tag? [y/N] " confirm
if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted. Reverting file changes..."
    git checkout -- package.json CHANGELOG.md 2>/dev/null || true
    exit 0
fi

# Commit changes
git add package.json CHANGELOG.md
git commit -m "chore(release): prepare release $TAG"

# Create annotated tag
git tag -a "$TAG" -m "Release $TAG"

echo ""
echo "Pushing branch '$CURRENT_BRANCH' and tag '$TAG'..."
git push origin "$CURRENT_BRANCH"
git push origin "$TAG"

echo ""
echo "=========================================="
echo "  Release $TAG pushed successfully!"
echo "=========================================="
echo ""
echo "The GitHub Actions 'Release' workflow will now create the GitHub Release automatically."
echo "You can follow the progress at:"
echo "  https://github.com/steandres/SMART-CAMPUS-UCE-MODULE2/actions"
echo ""
echo "The release will appear at:"
echo "  https://github.com/steandres/SMART-CAMPUS-UCE-MODULE2/releases"
echo ""
