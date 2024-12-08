import IGraph from "server/GraphSystem";
import MeshObject from "../MeshObject";
import IntersectionRenderer from "./IntersectionRenderer";
import Object from "@rbxts/object-utils";
import IsolatedNodeRenderer from "./renderers/IsolatedNodeRenderer";
import GraphDescriptions from "server/roads/RoadDescription";

type RendererConstructor = {
	new(nodeIndex: number, graph: IGraph, roadDescription: GraphDescriptions.RoadDescription): IntersectionRenderer
}

const SidewalkSection: GraphDescriptions.SectionDescription = {
	material: Enum.Material.Concrete,
	color: BrickColor.Gray().Color,
	width: 16,
	vertices: [
		new Vector3(-8, 1, 0),
		new Vector3(8, 1, 0),
		new Vector3(8, -1, 0),
		new Vector3(-8, -1, 0),
	]
}

const ParkingSection: GraphDescriptions.SectionDescription = {
	material: Enum.Material.Asphalt,
	color: BrickColor.Black().Color,
	width: 12,
	vertices: [
		new Vector3(-6, 0, 0),
		new Vector3(6, 0, 0),
		new Vector3(6, -1, 0),
		new Vector3(-6, -1, 0),
	]
}

const RoadSection: GraphDescriptions.SectionDescription = {
	material: Enum.Material.Asphalt,
	color: BrickColor.Black().Color,
	width: 18,
	vertices: [
		new Vector3(-9, 0, 0),
		new Vector3(9, 0, 0),
		new Vector3(9, -1, 0),
		new Vector3(-9, -1, 0),
	]
}

const MarkedRoadSection: GraphDescriptions.SectionDescription = {
	material: Enum.Material.Asphalt,
	color: BrickColor.White().Color,
	width: 0,
	vertices: [
		new Vector3(-0.5, 0.05, 0),
		new Vector3(0.5, 0.05, 0),
		new Vector3(0.5, -0.05, 0),
		new Vector3(-0.5, -0.05, 0),
	]
}

const testDesc: GraphDescriptions.RoadDescription = {
	sections: [
		SidewalkSection,
		ParkingSection,
		RoadSection,
		MarkedRoadSection,
		RoadSection,
		ParkingSection,
		SidewalkSection
	],
	widthOffset: -23
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
			print(`Changing renderer!`);

			if (this.renderer) {
				this.renderer.dispose();
				this.renderer = undefined;
			}

			if (currentTargetRenderer) {
				this.renderer = new currentTargetRenderer(this.nodeIndex, this.graph, testDesc);
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