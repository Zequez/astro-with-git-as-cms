/*
You are a web component builder; I want you to build a web component:
- UI framework is React
- Language is TypeScript
- Styling done with Tailwind classes
- Use native fetch API
- Name of component is "Items"
- Fetch a list of items from "/data.json" endpoint
    - Data format is {items: ["item1", "item2", "etc"]}
- Whenever the list changes, it should submit the data to /data.json as a POST request
- Add the necessary callbacks for updating, deleting and adding items
- Rendering:
    - Displays the list of items
        - Each item element has:
            - Input to change the item value
            - X button that deletes it
    - Component to add items (input and button on the same line)
       - Input for the item value
          - On pressing enter it should also submit
       - Button to submit
- Export component as default
- Notes:
  - Remember onKeyPress is deprecated on React, use onKeyDown
  - Remember to use the functional form when changing the items state
*/
import React, { useState, useEffect } from "react";

const Items: React.FC = () => {
  const [items, setItems] = useState<string[]>([]);
  const [newItem, setNewItem] = useState("");

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await fetch("/data.json");
      const data = await response.json();
      setItems(data.items);
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const saveItems = async (items: string[]) => {
    try {
      await fetch("/data.json", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items }),
      });
    } catch (error) {
      console.error("Error saving items:", error);
    }
  };

  const addItem = () => {
    if (newItem.trim() !== "") {
      const updatedItems = [...items, newItem];
      setItems(updatedItems);
      saveItems(updatedItems);
      setNewItem("");
    }
  };

  const updateItem = (index: number, value: string) => {
    const updatedItems = [...items];
    updatedItems[index] = value;
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  const deleteItem = (index: number) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
    saveItems(updatedItems);
  };

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      addItem();
    }
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => updateItem(index, e.target.value)}
              className="border rounded px-2 py-1"
            />
            <button
              onClick={() => deleteItem(index)}
              className="bg-red-500 text-white rounded px-2 py-1"
            >
              X
            </button>
          </li>
        ))}
      </ul>
      <div className="flex space-x-2 mt-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          onKeyDown={handleKeyPress}
          className="border rounded px-2 py-1"
        />
        <button
          onClick={addItem}
          className="bg-blue-500 text-white rounded px-2 py-1"
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default Items;
