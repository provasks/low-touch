import { Aggregates } from './aggregates.model';
import { Recommendation } from './recommendation.model';
import { Part } from './part.model';

export class System {
  hostname: string;
  cluster: string;
  serial: string;
  customer: string;
  model: string;
  reviewed?: string;
  aggregates?: Aggregates;
  recommendations?: Array<Recommendation>;
  parts?: Array<Part>;
}
