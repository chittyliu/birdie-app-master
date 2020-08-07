import React, { Component } from "react";
import "./dropdown.css";
import { DropdownButton } from "react-bootstrap";
import { MenuItem } from "react-bootstrap";
import { Table } from "react-bootstrap";

class Dropdown extends Component {
    constructor() {
        super();
        this.state = {
            dropdowns: [],
            selection: "class of worker",
            lists: [],
        };
    }

    componentDidMount() {
        this.fetchData();
    }

    fetchData = async(selection) => {
        await fetch("/api/update", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ selection: selection })
        });
  
        fetch("/api/rows")
        .then((res) => res.json())
        .then((rows) => {
            this.setState({
                dropdowns: rows
            });
        });
  
        fetch("/api/update/list")
        .then((res) => res.json())
        .then((rows) => {
            this.setState({
                lists: rows
            });
        });
    };

    onChange(event) {
        const selection = event.target.innerHTML;
        this.fetchData(selection);
        this.setState({
            selection: selection
        });
    }

    render() {
        const {dropdowns, selection, lists} = this.state
        return (
            <div className="container">
                <div className="dropdown-content">
                    <DropdownButton bsStyle="primary" title={selection} id="dropdown-basic-1">
                        {dropdowns.map((dropdown, key) => (
                            <MenuItem id={key + 1} key={key} onClick={(event) => this.onChange(event)}>
                                {dropdown.Field}
                            </MenuItem>
                        ))}
                    </DropdownButton>
                </div>
                <div className="list-content">
                    <Table striped hover responsive>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{selection}</th>
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
    };
};

export default Dropdown;
