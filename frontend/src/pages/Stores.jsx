import { useEffect, useState } from "react";
import { api } from "../api";

export default function Stores() {
  const [stores, setStores] = useState([]);
  const [msg, setMsg] = useState("");

  const [storeName, setStoreName] = useState("");
  const [storeAddress, setStoreAddress] = useState("");

  const role = localStorage.getItem("role") || "USER";

  const load = async () => {
    setMsg("");
    try {
      const data = await api("/api/stores");
      setStores(data);
    } catch (err) {
      setMsg(err.message);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    window.location.href = "/";
  };

  const rate = async (store_id, rating) => {
    setMsg("");
    try {
      await api("/api/ratings", {
        method: "POST",
        body: { store_id, rating },
      });
      setMsg("Rating submitted");
      await load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  const createStore = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      await api("/api/stores/create", {
        method: "POST",
        body: { name: storeName, address: storeAddress },
      });
      setStoreName("");
      setStoreAddress("");
      setMsg("Store created");
      await load();
    } catch (err) {
      setMsg(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 820, margin: "30px auto", fontFamily: "Arial" }}>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>Stores</h2>
        <button onClick={logout}>Logout</button>
      </div>

      <p style={{ color: msg.includes("done!") ? "green" : "red" }}>{msg}</p>

      {role === "ADMIN" && (
        <div style={{ border: "1px solid #ddd", padding: 12, marginBottom: 16 }}>
          <h3>Create Store (Admin)</h3>
          <form onSubmit={createStore} style={{ display: "flex", gap: 8 }}>
            <input
              placeholder="Store name"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              style={{ flex: 1, padding: 10 }}
            />
            <input
              placeholder="Address"
              value={storeAddress}
              onChange={(e) => setStoreAddress(e.target.value)}
              style={{ flex: 1, padding: 10 }}
            />
            <button>Create</button>
          </form>
        </div>
      )}

      <div style={{ display: "grid", gap: 12 }}>
        {stores.map((s) => (
          <div key={s.id} style={{ border: "1px solid #ddd", padding: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div>
                <b>{s.name}</b>
                <div style={{ color: "#555" }}>{s.address}</div>
              </div>
              {"average_rating" in s && (
                <div>Avg: {s.average_rating ?? "N/A"}</div>
              )}
            </div>

            <div style={{ marginTop: 10 }}>
              <span>Rate: </span>
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => rate(s.id, r)}
                  style={{ marginRight: 6 }}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}