import { System } from './system.model';

export class Outcome {
  title?: string;
  systems: Array<System>;
  headers?: Array<string> = [];
}
