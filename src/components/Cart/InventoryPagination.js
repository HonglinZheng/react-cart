import React, { Component } from "react";
export default class InventoryPagination extends Component {
  render() {
    const{
      totalPage,
      handleNextPage,
      handlePrevPage,
      handleSelect,
    } = this.props;

    let buttons = [];
    for (let i = 0; i < totalPage; i++) {
      buttons.push(<button key={"page-inventory-" + i} onClick={()=>handleSelect(i)}>{i+1}</button>);
    }

    return (
      <div className="inventoryPagination">
      <button className="pagination__prev-btn" onClick={handlePrevPage}>Prev</button>
      <div>{buttons}</div>
      <button className="pagination__next-btn" onClick={handleNextPage}>Next</button>
      </div>);
  }
}
