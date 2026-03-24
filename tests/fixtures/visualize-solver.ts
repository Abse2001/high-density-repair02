import { HighDensityRepairSolver } from "lib/high-density-repair-solver"
import { getDatasetSample } from "tests/fixtures/dataset"

export const renderInitialState = (sampleName: string) => {
  const sample = getDatasetSample(sampleName)
  const solver = new HighDensityRepairSolver({ sample })
  return solver.visualize()
}
