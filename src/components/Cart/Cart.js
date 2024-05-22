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
    };
  }
  async componentDidMount() {
    const cartdata = await getCart();
    const inventorydata = await getInventory();
    this.setState({
        ...this.state,
        cart: cartdata.reverse(),
        inventory: inventorydata,
      });
}

  render() {
    return (
      <div id="app">
        <div className="inventory-container">
          <h1>Inventory</h1>
          <ul className="inventorylist">
            {this.state.inventory.map(item=>{
                return (<li key={"inventory-" + item.id}>
                <span>{item.content}</span>
                <button className="inventory__minus-btn">-</button>
                <span>0</span>
                 <button className="inventory__plus-btn">+</button>
                 <button className="inventory__addToCart-btn">add to cart</button>
                 </li>)
            })}
          </ul>

        </div>
        <div className="cart-container">
          <h1>Shopping Cart</h1>
          <ul className="cartlist">
            {this.state.cart.map(item=>{
                return (<li key={"cart-" + item.id}>
                    <span>{item.content} X {item.count}</span>
                    <button className="cart__delete-btn">delete</button>
                </li>)
            })}
            
          </ul>
          
          <button className="checkout-btn">checkout</button>
        </div>
      </div>
    );
  }
}
