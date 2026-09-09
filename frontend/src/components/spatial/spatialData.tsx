import React from "react";
import { TraceNetwork } from "@/components/visualizations/TraceNetwork";
import { TelemetryField } from "@/components/visualizations/TelemetryField";
import { EvaluationSignal } from "@/components/visualizations/EvaluationSignal";
import { IncidentSignal } from "@/components/visualizations/IncidentSignal";
import { OptimizationPath } from "@/components/visualizations/OptimizationPath";

export interface SpatialNodeData {
  id: string;
  label: string;
  hash: string;
  component: React.ReactNode;
}

export const spatialNodes: SpatialNodeData[] = [
  {
    id: "observe",
    label: "OBSERVE",
    hash: "#observe",
    component: <TelemetryField />,
  },
  {
    id: "trace",
    label: "TRACE",
    hash: "#trace",
    component: <TraceNetwork />,
  },
  {
    id: "evaluate",
    label: "EVALUATE",
    hash: "#evaluate",
    component: <EvaluationSignal />,
  },
  {
    id: "diagnose",
    label: "DIAGNOSE",
    hash: "#diagnose",
    component: <IncidentSignal />,
  },
  {
    id: "optimize",
    label: "OPTIMIZE",
    hash: "#optimize",
    component: <OptimizationPath />,
  },
];
