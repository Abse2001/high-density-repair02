import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialState } from "./visualize-solver"

test("visual snapshot: sample2539 initial state", async () => {
  const graphics = renderInitialState("sample2539")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
