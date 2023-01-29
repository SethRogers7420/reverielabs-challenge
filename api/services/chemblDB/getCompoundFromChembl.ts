import { isEmpty } from "lodash";
import { ChemblRow, makePOSTRequestToChembl } from "./makePOSTRequestToChembl";
import * as mathjs from "mathjs";

export type ChemblInfo = {
  ic50Info: {
    mean: number;
    median: number;
    standardDeviation: number;
  };
};

export async function getCompoundFromChembl(
  chemblID: string
): Promise<ChemblInfo> {
  if (isEmpty(chemblID)) {
    throw new Error("Expected a chembl ID to be passed in");
  }

  // Get all our rows from chembl, this handles the pagination limits on the API.
  const chemblRows = await getAllChemblRows(chemblID);

  // Get all the valid IC50 numbers, removing strings or nulls.
  const ic50numbers = getIC50Values(chemblRows);

  return {
    ic50Info: {
      mean: mathjs.mean(ic50numbers),
      median: mathjs.median(ic50numbers),
      standardDeviation: mathjs.std(...ic50numbers)
    }
  };
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
