# et-ccd-definitions-scotland

## Overview

Reform Employment Tribunals (RET) configuration definitions for CCD Scotland.

## Setup

### Pre-requirements

Windows users must ensure they use Windows Subsystem for Linux also known as WSL 2 (https://docs.microsoft.com/en-us/windows/wsl/install) for local development. Afterwards install Install nvm, node.js, and npm (https://docs.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl).

Install nvm to manage node from https://github.com/nvm-sh/nvm

Install required node version using `nvm install`

### Install

Run `yarn install && yarn setup` to install the dependencies for both this project and the submodule.

## ccd-definition-processor

This repo makes use of CCD Definition Processor code duplicated from the main repo (https://github.com/hmcts/ccd-definition-processor) to generate the excel file. You may have to update this repo and the main CD Definition Processor repo if, for example, you need to add a column to the definitions spreadsheet.

Ideally this should be a published NPM package, so that we can include it in package.json.

## Features

### Variable substitution

A `json2xlsx` processor replaces variable placeholders defined in JSON definition files with values read from environment variables as long as variable name starts with `CCD_DEF` prefix.

For example `CCD_DEF_BASE_URL=http://localhost` environment variable gets injected into a fragment of the following CCD definition:

```json
[
  {
    "LiveFrom": "2017-01-01",
    "CaseTypeID": "DRAFT",
    "ID": "initiateCase",
    "CallBackURLSubmittedEvent": "${CCD_DEF_BASE_URL}/callback"
  }
]
```

to become:

```json
[
  {
    "LiveFrom": "2017-01-01",
    "CaseTypeID": "DRAFT",
    "ID": "initiateCase",
    "CallBackURLSubmittedEvent": "http://localhost/callback"
  }
]
```

## Dependencies

Dependencies have to be installed prior to first use by running:

```sh
$ yarn install
$ npm i prettier
$ npm i pretty-quick
```

## Usage

The following commands are available:

###  Convert JSON to Excel

_For all environments_

**yarn generate-excel-all** to generate excel configs for all environments (Local, Demo, AAT, Prod, Perftest)

The generated excel files will be in definitions/xlsx.

_For a specific environment_

yarn generate-excel-(local\demo\aat\prod)

For example:

**yarn generate-excel-aat**

###  Convert Excel to JSON

If you prefer to make the changes directly on the excel file, and then convert back to JSON:

Generate a fresh base Excel file using yarn generate-excel. The generated excel file will be in definitions/xlsx/ccd-config-base.xlsx and will contain placeholder URLs.
Make the changes to ccd-config-base.xlsx but **ensure you don't have any environment-specific URLs** (use placeholders instead).
Once you're satisfied with your changes in the Excel file, convert back to JSON using yarn generate-json.
Review the JSON file changes to ensure all your changes are correct.
