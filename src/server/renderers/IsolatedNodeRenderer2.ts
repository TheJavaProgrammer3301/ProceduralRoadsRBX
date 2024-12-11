import IntersectionRenderer from "../old/intersections/IntersectionRenderer";

/**
 * Used to render completely isolated nodes with no connections. Renders a circle.
 */
export default class IsolatedNodeRenderer extends IntersectionRenderer {
	initialize(): void {
		
	}

	render(): void {
		print("hi");
	}

	dispose(): void {
		
	}
}