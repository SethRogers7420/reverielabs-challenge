import express from "express";
import cors from "cors";
import {
  ChemblInfo,
  getCompoundFromChembl
} from "./services/chemblDB/getCompoundFromChembl";
import path from "path";
import { makeMemoryCache } from "./services/memoryCache/memoryCache";

export const app = express();

// Allow the client to get through our CORS check.
// This environment variable is set by the dotenv-cli and can be configured for different environments.
// See: https://github.com/entropitor/dotenv-cli#cascading-env-variables
app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);

const chemblCache = makeMemoryCache<ChemblInfo>();

/**
 * Example: http://localhost:7000/chembl/CHEMBL203
 *
 * Sends meta-information about the molecules from Chembl.
 */
app.get("/chembl/:id", async (req, res) => {
  const chemblID = req.params.id;

  const chemblInfo = await getCompoundFromChembl(chemblID, chemblCache);

  res.json(chemblInfo);
});

// Hacky serving of create-react-app in a node server
// In a real app this should serve the `client/build` folder from a CDN like CloudFront or Azure CDN.
// See: https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
app.use(express.static(path.join(__dirname, "../client/build")));

app.get("/*", function (req, res) {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});
