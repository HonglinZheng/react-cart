import React, { Component } from "react";
import InventoryPagination from "./InventoryPagination";
import CartPagination from "./CartPagination";
import CartItem from "./CartItem";
import "./cart.css";
import {
  getCart,
  updateCart,
  getInventory,
  addToCart,
  deleteFromCart,
  checkout,
} from "../../APIs/cartAPIs";
import InventoryItem from "./InventoryItem";

export default class Cart extends Component {
  constructor(props) {
    super(props);
    this.state = {
      inventory: [],
      cart: [],
      itemCounts: [],
      itemsPerPage: 5,
      totalInventoryItemCount: null,
      inventoryTotalPage: null,
      inventoryStart:0,
      inventoryEnd:5,
      currentInventoryIndex:0,
      totalCartItemCount: null,
      cartTotalPage: null,
      cartStart:0,
      cartEnd:null,
      currentCartIndex:0,
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
    let totalInventoryItemCount = inventorydata.length;
    let inventoryTotalPage = Math.ceil(totalInventoryItemCount/this.state.itemsPerPage);
    let totalCartItemCount = cartdata.length;
    let cartTotalPage = Math.ceil(totalCartItemCount/this.state.itemsPerPage);
    let cartEnd = Math.min(totalCartItemCount, this.state.cartStart+this.state.itemsPerPage);
    this.setState({
      ...this.state,
      cart: cartdata,
      inventory: inventorydata,
      itemCounts: itemCountsdata,
      totalInventoryItemCount,
      inventoryTotalPage,
      totalCartItemCount,
      cartEnd,
      cartTotalPage,
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
    
    if (this.state.itemCounts[Number(id)] === 0)
      return;
    let countInCart = 0;
    let indexInCart = 0;
    try {
      countInCart = this.state.cart.find((item) => item.id === id).count;
      indexInCart = this.state.cart.findIndex((item) => item.id === id);
      console.log("id is "+ id + "; and index is " + indexInCart);
    } catch (Exception) {
      console.log("new item");
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
      let currentCartIndex = Math.floor(indexInCart/this.state.itemsPerPage);
      let cartStart = currentCartIndex * this.state.itemsPerPage;
      let cartEnd = Math.min(cartStart + this.state.itemsPerPage, this.state.totalCartItemCount);
      this.setState({
        cart: newCart,
        currentCartIndex,
        cartStart,
        cartEnd,
      });
    } else {
      const inventoryItem = this.state.inventory.find((item) => item.id === id);
      const newItem = {
        ...inventoryItem,
        count: this.state.itemCounts[Number(id)],
      };
      console.log(newItem);
      await addToCart(newItem);
      let totalCartItemCount = this.state.totalCartItemCount+1;
      let cartTotalPage = Math.ceil(totalCartItemCount/this.state.itemsPerPage);
      let currentCartIndex = cartTotalPage-1;
      let cartStart = currentCartIndex * this.state.itemsPerPage;
      let cartEnd = Math.min(cartStart + this.state.itemsPerPage, totalCartItemCount);
      this.setState(
        { cart: [...this.state.cart, newItem],
          totalCartItemCount,
          cartTotalPage,
          currentCartIndex,
          cartStart,
          cartEnd,
       });
    }
  };
  handledeleteCart = async (id) => {
    await deleteFromCart(Number(id));

    if ((this.state.totalCartItemCount-1)%this.state.itemsPerPage === 0 ) {
      console.log("page decrements");
      //page decrements
      let totalCartItemCount = this.state.totalCartItemCount-1;
      let currentCartIndex = Math.max(0, this.state.currentCartIndex-1);
      let cartStart = currentCartIndex * this.state.itemsPerPage;
      let cartEnd = Math.min(cartStart + this.state.itemsPerPage, this.state.totalCartItemCount)
      this.setState({
        cart: this.state.cart.filter((item, index) => {
          return item.id !== id;
        }),
        totalCartItemCount,
        currentCartIndex,
        cartStart,
        cartEnd,
        cartTotalPage: this.state.cartTotalPage-1,
      });
    } else {
      this.setState({
        cart: this.state.cart.filter((item, index) => {
          return item.id !== id;
        }),
        totalCartItemCount: this.state.totalCartItemCount-1,
        cartEnd: Math.min(this.state.cartStart + this.state.itemsPerPage, this.state.totalCartItemCount-1),
      });
    }
    

  };
  handleCheckout = async () => {
    await checkout();
    this.setState(
      {cart: [],
        totalCartItemCount:0,
        cartTotalPage:0,
        currentCartIndex:0,
        cartStart:0,
        cartEnd:0,
       });
  };
  handleInventoryNextPage =() =>{
    if (this.state.currentInventoryIndex === this.state.inventoryTotalPage-1)
      return;
    let currentInventoryIndex = this.state.currentInventoryIndex+1;
    let inventoryStart = currentInventoryIndex * this.state.itemsPerPage;
    let inventoryEnd = Math.min(inventoryStart + this.state.itemsPerPage, this.state.totalInventoryItemCount);
    this.setState({currentInventoryIndex,
      inventoryStart,
      inventoryEnd,
    });
  }
  handleInventoryPrevPage =() =>{
    if (this.state.currentInventoryIndex === 0)
      return;
    let currentInventoryIndex = this.state.currentInventoryIndex-1;
    let inventoryStart = currentInventoryIndex * this.state.itemsPerPage;
    let inventoryEnd = Math.min(inventoryStart + this.state.itemsPerPage, this.state.totalInventoryItemCount);
    this.setState({currentInventoryIndex,
      inventoryStart,
      inventoryEnd,
    });
  }
  handleInventorySelectPage=(page)=>{
    let currentInventoryIndex = page;
    let inventoryStart = currentInventoryIndex * this.state.itemsPerPage;
    let inventoryEnd = Math.min(inventoryStart + this.state.itemsPerPage, this.state.totalInventoryItemCount);
    this.setState({currentInventoryIndex,
      inventoryStart,
      inventoryEnd,
    });
  }
  handleCartNextPage =() =>{
    if (this.state.currentCartIndex === this.state.CartTotalPage-1)
      return;
    let currentCartIndex = this.state.currentCartIndex+1;
    let cartStart = currentCartIndex * this.state.itemsPerPage;
    let cartEnd = Math.min(cartStart + this.state.itemsPerPage, this.state.totalCartItemCount);
    this.setState({currentCartIndex,
      cartStart,
      cartEnd,
    });
  }
  handleCartPrevPage =() =>{
    if (this.state.currentCartIndex === 0)
      return;
    let currentCartIndex = this.state.currentCartIndex-1;
    let cartStart = currentCartIndex * this.state.itemsPerPage;
    let cartEnd = Math.min(cartStart + this.state.itemsPerPage, this.state.totalCartItemCount);
    this.setState({currentCartIndex,
      cartStart,
      cartEnd,
    });
  }
  handleCartSelectPage=(page)=>{
    let currentCartIndex = page;
    let cartStart = currentCartIndex * this.state.itemsPerPage;
    let cartEnd = Math.min(cartStart + this.state.itemsPerPage, this.state.totalCartItemCount);
    this.setState({currentCartIndex,
      cartStart,
      cartEnd,
    });
  }
  

  render() {
    return (
      <div id="app">
        <div className="inventory-container">
          <h1>Inventory</h1>
          <ul className="inventorylist">
            {this.state.inventory.map((item,index) => 
            {if (index >= this.state.inventoryStart && index < this.state.inventoryEnd)
              return(
                <InventoryItem
                key={"inventory-" + item.id}
                content={item.content}
                count={this.state.itemCounts[item.id]}
                handleAddToCart={()=>this.handleAddToCart(item.id)}
                handleDecrement={()=>this.handleDecrement(item.id)}
                handleIncrement={()=>this.handleIncrement(item.id)}
                />
              );}
            )}
          </ul>
            <InventoryPagination
              totalPage = {this.state.inventoryTotalPage}
              handleNextPage={this.handleInventoryNextPage}
              handlePrevPage={this.handleInventoryPrevPage}
              handleSelect={(page)=>this.handleInventorySelectPage(page)}
              />
        </div>
        <div className="cart-container">
          <h1>Shopping Cart</h1>
          <ul className="cartlist">
            {this.state.cart.map((item,index) => {
              if(index >= this.state.cartStart && index < this.state.cartEnd)
                return (<CartItem
                  key={"cart-" + item.id}
                  item={item}
                  handledeleteCart={() => this.handledeleteCart(item.id)}
                />)
            })}
          </ul>
          <CartPagination
              totalPage = {this.state.cartTotalPage}
              handleNextPage={this.handleCartNextPage}
              handlePrevPage={this.handleCartPrevPage}
              handleSelect={(page)=>this.handleCartSelectPage(page)}
              />
          <button className="checkout-btn" onClick={this.handleCheckout}>
            checkout
          </button>
        </div>
      </div>
    );
  }
}
