import React from "react";

interface Iitem {
  id: number;
  value: number;
}

const Item: React.FC<Iitem> = ({ id, value }) => {
  return <p>{value}</p>;
};

export default Item;
