# Development Scripts

This folder contains utility scripts for development, building, and publishing the VueAI packages.

## Directory Structure

- `cleanup/`: Scripts for cleaning up the repository and preparing for deployment
- `publish/`: Scripts for publishing packages to npm and GitHub Packages
- `setup/`: Scripts for setting up the development environment and demo

## Publishing Scripts (`publish/`)

- **publish-all.sh**: Publishes all packages to npm and creates a GitHub release
- **publish-npm.sh**: Publishes packages to npm only
- **publish-github.sh**: Publishes packages to GitHub only
- **publish-simple.sh**: Simplified publishing script for quick updates
- **publish-packages.sh**: Publishes all packages with version bumping

## Setup Scripts (`setup/`)

- **setup-demo.sh**: Sets up the demo application
- **link-demo-packages.sh**: Links local packages to the demo for development
- **fix-demo.sh**: Fixes common issues in the demo application

## Cleanup Scripts (`cleanup/`)

- **clean-and-push.sh**: Cleans the repository and pushes changes to GitHub
- **clean-repo.sh**: Cleans the repository by removing unnecessary files
- **push-to-github.sh**: Pushes changes to GitHub

## Usage

Most scripts can be run directly from the command line:

```bash
./scripts/publish/publish-all.sh
```

Some scripts may require parameters:

```bash
./scripts/publish/publish-all.sh 1.2.0
```

## Note

These scripts are organized into subdirectories for better maintainability. Make sure to use the correct path when running a script.
