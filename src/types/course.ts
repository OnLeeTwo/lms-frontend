export interface Course {
  id: number;
  role_id: number;
  institute_id: number;
  title: string;
  description: string;
  category: string;
  media?: string;
  created_at: string;
  updated_at: string;
}

export interface CourseResponse {
  Courses: Course[];
  message: string;
  error?: string;
}

export interface CourseResponseDetail extends Course {
  message: string;
  error?: string;
}

export interface CourseMessage {
  message: string;
}
