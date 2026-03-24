import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialState } from "./visualize-solver"

test("visual snapshot: sample6592 initial state", async () => {
  const graphics = renderInitialState("sample6592")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
