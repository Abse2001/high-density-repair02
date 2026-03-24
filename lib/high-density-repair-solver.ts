import { BaseSolver } from "@tscircuit/solver-utils"
import type { GraphicsObject } from "graphics-debug"

type XY = { x: number; y: number }
type RoutePoint = XY & { z?: number }
type PortPoint = XY & { connectionName?: string; portPointId?: string }
type HdRoute = {
  connectionName?: string
  route?: RoutePoint[]
  traceThickness?: number
  vias?: Array<{ x: number; y: number; diameter?: number }>
  viaDiameter?: number
}
type Obstacle = {
  type?: string
  center?: XY
  width?: number
  height?: number
}
export type DatasetSample = {
  nodeWithPortPoints?: {
    capacityMeshNodeId?: string
    center?: XY
    width?: number
    height?: number
    portPoints?: PortPoint[]
  }
  nodeHdRoutes?: HdRoute[]
  adjacentObstacles?: Obstacle[]
}

export interface HighDensityRepairSolverParams {
  sample?: DatasetSample
}

const TOP_LAYER_COLOR = "#FF0000"
const BOTTOM_LAYER_COLOR = "#0000FF"
const DEFAULT_TRACE_THICKNESS = 0.15

const getRoutePointLayer = (point?: RoutePoint): "top" | "bottom" =>
  point?.z === 1 ? "bottom" : "top"

const getRouteStrokeColor = (layer: "top" | "bottom") =>
  layer === "bottom" ? BOTTOM_LAYER_COLOR : TOP_LAYER_COLOR

const splitRouteIntoLayerSegments = (route: HdRoute) => {
  const routePoints = route.route ?? []
  const lines: Array<{
    points: XY[]
    strokeColor: string
    strokeWidth: number
    label: string
  }> = []

  if (routePoints.length < 2) return lines

  let currentLayer = getRoutePointLayer(routePoints[0])
  let currentSegment: XY[] = [routePoints[0]]

  for (let index = 1; index < routePoints.length; index += 1) {
    const point = routePoints[index]
    const pointLayer = getRoutePointLayer(point)

    if (pointLayer !== currentLayer) {
      if (currentSegment.length >= 2) {
        lines.push({
          points: currentSegment,
          strokeColor: getRouteStrokeColor(currentLayer),
          strokeWidth: route.traceThickness ?? DEFAULT_TRACE_THICKNESS,
          label: route.connectionName ?? "route",
        })
      }
      currentLayer = pointLayer
      currentSegment = [routePoints[index - 1], point]
      continue
    }

    currentSegment.push(point)
  }

  if (currentSegment.length >= 2) {
    lines.push({
      points: currentSegment,
      strokeColor: getRouteStrokeColor(currentLayer),
      strokeWidth: route.traceThickness ?? DEFAULT_TRACE_THICKNESS,
      label: route.connectionName ?? "route",
    })
  }

  return lines
}

export class HighDensityRepairSolver extends BaseSolver {
  constructor(public readonly params: HighDensityRepairSolverParams = {}) {
    super()
  }

  override _step(): void {
    this.solved = true
  }

  override visualize(): GraphicsObject {
    const sample = this.params.sample
    const node = sample?.nodeWithPortPoints
    const routes = sample?.nodeHdRoutes ?? []
    const obstacles = sample?.adjacentObstacles ?? []

    const nodeRect =
      node?.center && node.width && node.height
        ? [
            {
              center: node.center,
              width: node.width,
              height: node.height,
              stroke: "#1d4ed8",
              fill: "rgba(29, 78, 216, 0.1)",
              label: node.capacityMeshNodeId ?? "capacity-node",
            },
          ]
        : []

    const obstacleRects = obstacles
      .filter(
        (obstacle) => obstacle.center && obstacle.width && obstacle.height,
      )
      .map((obstacle, idx) => ({
        center: obstacle.center as XY,
        width: obstacle.width as number,
        height: obstacle.height as number,
        stroke: obstacle.type === "oval" ? "#a855f7" : "#dc2626",
        fill:
          obstacle.type === "oval"
            ? "rgba(168, 85, 247, 0.15)"
            : "rgba(220, 38, 38, 0.12)",
        label: obstacle.type
          ? `obstacle:${obstacle.type}:${idx}`
          : `obstacle:${idx}`,
      }))

    const points = [
      ...(node?.portPoints ?? []).map((portPoint) => ({
        x: portPoint.x,
        y: portPoint.y,
        color: "#0f766e",
        label:
          portPoint.connectionName ?? portPoint.portPointId ?? "port-point",
      })),
      ...routes
        .flatMap((route) => route.route ?? [])
        .map((routePoint) => ({
          x: routePoint.x,
          y: routePoint.y,
          color:
            getRoutePointLayer(routePoint) === "bottom"
              ? BOTTOM_LAYER_COLOR
              : "#0ea5e9",
        })),
    ]

    const lines = routes
      .filter((route) => (route.route?.length ?? 0) >= 2)
      .flatMap((route) => splitRouteIntoLayerSegments(route))

    const circles = routes.flatMap((route) =>
      (route.vias ?? []).map((via) => ({
        center: { x: via.x, y: via.y },
        radius: (via.diameter ?? route.viaDiameter ?? 0.3) / 2,
        stroke: "#7c3aed",
        fill: "rgba(124, 58, 237, 0.2)",
        label: route.connectionName ? `via:${route.connectionName}` : "via",
      })),
    )

    return {
      coordinateSystem: "cartesian",
      title: "HighDensityRepair02 Initial State",
      rects: [...nodeRect, ...obstacleRects],
      points,
      lines,
      circles,
    }
  }
}
