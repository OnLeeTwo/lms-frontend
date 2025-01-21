export interface Assessment {
  id: number;
  module_id: number;
  type: "Essay" | "Choices";
  created_at: string;
  updated_at: string;
}
