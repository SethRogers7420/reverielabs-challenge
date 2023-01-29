import axios from "axios";

export type ChemblRawHit = {
  _index: string;
  _type: string;
  _id: string;
  _score: number;
  _source: {
    standard_units: string;
    standard_type: string;
    standard_relation: string;
    data_validity_comment: string;
    activity_comment: string;
    target_pref_name: string;
    bao_label: string;
    pchembl_value: string | null;
    assay_chembl_id: string;
    molecule_pref_name: string;
    document_chembl_id: string;
    activity_id: number;
    target_chembl_id: string;
    molecule_chembl_id: string;
    _metadata: {
      target_data: { target_type: string };
      parent_molecule_data: {
        full_mwt: string;
        alogp: string;
        num_ro5_violations: number;
        max_phase: number;
        compound_key: string;
      };
      source: { src_description: string };
    };
    standard_value: string;
    assay_type: string;
    document_year: number;
    src_id: number;
    target_organism: string;
    canonical_smiles: string;
    potential_duplicate: number;
    document_journal: string;
    uo_units: string;
    assay_description: string;
    bao_format: string;
    assay_variant_accession: null;
  };
};

export type ChemblRawResponse = {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    successful: number;
    skipped: number;
    failed: number;
  };
  hits: {
    max_score: number;
    hits: ChemblRawHit[];
  };
};

/**
 * Makes a request to the chembl database to load information about a compound.
 * The chembl API only allows 10,000 records in a response and we need to use cursor-based pagination to get the rest.
 * Pass in the previous `molecule_chembl_id` field to get the next 10,000 records.
 *
 * @param chemblID - The id of the compound we are requesting from chembl
 * @param previousMoleculeChemblId
 */
export async function makePOSTRequestToChembl(
  chemblID: string,
  previousMoleculeChemblId?: string
): Promise<ChemblRawResponse> {
  let url = "https://www.ebi.ac.uk/chembl/elk/es/chembl_activity/_search";

  const chemblResponse = await axios.post<ChemblRawResponse>(url, {
    size: 10000,
    from: 0,
    _source: [
      "molecule_chembl_id",
      "_metadata.parent_molecule_data.compound_key",
      "standard_type",
      "standard_relation",
      "standard_value",
      "standard_units",
      "pchembl_value",
      "activity_comment",
      "assay_chembl_id",
      "assay_description",
      "bao_label",
      "_metadata.assay_data.assay_organism",
      "target_chembl_id",
      "target_pref_name",
      "target_organism",
      "_metadata.target_data.target_type",
      "document_chembl_id",
      "_metadata.source.src_description",
      "_metadata.assay_data.cell_chembl_id",
      "molecule_pref_name",
      "_metadata.parent_molecule_data.max_phase",
      "_metadata.parent_molecule_data.full_mwt",
      "_metadata.parent_molecule_data.num_ro5_violations",
      "_metadata.parent_molecule_data.alogp",
      "canonical_smiles",
      "data_validity_comment",
      "uo_units",
      "ligand_efficiency.bei",
      "ligand_efficiency.le",
      "ligand_efficiency.lle",
      "ligand_efficiency.sei",
      "potential_duplicate",
      "assay_type",
      "bao_format",
      "_metadata.assay_data.tissue_chembl_id",
      "_metadata.assay_data.assay_tissue",
      "_metadata.assay_data.assay_cell_type",
      "_metadata.assay_data.assay_subcellular_fraction",
      "_metadata.assay_data.assay_parameters",
      "assay_variant_accession",
      "assay_variant_mutation",
      "src_id",
      "document_journal",
      "document_year",
      "activity_properties",
      "_metadata.parent_molecule_data.image_file",
      "activity_id"
    ],
    query: {
      bool: {
        must: [
          {
            query_string: {
              analyze_wildcard: true,
              query: `target_chembl_id:${chemblID} AND standard_type:("IC50")${
                previousMoleculeChemblId != null
                  ? ` and molecule_chembl_id:(>${previousMoleculeChemblId})`
                  : ""
              } `
            }
          }
        ],
        filter: []
      }
    },
    track_total_hits: true,
    // Sort by the molecule chembl ID so we can do cursor based pagination.
    sort: [
      {
        molecule_chembl_id: {
          order: "asc"
        }
      }
    ]
  });

  return chemblResponse.data;
}
