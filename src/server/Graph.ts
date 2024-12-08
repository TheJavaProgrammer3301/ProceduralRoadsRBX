import IGraph from "./GraphSystem";
import { INode } from "./GraphSystem";
import Intersection from "./intersections/Intersection";
import Segment from "./segments/Segment";

export class Node implements INode {
	private position: Vector3;

	constructor(position: Vector3) {
		this.position = position;
	}

	getPosition() {
		return this.position;
	}
}

export class Link implements Link {
	node0: number;
	node1: number;

	private graph?: Graph;

	constructor(node0: number, node1: number, graph?: Graph) {
		this.node0 = node0;
		this.node1 = node1;
		this.graph = graph;
	}

	getNode0() {
		return this.graph?.nodes[this.node0];
	}

	getNode1() {
		return this.graph?.nodes[this.node1];
	}
}

export default class Graph implements IGraph {
	nodes: Node[] = [];
	links: Link[] = [];

	private intersections: Map<number, Intersection> = new Map();
	private segments: Map<number, Segment> = new Map();

	constructor() {

	}

	/**
	 * Creates, adds, and rebuilds a new node in the graph.
	 * 
	 * @param position Position in world space of the node to add
	 * @returns Index of the added node
	 */
	addNode(position: Vector3): number {
		const node = new Node(position);
		const index = this.nodes.push(node);

		this.intersections.set(index, new Intersection(this, index));
		this.intersections.get(index)?.rebuild();

		return index;
	}

	/**
	 * Creates, adds, and rebuilds a new link in the graph.
	 * @param node0Index 
	 * @param node1Index 
	 */
	addLink(node0Index: number, node1Index: number): number {
		const link = new Link(node0Index, node1Index);
		const index = this.links.push(link);

		return index;
	}

	/**
	 * Gets the node by its index, or returns undefined if it's not listed.
	 * 
	 * @param index Index of the node
	 */
	getNodeByIndex(index: number): Node | undefined {
		return this.nodes[index];
	}

	/**
	 * Gets the link by its index, or returns undefined if it's not listed.
	 * 
	 * @param index Index of the link
	 */
	getLinkByIndex(index: number): Link | undefined {
		return this.links[index];
	}

	getConnectedNodes(rootIndex: number): INode[] {
		return this.links.filter(link => link.node0 === rootIndex || link.node1 === rootIndex).map(link => this.getNodeByIndex(link.node0 === rootIndex ? link.node1 : link.node0) as Node);
	}
}