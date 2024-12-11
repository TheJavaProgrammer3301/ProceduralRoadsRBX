import Object from "@rbxts/object-utils"

export namespace RoadInfo {
	export enum GroundType {
		ASPHALT,
		TRAIN,
		GRAVEL,
		TILE
	}
	
	export enum LaneDecoration {
		GRASS,
		TREES
	}
	
	export enum MedianWidth {
		WIDE = 20,
		THIN = 8
	}
	
	export enum CarLaneWidth {
		WIDE = 16,
		THIN = 12
	}
	
	export enum LaneDirection {
		FORWARD,
		BACKWARD
	}
}

export namespace RoadLanes {
	export abstract class Lane<T extends Lane<T>> {
		constructor(init: Partial<T>) {
			Object.assign(this, init);
		}
	}

	export class EmptyLane extends Lane<EmptyLane> {
		groundType: RoadInfo.GroundType = RoadInfo.GroundType.ASPHALT;
	}

	export class MedianLane extends Lane<MedianLane> {
		width: RoadInfo.MedianWidth = RoadInfo.MedianWidth.THIN;
		decorations: RoadInfo.LaneDecoration[] = [];
	}

	export class CarLane extends Lane<CarLane> {
		width: RoadInfo.CarLaneWidth = RoadInfo.CarLaneWidth.THIN;
		direction: RoadInfo.LaneDirection = RoadInfo.LaneDirection.FORWARD;
	}

	export class SidewalkLane extends Lane<SidewalkLane> {
		parking: boolean = true;
		decorations: RoadInfo.LaneDecoration[] = [];
		direction: RoadInfo.LaneDirection = RoadInfo.LaneDirection.FORWARD;
	}
}

