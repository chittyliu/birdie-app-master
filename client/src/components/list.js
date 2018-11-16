import React, { Component } from "react";
import { Table } from "react-bootstrap";

class List extends Component {
  constructor() {
    super();
    this.state = {
      selection: "class of worker",
      lists: []
    };
  }

  fetchData = () => {
    fetch("/api/update/list")
      .then(res => res.json())
      .then(rows => this.setState({ lists: rows }));
  };

  componentDidMount() {
    this.fetchData();
  }
  render() {
    const selection = this.state.selection;
    const lists = this.state.lists;
    console.log(selection, lists);
    return (
      <div className="contaier">
        <div className="list-content">
          <Table striped hover responsive>
            <thead>
              <tr>
                <th>#</th>
                <th onChange={this.fetchData}>{selection}</th>
                <th>Count</th>
                <th>Average Age</th>
              </tr>
            </thead>
            <tbody>
              {lists.map((list, key) => (
                <tr key={key}>
                  <td>{key + 1}</td>
                  <td>{list.category}</td>
                  <td>{list.count}</td>
                  <td>{list.average.toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    );
  }
}

export default List;
