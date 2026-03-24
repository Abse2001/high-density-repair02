import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialState } from "./visualize-solver"

test("visual snapshot: sample5015 initial state", async () => {
  const graphics = renderInitialState("sample5015")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
