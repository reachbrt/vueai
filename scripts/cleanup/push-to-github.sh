#!/bin/bash

# Script to push changes to GitHub
set -e

# Define colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Preparing to push changes to GitHub...${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo -e "${RED}Error: git is not installed. Please install git and try again.${NC}"
  exit 1
fi

# Check if the current directory is a git repository
if [ ! -d ".git" ]; then
  echo -e "${YELLOW}This directory is not a git repository. Do you want to initialize it? (y/n)${NC}"
  read INIT_GIT
  
  if [ "$INIT_GIT" = "y" ] || [ "$INIT_GIT" = "Y" ]; then
    git init
    echo -e "${GREEN}Git repository initialized${NC}"
  else
    echo -e "${RED}Aborted. Please run this script in a git repository.${NC}"
    exit 1
  fi
fi

# Check if the remote repository is set
if ! git remote -v | grep -q "origin"; then
  echo -e "${YELLOW}No remote repository is set. Please enter the GitHub repository URL:${NC}"
  read REPO_URL
  
  git remote add origin "$REPO_URL"
  echo -e "${GREEN}Remote repository set to $REPO_URL${NC}"
fi

# Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo -e "${YELLOW}There are uncommitted changes. Do you want to commit them? (y/n)${NC}"
  read COMMIT_CHANGES
  
  if [ "$COMMIT_CHANGES" = "y" ] || [ "$COMMIT_CHANGES" = "Y" ]; then
    echo -e "${YELLOW}Enter a commit message:${NC}"
    read COMMIT_MESSAGE
    
    git add .
    git commit -m "$COMMIT_MESSAGE"
    echo -e "${GREEN}Changes committed${NC}"
  else
    echo -e "${RED}Aborted. Please commit your changes manually.${NC}"
    exit 1
  fi
fi

# Push to GitHub
echo -e "${YELLOW}Do you want to push to GitHub now? (y/n)${NC}"
read PUSH_TO_GITHUB

if [ "$PUSH_TO_GITHUB" = "y" ] || [ "$PUSH_TO_GITHUB" = "Y" ]; then
  echo -e "${YELLOW}Enter the branch name (default: main):${NC}"
  read BRANCH_NAME
  
  if [ -z "$BRANCH_NAME" ]; then
    BRANCH_NAME="main"
  fi
  
  # Check if the branch exists
  if ! git show-ref --verify --quiet "refs/heads/$BRANCH_NAME"; then
    echo -e "${YELLOW}Branch $BRANCH_NAME does not exist. Do you want to create it? (y/n)${NC}"
    read CREATE_BRANCH
    
    if [ "$CREATE_BRANCH" = "y" ] || [ "$CREATE_BRANCH" = "Y" ]; then
      git checkout -b "$BRANCH_NAME"
      echo -e "${GREEN}Branch $BRANCH_NAME created${NC}"
    else
      echo -e "${RED}Aborted. Please create the branch manually.${NC}"
      exit 1
    fi
  else
    git checkout "$BRANCH_NAME"
  fi
  
  # Push to GitHub
  echo -e "${GREEN}Pushing to GitHub...${NC}"
  git push -u origin "$BRANCH_NAME"
  
  echo -e "${GREEN}Changes pushed to GitHub successfully!${NC}"
else
  echo -e "${YELLOW}Skipping push to GitHub${NC}"
fi

# Final message
echo -e "${GREEN}All done!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo -e "1. Check your GitHub repository to make sure the changes were pushed correctly"
echo -e "2. Run './publish-packages.sh' to publish the packages to npm if you haven't already"
