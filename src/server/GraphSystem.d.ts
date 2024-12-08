export default interface IGraph {
	/**
	 * Creates, adds, and rebuilds a new node in the graph.
	 * 
	 * @param position Position in world space of the node to add
	 * @returns Index of the added node
	 */
	addNode(position: Vector3): number;

	/**
	 * Creates, adds, and rebuilds a new link in the graph.
	 * @param node0Index 
	 * @param node1Index 
	 */
	addLink(node0Index: number, node1Index: number): number;

	/**
	 * Gets the node by its index, or returns undefined if it's not listed.
	 * 
	 * @param index Index of the node
	 */
	getNodeByIndex(index: number): INode | undefined;

	/**
	 * Gets the link by its index, or returns undefined if it's not listed.
	 * 
	 * @param index Index of the link
	 */
	getLinkByIndex(index: number): ILink | undefined;

	getConnectedNodes(rootIndex: number): INode[];
}

export interface INode {
	getPosition(): Vector3;
}

export interface ILink {
	node0: number;
	node1: number;
	
	getNode0(): INode | undefined;

	getNode1(): INode | undefined;
}