import { makeGetRequest } from "./makeGetRequest";

type ChemblData = {};

/** Returns a list of participants and their diagnoses. */
export async function getChemblData(chemblId: string): Promise<ChemblData[]> {
  if (chemblId == null || chemblId.length === 0) {
    return [];
  }

  const chemblData = await makeGetRequest<ChemblData[]>(`/chembl/${chemblId}`);

  return chemblData;
}
