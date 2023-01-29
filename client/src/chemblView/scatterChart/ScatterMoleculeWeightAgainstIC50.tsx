import { orderBy } from "lodash";
import { FC, useMemo } from "react";
import {
  CartesianGrid,
  Label,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ChemblInfo } from "../../api/getChemblData";

type ScatterData = {
  pchembl_value: number;
  full_mwt: number;
};

type ScatterMoleculeWeightAgainstIC50Props = {
  chemblInfo: ChemblInfo;
};

export const ScatterMoleculeWeightAgainstIC50: FC<
  ScatterMoleculeWeightAgainstIC50Props
> = (props) => {
  const { chemblInfo } = props;

  const chartData = useMemo<ScatterData[]>(() => {
    const data: ScatterData[] = [];

    const sortedMolecules = orderBy(
      chemblInfo.moleculeInfo,
      (molecule) => molecule.pchembl_value
    );

    let i = 0;

    for (const molecule of sortedMolecules) {
      if (molecule.full_mwt != null && molecule.pchembl_value != null) {
        // Only display some of our data as otherwise recharts lags out.
        if (i % 20 === 0) {
          data.push({
            full_mwt: molecule.full_mwt,
            pchembl_value: molecule.pchembl_value
          });
        }
        ++i;
      }
    }

    return data;
  }, [chemblInfo.moleculeInfo]);

  return (
    <ScatterChart
      width={900}
      height={450}
      margin={{ top: 20, right: 20, bottom: 20, left: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="pchembl_value" name="IC50">
        <Label value="IC50" offset={-10} position="insideBottom" />
      </XAxis>
      <YAxis
        dataKey="full_mwt"
        name="molecular weight"
        label={{
          value: "molecular weight",
          angle: -90,
          position: "insideLeft",
          textAnchor: "middle"
        }}
      />
      <Tooltip cursor={{ strokeDasharray: "3 3" }} />
      <Scatter name="Molecules" data={chartData} fill="#8884d8" />
    </ScatterChart>
  );
};
