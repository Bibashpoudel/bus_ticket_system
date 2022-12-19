const arr = [
  { bus_id: 1, position: "left" },
  { bus_id: 2, position: "right" },
  { bus_id: 3, position: "cabin" },
];

const promiseArray = arr.map((obj) => new busSch(obj));
const response = Promise.all(promiseArray.map((busch) => busch.save()));
console.log(response);
