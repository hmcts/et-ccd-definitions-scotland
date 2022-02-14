# et-ccd-definitions-scotland

## Overview

Reform Employment Tribunals (RET) configuration definitions for CCD Scotland.

## Setup

### Pre-requirements 

Install nvm to manage node from https://github.com/nvm-sh/nvm

Install required node version using `nvm install`

### Install

Run `yarn install && yarn setup` to install the dependencies for both this project and the submodule.

## ccd-definition-processor

This repo makes use of https://github.com/hmcts/ccd-definition-processor to generate the excel file. You may have to update this repo if, for example, you need to add a column to the definitions spreadsheet.

Ideally this should be a published NPM package, so that we can include it in package.json but at the moment we include it as a git submodule.

A submodule is simply a pointer to a repo and a commit. If you want to reset that repo to the latest upstream master, run

```bash
yarn reset-ccd-submodule
```

You need to use this if you have accidentally change this pointer reference to something other than what you intended (you can instead modify the above command to package.json to check out a specific commit/version of that submodule).

It's also important to note that once you update to a new reference (i.e you commit a change to the `ccd-definition-processor` _file_) you need to make sure everyone else runs `yarn setup` again to get the updated reference as well.
