namespace GraphDescriptions {
	export interface SectionDescription {
		material: Enum.Material,
		color: Color3,
		width: number,
		vertices: Vector3[]
	}

	export interface RoadDescription {
		sections: SectionDescription[],
		widthOffset: number,
	}
}

export default GraphDescriptions;