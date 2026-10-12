export interface BriefingMetric {
  icon: string;
  label: string;
  value: string;
}

export interface DailyBriefing {
  greeting: string;
  statusText: string;
  activeCountText: string;
  metrics: BriefingMetric[];
}
