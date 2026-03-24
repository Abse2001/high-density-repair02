import { getDatasetSample } from "fixtures/dataset"
import { HighDensityRepairSolver } from "lib/high-density-repair-solver"

export const renderInitialState = (sampleName: string) => {
  const sample = getDatasetSample(sampleName)
  const solver = new HighDensityRepairSolver({ sample })
  return solver.visualize()
}
