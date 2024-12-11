import IGraph from "server/old/GraphSystem";
import MeshObject from "../old/MeshObject";
import IntersectionRenderer from "./IntersectionRenderer";
import Object from "@rbxts/object-utils";
import IsolatedNodeRenderer from "../../renderers/IsolatedNodeRenderer";
import Road from "server/roads/Road";
import { RoadInfo, RoadLanes } from "server/roads/Lanes";

type RendererConstructor = {
	new(nodeIndex: number, graph: IGraph, roadDescription: Road): IntersectionRenderer
}

const testRoad: Road = {
	lanes: [
		new RoadLanes.SidewalkLane({
			direction: RoadInfo.LaneDirection.BACKWARD
		}),
		new RoadLanes.CarLane({
			direction: RoadInfo.LaneDirection.BACKWARD
		}),
		new RoadLanes.CarLane({
			direction: RoadInfo.LaneDirection.FORWARD
		}),
		new RoadLanes.CarLane({
			direction: RoadInfo.LaneDirection.FORWARD
		}),
		new RoadLanes.SidewalkLane({
			direction: RoadInfo.LaneDirection.FORWARD
		})
	]
}

export default class Intersection extends MeshObject {
	private renderer?: IntersectionRenderer;
	private graph: IGraph;
	private nodeIndex: number;

	private readonly renderers = new Map<number, RendererConstructor>([
		[0, IsolatedNodeRenderer]
	]);

	rebuild(): void {
		const currentTargetRenderer = this.getRenderer();

		if (!currentTargetRenderer || !(this.renderer instanceof currentTargetRenderer)) {
			print(`Changing renderer!`, currentTargetRenderer);

			if (this.renderer) {
				this.renderer.dispose();
				this.renderer = undefined;
			}

			if (currentTargetRenderer) {
				this.renderer = new currentTargetRenderer(this.nodeIndex, this.graph, testRoad);
				this.renderer.initialize();
			}
		}

		if (this.renderer) {
			this.renderer.render();
		}
	}

	getRenderer() {
		const connectionsCount = this.graph.getConnectedNodes(this.nodeIndex).size();
		const [index, rendererConstructor] = Object.entries(this.renderers).find(([index, value]) => index <= connectionsCount) ?? [];

		return rendererConstructor;
	}

	constructor(graph: IGraph, nodeIndex: number) {
		super();

		this.graph = graph;
		this.nodeIndex = nodeIndex;
	}

	getGraph() {
		return this.graph;
	}
}