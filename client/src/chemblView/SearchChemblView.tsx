import "./SearchChemblView.scss";
import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { getChemblData } from "../api/getChemblData";
import { ErrorPage } from "../errors/ErrorPage";
import { Smiles } from "./smiles/Smiles";
import { IC50Histogram } from "./histogram/IC50Histogram";
import { ScatterMoleculeWeightAgainstIC50 } from "./scatterChart/ScatterMoleculeWeightAgainstIC50";

export const SearchChemblView: FC = () => {
  const [chemblIdToSearch, setChemblIdToSearch] = useState("");

  const { isLoading, error, data, refetch } = useQuery(
    ["chemblData", chemblIdToSearch],
    () => getChemblData(chemblIdToSearch),
    {
      // Do not run when focusing the window
      refetchOnWindowFocus: false,
      // Do not run the query unless we call refetch
      enabled: false
    }
  );

  return (
    <div>
      <>
        <Box
          sx={{
            width: 350,
            margin: "auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <TextField
            label="Enter Chembl ID"
            variant="outlined"
            onChange={(event) => setChemblIdToSearch(event.target.value)}
          />

          <Button variant="contained" color="primary" onClick={() => refetch()}>
            Search
          </Button>
        </Box>

        {isLoading && <CircularProgress />}

        {error && <ErrorPage error={error} />}

        {data != null && (
          <div>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <h2>Histogram</h2>
              <IC50Histogram chemblInfo={data} />
            </Box>

            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <h2>Scatter Plot</h2>
              <ScatterMoleculeWeightAgainstIC50 chemblInfo={data} />
            </Box>

            <div>
              <h2>Selected Smiles</h2>
              <div className="searchChemblView-smilesList">
                {data.selectedSmiles.map((smiles) => (
                  <Smiles key={smiles.molecule_chembl_id} smiles={smiles} />
                ))}
              </div>
            </div>
          </div>
        )}
      </>
    </div>
  );
};
