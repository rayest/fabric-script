import Header from "./Header";
import Content from "./Content";
import Footer from "./Footer";
import AddItem from "./AddItem";
import SearchItem from "./SearchItem";
import { useEffect, useState } from "react";

function App() {
  const API_URL = "http://localhost:3500/items";

  const [items, setItems] = useState([]);
  const [newItem, setNewItem] = useState("");
  const [search, setSearch] = useState("");
  const [fetchError, setFetchError] = useState(null);
  const [loading, setLoading] = useState(true);

  // useEffect: 加载页面时执行，items变化时执行.
  // 1. 如果 items 不变化，只在加载页面时执行，可以传入空数组
  // 2. 否则，每次 items 变化时都会执行 useEffect
  // 3. 可以通过 RestAPI 获取数据，然后设置 items
  useEffect(() => {
    console.log("set items");
    const fetchItems = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error("Fetch items data failed");
        }
        const listItems = await response.json();
        setItems(listItems);
        setFetchError(null);
      } catch (error) {
        console.log(error.message);
        setFetchError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // 2秒后执行
    setTimeout(() => {
      // 这个函数是异步的，所以需要立即执行
      (async () => fetchItems())();
    }, 2000);
  }, []);

  const addItem = (item) => {
    const id = items.length ? items[items.length - 1].id + 1 : 1;
    const newItem = { id, checked: false, item };
    const listItems = [...items, newItem];
    setItems(listItems);
  };

  const handleCheck = (id) => {
    const listItems = items.map((item) =>
      item.id === id ? { ...item, checked: !item.checked } : item
    );
    setItems(listItems);
  };

  const handleDelete = (id) => {
    const listItems = items.filter((item) => item.id !== id);
    setItems(listItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent form submission
    if (!newItem.trim()) return; // Prevent empty items
    console.log(newItem);
    addItem(newItem);
    setNewItem("");
  };

  return (
    <div className="App">
      <Header title="Groceries List" />
      <AddItem
        newItem={newItem}
        setNewItem={setNewItem}
        handleSubmit={handleSubmit}
      />
      <SearchItem search={search} setSearch={setSearch} />
      <main>
        {loading && <p>Loading...</p>}

        {/* error: Fetch items data failed */}
        {fetchError && <p style={{ color: "red" }}>{`Error: ${fetchError}`}</p>}
        
        {!fetchError && !loading && (
          <Content
            items={items.filter((item) =>
              item.item.toLowerCase().includes(search.toLowerCase())
            )} //
            handleCheck={handleCheck}
            handleDelete={handleDelete}
          />
        )}
      </main>
      <Footer length={items.length} />
    </div>
  );
}

export default App;
