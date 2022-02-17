const assert = require('assert');
const XLSX = require('xlsx');

const run = require('../main/json2xlsx');

const sheetNames = [
  'AuthorisationCaseEvent',
  'AuthorisationCaseField',
  'AuthorisationCaseState',
  'AuthorisationCaseType',
  'CaseEvent',
  'EventToComplexTypes',
  'CaseEventToFields',
  'CaseField',
  'CaseType',
  'CaseTypeTab',
  'ComplexTypes',
  'Jurisdiction',
  'SearchCaseResultFields',
  'SearchInputFields',
  'SearchResultFields',
  'State',
  'UserProfile',
  'WorkBasketInputFields',
  'WorkBasketResultFields'
];

describe('json2xlsx', () => {
  describe('validation', () => {
    it('should throw an error when sheets directory argument is not provided', async () => {
      try {
        await run({
          _: [],
          sheetsDir: '',
          destinationXlsx: './temp/ccd-definitions.xlsx'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: sheets directory argument (-D) is required');
      }
    });

    it('should throw an error when spreadsheet file argument is not provided', async () => {
      try {
        await run({
          _: [],
          sheetsDir: './temp',
          destinationXlsx: ''
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: spreadsheet file argument (-o) is required');
      }
    });
  });

  describe('outcome', () => {
    process.env.CCD_DEF_BASE_URL = 'http://localhost';

    it('should throw an error when json file does not have a matching sheet in the template spreadsheet', async () => {
      try {
        await run({
          _: ['unexpected'],
          sheetsDir: './src/test/fixtures/jsonErrorCaseDefinitions',
          destinationXlsx: './temp/ccd-definitions.xlsx'
        });
        assert.fail('No error has been thrown');
      } catch (err) {
        assert.equal(err, 'AssertionError [ERR_ASSERTION]: Unexpected spreadsheet data file "unexpected.json"');
      }
    });

    it('should create XLSX file from JSON fixtures', async () => {
      await run({
        sheetsDir: './src/test/fixtures/jsonDefinitions',
        destinationXlsx: './temp/ccd-definitions.xlsx'
      });

      const sheets = XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets;
      assert(Object.keys(sheets).length > 0, 'No sheets have been created');

      const assertCell = (sheetName, cell, expectedCellValue) => {
        const actualCellValue = expectedCellValue === undefined ? sheets[sheetName][cell] : sheets[sheetName][cell].v;
        assert.equal(actualCellValue, expectedCellValue, `Unexpected value found in ${cell} cell of ${sheetName} sheet`);
      };

      sheetNames.forEach(sheetName => {
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${sheetName} exists`);
        if (sheetName === 'AuthorisationCaseEvent') {
          assertCell(sheetName, 'B4', 'initiateCase');
          assertCell(sheetName, 'C4', 'caseworker-employment');
          assertCell(sheetName, 'D4', 'R');

          assertCell(sheetName, 'B5', 'initiateCase');
          assertCell(sheetName, 'C5', 'caseworker-employment-englandwales');
          assertCell(sheetName, 'D5', 'CRU');

          assertCell(sheetName, 'B6', 'initiateCase');
          assertCell(sheetName, 'C6', 'caseworker-employment-api');
          assertCell(sheetName, 'D6', 'CRUD');

          assertCell(sheetName, 'B7', 'preAcceptanceCase');
          assertCell(sheetName, 'C7', 'caseworker-employment');
          assertCell(sheetName, 'D7', 'R');

          assertCell(sheetName, 'B8', 'preAcceptanceCase');
          assertCell(sheetName, 'C8', 'caseworker-employment-englandwales');
          assertCell(sheetName, 'D8', 'CRU');

          assertCell(sheetName, 'B9', 'preAcceptanceCase');
          assertCell(sheetName, 'C9', 'caseworker-employment-api');
          assertCell(sheetName, 'D9', 'CRUD');
        }
        if (sheetName === 'AuthorisationCaseField') { // AuthorisationCaseField tab is built from JSON fragments

          assertCell(sheetName, 'C4', 'caseworker-employment');
          assertCell(sheetName, 'C5', 'caseworker-employment-englandwales');
        }
        if (sheetName === 'CaseEvent') { // CaseEvent tab has environment variable placeholders
          assertCell(sheetName, 'I4', '${CCD_DEF}/preDefaultValues');
        }
        if (sheetName === 'CaseEventToFields') {
          assertCell(sheetName, 'C4', 'receiptDate');
          assertCell(sheetName, 'D4', 'MANDATORY');
          assertCell(sheetName, 'E4', '1');
          assertCell(sheetName, 'F4', '1');
          assertCell(sheetName, 'G4', '1');
        }
        if (sheetName === 'FixedLists') { // FixedLists tab uniquely has 0 value that should be carried though
          assertCell(sheetName, 'D5', 0);
        }
        if (sheetName === 'CaseField') {
          assertCell(sheetName, 'A4', 'ET_EnglandWales');
          assertCell(sheetName, 'B4', 'tribunalCorrespondenceAddress');
          assertCell(sheetName, 'C4', 'Correspondence Address');
          assertCell(sheetName, 'D4', undefined);
          assertCell(sheetName, 'E4', 'AddressUK');
        }
        if (sheetName === 'ComplexType') {
          assertCell(sheetName, 'N3', 'Searchable');
          assertCell(sheetName, 'C4', 'UploadDocument');
          assertCell(sheetName, 'D4', 'typeOfDocument');
          assertCell(sheetName, 'E4', 'Document');
          assertCell(sheetName, 'N4', undefined);
          assertCell(sheetName, 'C5', 'GenerateDocument');
          assertCell(sheetName, 'D5', 'type');
          assertCell(sheetName, 'E5', 'Text');
          assertCell(sheetName, 'N5', 'N');
          assertCell(sheetName, 'O5', 'Y');
        }
        if (sheetName === 'EventToComplexTypes') {
          assertCell(sheetName, 'E4', 'Title');
          assertCell(sheetName, 'G4', '1');
          assertCell(sheetName, 'H4', 'OPTIONAL');
        }

      });

    });

    it('should create XLSX file from JSON fixtures with exclusions', async () => {
      await run({
        sheetsDir: './src/test/fixtures/jsonDefinitionsWithExclusions',
        destinationXlsx: './temp/ccd-definitions.xlsx',
        excludedFilenamePatterns: 'UserProfile.json,*-nonprod.json'
      });

      const sheets = XLSX.readFile('./temp/ccd-definitions.xlsx').Sheets;
      assert(Object.keys(sheets).length > 0, 'No sheets have been created');

      sheetNames.forEach(sheetName => {
        assert(sheets[sheetName], `No sheet corresponding to JSON file ${sheetName} exists`);
        if (sheetName === 'AuthorisationCaseField') { // AuthorisationCaseField tab uniquely is build from JSON fragments
          assert.equal(sheets[sheetName]['E5'], undefined, 'Solicitor entry should be excluded from the output XLSX file');
        }
        if (sheetName === 'UserProfile') { // UserProfile values should be excluded
          assert.equal(sheets[sheetName]['C4'], undefined, `User email should be excluded from the ${sheetName} sheet`);
        }
      });
    });
  });
});
