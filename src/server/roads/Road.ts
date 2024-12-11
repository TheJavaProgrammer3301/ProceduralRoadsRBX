import { RoadLanes } from "./Lanes";

export default interface Road {
	lanes: RoadLanes.Lane<any>[]
}