const URL = "http://localhost:3030";
export const getCart = () => {
  return fetch(`${URL}/cart`).then((res) => res.json());
};

export const getInventory = () => {
  return fetch(`${URL}/inventory`).then((res) => res.json());
};

export const addToCart = (inventoryItem) => {
  return fetch(`${URL}/cart`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(inventoryItem),
  }).then((res) => res.json());
};

export const updateCart = (id, newAmount) => {
  return fetch(`${URL}/cart/${id}`)
    .then((res) => res.json()) // use then() to wait fetch to complete and to return a new promise
    .then((item) => {
      const updatedItem = { ...item, count: newAmount };
      return fetch(`${URL}/cart/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedItem),
      });
    });
};

export const deleteFromCart = async (id) => {
  await fetch(`${URL}/cart/${id}`, { method: "DELETE" }).then((res) =>
    res.json()
  );
  return await getCart();
};

export const checkout = () => {
  // you don't need to add anything here
  return getCart().then((data) =>
    Promise.all(data.map((item) => deleteFromCart(item.id)))
  );
};
