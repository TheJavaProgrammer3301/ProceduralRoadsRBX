import IGraph from "server/GraphSystem";
import GraphDescriptions from "server/roads/RoadDescription";

export default abstract class IntersectionRenderer {
	abstract initialize(): void;
	abstract render(): void;
	abstract dispose(): void;

	protected nodeIndex: number;
	protected graph: IGraph;
	protected roadDescription: GraphDescriptions.RoadDescription;

	constructor(nodeIndex: number, graph: IGraph, roadDescription: GraphDescriptions.RoadDescription) {
		this.nodeIndex = nodeIndex;
		this.graph = graph;
		this.roadDescription = roadDescription;
	}
}