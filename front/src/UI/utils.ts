import { downloadCSV } from "react-admin";
import { ChartData } from "../dataProvider/sensor";

export type Exporter = (e: any) => void;

export const exporterFor: (data: ChartData[]) => Exporter = (data) => {
  return (e) => {
    e.preventDefault();
    e.stopPropagation();
    const header = "field,value,time";
    const body: string[] = [];
    data.forEach((d) => {
      body.push(`${String(d.field)},${JSON.stringify(d.value)},${d.time}`);
    });
    downloadCSV([header, ...body].join("\n"), `chart`);
  };
};
