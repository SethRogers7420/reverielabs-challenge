import { isEmpty } from "lodash";
import { ChemblRow, makePOSTRequestToChembl } from "./makePOSTRequestToChembl";
import * as mathjs from "mathjs";

import { Cache } from "../memoryCache/cacheTypes";

export type ChemblInfo = {
  moleculeInfo: MoleculeInfo[];
  ic50Aggregate: {
    mean: number;
    median: number;
    standardDeviation: number;
  } | null;
  selectedSmiles: SmileInfo[];
};

export type MoleculeInfo = {
  molecule_chembl_id: string;
  pchembl_value: number | null;
  full_mwt: number | null;
};

export type SmileInfo = { molecule_chembl_id: string; smiles: string };

export async function getCompoundFromChembl(
  chemblID: string,
  cache: Cache<ChemblInfo>
): Promise<ChemblInfo> {
  if (isEmpty(chemblID)) {
    throw new Error("Expected a chembl ID to be passed in");
  }

  const cachedChemblRows = await cache.getFromCache(chemblID);

  if (cachedChemblRows != null) {
    return cachedChemblRows;
  }

  // Get all our rows from chembl, this handles the pagination limits on the API.
  const chemblRows = await getAllChemblRows(chemblID);

  // Get all the valid IC50 numbers, removing strings or nulls.
  const ic50numbers = getIC50Values(chemblRows);

  const moleculeInfo = getMoleculeInfo(chemblRows);

  const chemblInfo: ChemblInfo = {
    moleculeInfo,
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

  await cache.addToCache(chemblID, chemblInfo);

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
    const ic50 = stringToFloat(chemblRow._source.pchembl_value);
    if (ic50 == null) {
      continue;
    }

    ic50numbers.push(ic50);
  }

  return ic50numbers;
}

function getSelectedSmiles(chemblRows: ChemblRow[]): SmileInfo[] {
  const smiles: SmileInfo[] = [];

  for (const chemblRow of chemblRows) {
    if (isEmpty(chemblRow._source.canonical_smiles)) {
      continue;
    }

    if (
      smiles.some(
        (smile) =>
          smile.molecule_chembl_id === chemblRow._source.molecule_chembl_id
      )
    ) {
      continue;
    }

    smiles.push({
      molecule_chembl_id: chemblRow._source.molecule_chembl_id,
      smiles: chemblRow._source.canonical_smiles
    });

    // Take the first 5 smiles.
    if (smiles.length >= 5) {
      break;
    }
  }

  return smiles;
}

function getMoleculeInfo(chemblRows: ChemblRow[]): MoleculeInfo[] {
  return chemblRows.map<MoleculeInfo>((chemblRow) => {
    return {
      molecule_chembl_id: chemblRow._source.molecule_chembl_id,
      full_mwt: stringToFloat(
        chemblRow._source._metadata?.parent_molecule_data?.full_mwt
      ),
      pchembl_value: stringToFloat(chemblRow._source.pchembl_value)
    };
  });
}

function stringToFloat(str: string | null | undefined): number | null {
  let float = str != null ? parseFloat(str) : null;
  if (float != null && isNaN(float)) {
    float = null;
  }

  return float;
}
