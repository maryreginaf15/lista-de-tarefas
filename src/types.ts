export type Priority = 'Baixa' | 'Média' | 'Alta';
export type Category = 'Trabalho' | 'Pessoal' | 'Estudos' | 'Outros';

export interface Task {
  id: string;
  title: string;
  category: Category;
  priority: Priority;
  dueDate: string;
  completed: boolean;
  createdAt: number;
}
