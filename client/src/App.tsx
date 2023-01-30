import { Container } from "@mui/material";
import { FC } from "react";
import "./App.scss";
import { SearchChemblView } from "./chemblView/SearchChemblView";

export const App: FC = () => {
  return (
    <div className="App">
      <main>
        <Container>
          <SearchChemblView />
        </Container>
      </main>
    </div>
  );
};

export default App;
