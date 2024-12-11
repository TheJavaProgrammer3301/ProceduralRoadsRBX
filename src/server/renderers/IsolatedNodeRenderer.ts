import IntersectionRenderer from "../old/intersections/IntersectionRenderer";

/**
 * Used to render completely isolated nodes with no connections. Renders a circle.
 */
export default class IsolatedNodeRenderer extends IntersectionRenderer {
    private editableMesh?: EditableMesh;

    /**
     * Initializes resources for rendering the isolated node.
     */
    initialize(): void {
        const node = this.graph.getNodeByIndex(this.nodeIndex);
        if (!node) {
            throw `Node with index ${this.nodeIndex} does not exist in the graph.`;
        }

        // Create an EditableMesh to represent the isolated node
        this.editableMesh = new EditableMesh("IsolatedNodeMesh");

        const position = node.getPosition();
        const radius = 5; // Example radius for the circle
        const segments = 24; // Number of segments to form the circle

        for (let i = 0; i < segments; i++) {
            const angle1 = (i / segments) * 2 * math.pi;
            const angle2 = ((i + 1) / segments) * 2 * math.pi;

            const x1 = position.X + radius * math.cos(angle1);
            const z1 = position.Z + radius * math.sin(angle1);

            const x2 = position.X + radius * math.cos(angle2);
            const z2 = position.Z + radius * math.sin(angle2);

            // Add triangle to the EditableMesh
            this.editableMesh.addTriangle(
                new Vector3(position.X, position.Y, position.Z), // Center point
                new Vector3(x1, position.Y, z1),
                new Vector3(x2, position.Y, z2)
            );
        }

        this.editableMesh.finalize();
    }

    /**
     * Renders the isolated node using the EditableMesh.
     */
    render(): void {
        if (!this.editableMesh) {
            throw "EditableMesh has not been initialized. Call initialize() first.";
        }

        this.editableMesh.render();
    }

    /**
     * Disposes of the resources used by this renderer.
     */
    dispose(): void {
        if (this.editableMesh) {
            this.editableMesh.destroy();
            this.editableMesh = undefined;
        }
    }
}

class EditableMesh {
    private vertices: Vector3[] = [];
    private triangles: [number, number, number][] = [];
    private finalized: boolean = false;

    constructor(private name: string) {}

    addTriangle(v1: Vector3, v2: Vector3, v3: Vector3): void {
        if (this.finalized) {
            throw "Cannot add triangles to a finalized mesh.";
        }

        const index1 = this.vertices.push(v1) - 1;
        const index2 = this.vertices.push(v2) - 1;
        const index3 = this.vertices.push(v3) - 1;

        this.triangles.push([index1, index2, index3]);
    }

    finalize(): void {
        if (this.finalized) {
            throw "Mesh is already finalized.";
        }

        // Finalize mesh data for rendering (e.g., send data to the GPU)
        this.finalized = true;
		print(`${this.name} finalized with ${this.vertices.size()} vertices and ${this.triangles.size()} triangles.`);
    }

    render(): void {
        if (!this.finalized) {
            throw "Mesh must be finalized before rendering.";
        }

        // Render the mesh (e.g., using Roblox's 3D rendering APIs)
       	print(`Rendering ${this.name}`);
    }

    destroy(): void {
        // Clean up resources
        this.vertices = [];
        this.triangles = [];
        this.finalized = false;
        print(`${this.name} destroyed.`);
    }
}
