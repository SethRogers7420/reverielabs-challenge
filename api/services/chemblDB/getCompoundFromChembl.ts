import { isEmpty } from "lodash";
import {
  ChemblRawHit,
  ChemblRawResponse,
  makePOSTRequestToChembl
} from "./makePOSTRequestToChembl";

export type ChemblInfo = {};

export async function getCompoundFromChembl(
  chemblID: string
): Promise<ChemblInfo> {
  if (isEmpty(chemblID)) {
    throw new Error("Expected a chembl ID to be passed in");
  }

  let chemblInfo = await getNextCompounds(chemblID, undefined);
  let allChemblInfo = [...chemblInfo];

  while (chemblInfo.length === 10000) {
    chemblInfo = await getNextCompounds(
      chemblID,
      allChemblInfo[allChemblInfo.length - 1]._source.molecule_chembl_id
    );
    allChemblInfo = [...allChemblInfo, ...chemblInfo];
  }

  return chemblInfo;
}

async function getNextCompounds(
  chemblID: string,
  previousMoleculeChemblId: string | undefined
): Promise<ChemblRawHit[]> {
  const chemblInfo = await makePOSTRequestToChembl(
    chemblID,
    previousMoleculeChemblId
  );

  return chemblInfo.hits.hits;
}
