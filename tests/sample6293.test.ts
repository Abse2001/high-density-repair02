import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialState } from "./visualize-solver"

test("visual snapshot: sample6293 initial state", async () => {
  const graphics = renderInitialState("sample6293")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
