import IGraph from "server/old/GraphSystem";
import Road from "server/roads/Road";

export default abstract class IntersectionRenderer {
	abstract initialize(): void;
	abstract render(): void;
	abstract dispose(): void;

	protected nodeIndex: number;
	protected graph: IGraph;
	protected roadDescription: Road;

	constructor(nodeIndex: number, graph: IGraph, road: Road) {
		this.nodeIndex = nodeIndex;
		this.graph = graph;
		this.roadDescription = road;
	}
}