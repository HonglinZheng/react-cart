import React, { Component } from "react";
import "./cart.css";
import {
  getCart,
  updateCart,
  getInventory,
  addToCart,
  deleteFromCart,
  checkout,
} from "../../APIs/cartAPIs";

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
      cart: [],
      itemCounts: [],
    };
  }
  async componentDidMount() {
    const cartdata = await getCart();
    const inventorydata = await getInventory();
    let itemCountsdata = [];
    inventorydata.forEach((item) => {
      return (itemCountsdata[Number(item.id)] =
        itemCountsdata[Number(item.id)] || 0);
    });
    this.setState({
      ...this.state,
      cart: cartdata,
      inventory: inventorydata,
      itemCounts: itemCountsdata,
    });
  }

  handleIncrement = (id) => {
    const itemCounts = this.state.itemCounts.map((item, index) => {
      if (index === Number(id)) {
        return item + 1;
      } else {
        return item;
      }
    });
    this.setState({ ...this.state, itemCounts });
  };
  handleDecrement = (id) => {
    const itemCounts = this.state.itemCounts.map((item, index) => {
      if (index === Number(id) && item > 0) {
        return item - 1;
      } else {
        return item;
      }
    });
    this.setState({ ...this.state, itemCounts });
  };

  handleAddToCart = async (id) => {
    let countInCart = 0;
    try {
      countInCart = this.state.cart.find((item) => item.id === id).count;
    } catch (Exception) {
      console.log("undefined variable!");
    }
    if (countInCart > 0) {
      await updateCart(id, countInCart + this.state.itemCounts[Number(id)]);
      const newCart = this.state.cart.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            count: countInCart + this.state.itemCounts[Number(id)],
          };
        } else {
          return item;
        }
      });
      this.setState({ ...this.state, cart: newCart });
    } else {
      const inventoryItem = this.state.inventory.find((item) => item.id === id);
      const newItem = {
        ...inventoryItem,
        count: this.state.itemCounts[Number(id)],
      };
      console.log(newItem);
      await addToCart(newItem);
      this.setState({ cart: [...this.state.cart, newItem] });
    }
  };
  handledeleteCart = async (id) => {
    await deleteFromCart(Number(id));
    this.setState({
      ...this.state,
      cart: this.state.cart.filter((item, index) => {
        return item.id !== id;
      }),
    });
  };
  handleCheckout = async () => {
    await checkout();
    this.setState({ ...this.state, cart: [] });
  };

  render() {
    return (
      <div id="app">
        <div className="inventory-container">
          <h1>Inventory</h1>
          <ul className="inventorylist">
            {this.state.inventory.map((item) => {
              return (
                <li key={"inventory-" + item.id}>
                  <span>{item.content}</span>
                  <button
                    className="inventory__minus-btn"
                    onClick={() => {
                      this.handleDecrement(item.id);
                    }}
                  >
                    -
                  </button>
                  <span>{this.state.itemCounts[item.id]}</span>
                  <button
                    className="inventory__plus-btn"
                    onClick={() => {
                      this.handleIncrement(item.id);
                    }}
                  >
                    +
                  </button>
                  <button
                    className="inventory__addToCart-btn"
                    onClick={() => {
                      this.handleAddToCart(item.id);
                    }}
                  >
                    add to cart
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div className="cart-container">
          <h1>Shopping Cart</h1>
          <ul className="cartlist">
            {this.state.cart.map((item) => {
              return (
                <li key={"cart-" + item.id}>
                  <span>
                    {item.content} X {item.count}
                  </span>
                  <button
                    className="cart__delete-btn"
                    onClick={() => {
                      this.handledeleteCart(item.id);
                    }}
                  >
                    delete
                  </button>
                </li>
              );
            })}
          </ul>

          <button className="checkout-btn" onClick={this.handleCheckout}>
            checkout
          </button>
        </div>
      </div>
    );
  }
}
