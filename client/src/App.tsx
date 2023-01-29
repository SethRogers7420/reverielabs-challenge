import { FC } from "react";
import "./App.scss";
import { SearchChemblView } from "./chemblView/SearchChemblView";

export const App: FC = () => {
  return (
    <div className="App">
      <main>
        <SearchChemblView />
      </main>
    </div>
  );
};

export default App;
