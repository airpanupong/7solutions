export type Item = {
	 type: "Fruit" | "Vegetable";
  name: string;
  timeLeft?: number;
};

export type User = {
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  age: number;
  hair: { color: string };
  address: { postalCode: string };
  company: { department: string };
};

export type TransformedData = {
  [department: string]: {
    male: number;
    female: number;
    ageRange: string;
    hair: Record<string, number>;
    addressUser: Record<string, string>;
  };
};