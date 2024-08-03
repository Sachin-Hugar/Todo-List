// src/App.js
import React, { useState, useEffect } from "react";

function App() {
  const [inputText, setInputText] = useState("");
  const [items, setItems] = useState([]);

  // Fetch todos from the backend when the component mounts
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:3000/todos");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Failed to fetch todos", error);
      }
    };

    fetchItems();
  }, []);

  function handleChange(event) {
    const newValue = event.target.value;
    setInputText(newValue);
  }

  async function addItem() {
    if (inputText.trim() === "") return;

    try {
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: inputText, completed: false }),
      });

      if (response.ok) {
        const newItem = await response.json();
        setItems(prevItems => [...prevItems, newItem]);
        setInputText(""); // Clear input after successful addition
      } else {
        console.error("Failed to add todo: ", response.statusText);
      }
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  }

  async function deleteItem(id) {
    try {
      const response = await fetch(`http://localhost:3000/todos/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setItems(items.filter(item => item._id !== id));
      } else {
        console.error("Failed to delete todo");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  return (
    <div className="container">
      <div className="heading">
        <h1>To-Do List</h1>
      </div>
      <div className="form">
        <input onChange={handleChange} type="text" value={inputText} />
        <button onClick={addItem}>
          <span>Add</span>
        </button>
      </div>
      <div>
        <ul>
          {items.map(todoItem => (
            <li key={todoItem._id}>
              {todoItem.title}
              <button onClick={() => deleteItem(todoItem._id)}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
