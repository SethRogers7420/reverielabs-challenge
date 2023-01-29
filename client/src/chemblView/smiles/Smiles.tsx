import { FC } from "react";
import { SmileInfo } from "../../api/getChemblData";
import MoleculeStructure from "../molecule/MoleculeView";
import "./Smiles.scss";

type SmilesProps = {
  smiles: SmileInfo;
};

export const Smiles: FC<SmilesProps> = (props) => {
  const { smiles } = props;

  return (
    <div className="smiles-container">
      <b>{smiles.molecule_chembl_id}</b>
      <MoleculeStructure
        id={smiles.smiles}
        structure={smiles.smiles}
        height={200}
        width={200}
        svgMode
      />
    </div>
  );
};
