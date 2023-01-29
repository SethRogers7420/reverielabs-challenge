import { isEmpty } from "lodash";
import { ChemblRow, makePOSTRequestToChembl } from "./makePOSTRequestToChembl";
import * as mathjs from "mathjs";

import { Cache } from "../memoryCache/cacheTypes";

export type ChemblInfo = {
  ic50Aggregate: {
    mean: number;
    median: number;
    standardDeviation: number;
  } | null;
  selectedSmiles: string[];
};

export async function getCompoundFromChembl(
  chemblID: string,
  cache: Cache<ChemblInfo>
): Promise<ChemblInfo> {
  if (isEmpty(chemblID)) {
    throw new Error("Expected a chembl ID to be passed in");
  }

  const cachedChemblRows = cache.getFromCache(chemblID);

  if (cachedChemblRows != null) {
    return cachedChemblRows;
  }

  // Get all our rows from chembl, this handles the pagination limits on the API.
  const chemblRows = await getAllChemblRows(chemblID);

  // Get all the valid IC50 numbers, removing strings or nulls.
  const ic50numbers = getIC50Values(chemblRows);

  const chemblInfo: ChemblInfo = {
    ic50Aggregate:
      ic50numbers.length > 0
        ? {
            mean: mathjs.mean(ic50numbers),
            median: mathjs.median(ic50numbers),
            standardDeviation: mathjs.std(...ic50numbers)
          }
        : null,
    selectedSmiles: getSelectedSmiles(chemblRows)
  };

  cache.addToCache(chemblID, chemblInfo);

  return chemblInfo;
}

async function getAllChemblRows(chemblID: string): Promise<ChemblRow[]> {
  let chemblRows = await getNextCompounds(chemblID, undefined);
  let allChemblRows = [...chemblRows];

  while (chemblRows.length === 10000) {
    const previousMoleculeChemblId =
      allChemblRows[allChemblRows.length - 1]._source.molecule_chembl_id;

    chemblRows = await getNextCompounds(chemblID, previousMoleculeChemblId);
    allChemblRows = [...allChemblRows, ...chemblRows];
  }

  return allChemblRows;
}

async function getNextCompounds(
  chemblID: string,
  previousMoleculeChemblId: string | undefined
): Promise<ChemblRow[]> {
  const chemblInfo = await makePOSTRequestToChembl(
    chemblID,
    previousMoleculeChemblId
  );

  return chemblInfo.hits.hits;
}

function getIC50Values(chemblRows: ChemblRow[]): number[] {
  const ic50numbers: number[] = [];

  for (const chemblRow of chemblRows) {
    const ic50string = chemblRow._source.pchembl_value;
    if (ic50string == null || isEmpty(ic50string)) {
      continue;
    }

    const ic50ParsedNumber = parseFloat(ic50string);
    if (isNaN(ic50ParsedNumber)) {
      continue;
    }

    ic50numbers.push(ic50ParsedNumber);
  }

  return ic50numbers;
}

function getSelectedSmiles(chemblRows: ChemblRow[]): string[] {
  const smiles: string[] = [];

  for (const chemblRow of chemblRows) {
    if (isEmpty(chemblRow._source.canonical_smiles)) {
      continue;
    }

    smiles.push(chemblRow._source.canonical_smiles);

    // Take the first 5 smiles.
    if (smiles.length >= 5) {
      break;
    }
  }

  return smiles;
}
