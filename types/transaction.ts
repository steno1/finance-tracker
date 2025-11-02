export type Transaction = {
  _id: string;          // match MongoDB
  title: string;
  amount: number;
  type: "income" | "expense";
};
