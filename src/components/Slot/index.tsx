import Item from "@/components/Item";
import { useState } from "react";

export interface IItem {
  id: number;
  value: number;
}
export interface ISolt {
  id: number;
  items: IItem[];
}

const Solt: React.FC<ISolt> = ({ id, items }) => {
  return (
    <div className="flex flex-col gap-2 cursor-pointer bg-pink-600 p-3 text-white">
      {items.map((item) => (
        <Item key={item.id} id={item.id} value={item.value}></Item>
      ))}
    </div>
  );
};

export default Solt;
