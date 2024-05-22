import React, { Component } from "react";

export default class ImmutablePractice extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: "001",
      type: "A",
      value: "aaaaa",
      "data:": {},
      path: ["001"],
      children: [
        {
          id: "003",
          type: "A",
          value: "aaaaa",
          "data:": {},
          path: ["001", "003"],
          children: [
            {
              id: "002",
              type: "A",
              value: "aaaaa",
              "data:": {},
              path: ["001", "003", "002"], //"003" -> "004"
              children: [],
            },
          ],
        },
        {
          id: "004",
          type: "A",
          value: "aaaaa",
          "data:": {},
          path: ["001", "004"],
          children: [
            {
              id: "005",
              type: "A",
              value: "aaaaa",
              "data:": {},
              path: ["001", "004", "005"],
              children: [],
            },
            {
              id: "006",
              type: "A",
              value: "aaaaa",
              "data:": {},
              path: ["001", "004", "005"],
              children: [
                {
                  id: "002",
                  type: "A",
                  value: "aaaaa",
                  "data:": {},
                  path: ["001", "004", "005", "002"], //"005" -> "006";
                  children: [],
                },
              ],
            },
          ],
        },
      ],
    };
  }

  handleImmutableUpdate = () => {
    this.setState({
      ...this.state,
      children: this.state.children.map((child, childIndex) => {
        if (childIndex === 0) {
          return {
            ...child,
            children: child.children.map((subChild) => {
              return {
                ...subChild,
                path: subChild.path.map((pathNum, pathIndex) => {
                  if (pathIndex === 1)
                    return "004";
                  else
                    return pathNum;
                  
                }),
              };
            }),
          };
        } else if (childIndex === 1) {
          return {
            ...child,
            children: child.children.map((subChild, subChildIndex) => {
              if (subChildIndex === 1) {
                return {
                  ...subChild,
                  children: subChild.children.map((grandChild) => {
                    return {
                      ...grandChild,
                      path: grandChild.path.map((pathNum, pathIndex) => {
                        if (pathIndex === 2)
                          return "006";
                        else
                          return pathNum;
                      }),
                    };
                  }),
                };
              } else {
                return subChild;
              }
            }),
          };
        }
      }),
    });
  };
  renderTree = (node,level) => {
    return (
        <div>
            {node.map((child) => (
                <ul  key={level + '-' +child.id}>
                    {child.path.map((path => <li  key={level + '-'+child.id + '-' + path}>{path}</li>))}
                    {child.children.length > 0 && this.renderTree(child.children, level+1)}
                </ul>
            ))}
        </div>
    );
};
  render() {
    return (
      <div>
        {this.renderTree([this.state],0)}
        <button onClick={this.handleImmutableUpdate}>click me</button>
      </div>
    );
  }
}
