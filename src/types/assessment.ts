export interface Assessment {
  assessment_id: number;
  module_id: number;
  type: "Essay" | "Choices";
  created_at: string;
  updated_at: string;
}
