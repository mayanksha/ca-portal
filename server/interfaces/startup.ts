export interface Startup {
	startupName: string;
	numPersons: number;
	allPersons: Persons[];
	contactNo: string;
	email: string;
	location: string;
	eventName: string;
}
export interface Persons {
	id?: number;
	name: string;
	gender?: string;
}
