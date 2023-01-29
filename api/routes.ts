import express from "express";
import cors from "cors";
import { getCompoundFromChembl } from "./services/chemblDB/getCompoundFromChembl";

export const app = express();

// Allow the client to get through our CORS check.
// This environment variable is set by the dotenv-cli and can be configured for different environments.
// See: https://github.com/entropitor/dotenv-cli#cascading-env-variables
app.use(
  cors({
    origin: process.env.CLIENT_URL
  })
);

app.get("/chembl/:id", async (req, res) => {
  const chemblID = req.params.id;

  const chemblInfo = await getCompoundFromChembl(chemblID);

  res.json(chemblInfo);
});
