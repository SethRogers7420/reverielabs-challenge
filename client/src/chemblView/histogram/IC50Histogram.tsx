import { groupBy } from "lodash";
import { FC, useMemo } from "react";
import {
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Bar,
  Label
} from "recharts";
import { ChemblInfo } from "../../api/getChemblData";

type IC50HistogramProps = {
  chemblInfo: ChemblInfo;
};

type HistogramData = {
  name: string;
  compoundCount: number;
};

export const IC50Histogram: FC<IC50HistogramProps> = (props) => {
  const { chemblInfo } = props;
  // Use 0-1, 1-2, 2-3, etc for our range.

  const data = useMemo<HistogramData[]>(() => {
    const groups = groupBy(
      chemblInfo.moleculeInfo.filter(
        (molecule) => molecule.pchembl_value != null
      ),
      (molecule) => Math.floor(molecule.pchembl_value!)
    );

    const histogramData: HistogramData[] = [];

    for (const key of Object.keys(groups)) {
      const range = `${parseInt(key)}-${parseInt(key) + 1}`;

      histogramData.push({
        name: range,
        compoundCount: groups[key].length
      });
    }

    return histogramData;
  }, [chemblInfo.moleculeInfo]);

  return (
    <BarChart
      width={800}
      height={400}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 15
      }}
      barSize={20}
    >
      <XAxis dataKey="name" scale="band" padding={{ left: 10, right: 10 }}>
        <Label value="IC50" offset={-10} position="insideBottom" />{" "}
      </XAxis>
      <YAxis
        label={{
          value: "compound count",
          angle: -90,
          position: "insideLeft",
          textAnchor: "middle"
        }}
      />
      <Tooltip />
      <CartesianGrid strokeDasharray="3 3" />
      <Bar
        dataKey="compoundCount"
        fill="#8884d8"
        background={{ fill: "#eee" }}
      />
    </BarChart>
  );
};
