export interface Module {
  id: number;
  course_id: number;
  title: string;
  content: string;
  module_file?: string;
  created_at: string;
  updated_at: string;
}

export interface ModuleResponse {
  modules: Module[];
  message: string;
  error?: string;
}
