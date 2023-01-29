import { makeGetRequest } from "./makeGetRequest";

// This type should normally come from something like a Swagger file or a schema.graphql file.
export type ChemblInfo = {
  ic50Aggregate: {
    mean: number;
    median: number;
    standardDeviation: number;
  } | null;
  selectedSmiles: SmileInfo[];
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
