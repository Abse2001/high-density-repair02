import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialState } from "./visualize-solver"

test("visual snapshot: sample4538 initial state", async () => {
  const graphics = renderInitialState("sample4538")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
