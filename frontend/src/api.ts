import axios from 'axios';

// 環境変数を使用するように変更
const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://127.0.0.1:8000';


const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface ReadingMaterial {
  id: number;
  title: string;
  content: string;
  group: any;
  created_by: any;
  created_at: string;
}

export interface Question {
  id: number;
  material: number;
  question_text: string;
  question_type: 'multiple_choice' | 'descriptive';
  choices?: string[];
  correct_answer?: string;
  hide_text: boolean;
  order: number;
}

export interface StudentAnswer {
  id?: number;
  student: number;
  question: number;
  answer_text: string;
  reasoning_note: string;
  citations?: any;
}

export interface Annotation {
  id?: number;
  student: number;
  material: number;
  annotation_type: 'sticky_note' | 'highlight';
  start_position: number;
  end_position: number;
  content: string;
  color: string;
}

// API関数
export const fetchReadingMaterial = (id: number) => 
  api.get<ReadingMaterial>(`/materials/${id}/`);

export const fetchQuestions = (materialId: number) => 
  api.get<Question[]>(`/materials/${materialId}/questions/`);

export const submitAnswer = (answer: StudentAnswer) => 
  api.post('/answers/', answer);

export const addAnnotation = (annotation: Annotation) => 
  api.post('/annotations/', annotation);

export const fetchAnnotations = (materialId: number, studentId: number) => 
  api.get<Annotation[]>(`/materials/${materialId}/annotations/?student_id=${studentId}`);

export default api;

// 既存のAPI関数の後に追加
export const deleteAnnotation = (id: number) => 
  api.delete(`/annotations/${id}/`);
