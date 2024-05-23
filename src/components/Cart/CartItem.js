import React, { Component } from "react";
export default class CartItem extends Component {
  render() {
    const {
        item: {content, count},
        handledeleteCart,
    } = this.props;
    return (
        <li>
          <span>
            {content} X {count}
          </span>
          <button
            className="cart__delete-btn"
            onClick={handledeleteCart}
            >
            delete
          </button>
        </li>
      );
  }
}
