import { makeGetRequest } from "./makeGetRequest";

// This type should normally come from something like a Swagger file or a schema.graphql file if using GraphQL
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

/** Returns a list of participants and their diagnoses. */
export async function getChemblData(
  chemblId: string
): Promise<ChemblInfo | null> {
  if (chemblId == null || chemblId.length === 0) {
    return null;
  }

  const chemblData = await makeGetRequest<ChemblInfo>(`/chembl/${chemblId}`);

  return chemblData;
}
