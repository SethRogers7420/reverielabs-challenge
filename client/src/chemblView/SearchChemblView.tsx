import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { FC, useState } from "react";
import { useQuery } from "react-query";
import { getChemblData } from "../api/getChemblData";
import { ErrorPage } from "../errors/ErrorPage";
import MoleculeStructure from "./molecule/MoleculeView";

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
            <h2>Selected Smiles</h2>

            {data.selectedSmiles.map((smiles) => (
              <MoleculeStructure
                id={smiles}
                structure={smiles}
                height={200}
                width={200}
                svgMode
              />
            ))}
          </div>
        )}
      </>
    </div>
  );
};
