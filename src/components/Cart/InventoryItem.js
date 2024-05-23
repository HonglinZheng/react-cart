import React, { Component } from "react";
export default class InventoryItem extends Component {
  render() {
    const {
        content,
        count,
        handleAddToCart,
        handleDecrement,
        handleIncrement,
    } = this.props;
    return (
        <li >
                  <span>{content}</span>
                  <button
                    className="inventory__minus-btn"
                    onClick={handleDecrement}
                  >
                    -
                  </button>
                  <span>{count}</span>
                  <button
                    className="inventory__plus-btn"
                    onClick={handleIncrement}
                  >
                    +
                  </button>
                  <button
                    className="inventory__addToCart-btn"
                    onClick={handleAddToCart}
                  >
                    add to cart
                  </button>
                </li>
      );
  }
}
