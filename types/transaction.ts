export type Transaction = {
  _id: string;          
  title: string;
  amount: number;
  type: "income" | "expense";
    createdAt?: string; 
};
