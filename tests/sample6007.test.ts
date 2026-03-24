import { expect, test } from "bun:test"
import "graphics-debug/matcher"
import { renderInitialState } from "./visualize-solver"

test("visual snapshot: sample6007 initial state", async () => {
  const graphics = renderInitialState("sample6007")
  await expect(graphics).toMatchGraphicsSvg(import.meta.path)
})
