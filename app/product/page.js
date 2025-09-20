"use client";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
// MUI Data Grid
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box } from "@mui/material";

export default function Home() {
  const API_BASE = process.env.NEXT_PUBLIC_API_URL;
  console.debug("API_BASE", API_BASE);
  const [editMode, setEditMode] = useState(false);
  const { register, handleSubmit, reset } = useForm();
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState([]);

  async function fetchProducts() {
    const data = await fetch(`${API_BASE}/product`);
    // const data = await fetch(`http://localhost:3000/product`);
    const p = await data.json();
    setProducts(p);
  }

  async function fetchCategory() {
    const data = await fetch(`${API_BASE}/category`);
    const c = await data.json();
    setCategory(c);
  }

  const handleProductSubmit = (data) => {
    if (editMode) {
      // Updating a product
      fetch(`${API_BASE}/product`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }).then(() => {
        stopEditMode();
        fetchProducts()
      });
      return
    }

    // Creating a new product

    fetch(`${API_BASE}/product`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }).then(() => fetchProducts());
  };

  const deleteById = (id) => async () => {
    if (!confirm("Are you sure?")) return;

    await fetch(`${API_BASE}/product/${id}`, {
      method: "DELETE",
    });
    fetchProducts();
  }

  const startEditMode = (product) => {
    // console.log(product)
    reset(product);
    setEditMode(true);
  }

  const stopEditMode = () => {
    setEditMode(false);
    reset({
      code: '',
      name: "",
      description: "",
      price: '',
      category: "",
    });
  }

  useEffect(() => {
    fetchCategory();
    fetchProducts();
  }, []);

  //__________________________________________________
  // MUI Data Grid
  const columns = [
    {
      field: "name",
      headerName: "Name",
      flex: 1,
      renderCell: (params) => (
        <Link href={`/product/${params.row._id}`} className="font-bold underline">
          {params.row.name}
        </Link>
      ),
    },
    { field: "description", headerName: "Description", flex: 1 },
    { field: "price", headerName: "Price ($)", type: "number", flex: 0.4 },
    {
      field: "actions",
      headerName: "Actions",
      sortable: false,
      flex: 1,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }} style={{ minWidth: 100 }}>
          <Button
            size="small"
            variant="outlined"
            color="error"
            onClick={deleteById(params.row._id)}
          >
            ❌
          </Button>
          <Button
            size="small"
            variant="outlined"
            onClick={() => startEditMode(params.row)}
          >
            📝
          </Button>
        </Box>
      ),
    },
  ];

  // Map products to DataGrid rows
  const rows = products.map((p) => ({ ...p, id: p._id }));
  //__________________________________________________

  return (
    <div className="flex flex-row gap-4">
      {/* ---------- FORM ---------- */}
      <div className="flex-1 w-64 ">
        <form onSubmit={handleSubmit(handleProductSubmit)}>
          <div className="grid grid-cols-2 gap-4 m-4 w-1/2">
            <div>Code:</div>
            <div>
              <input
                name="code"
                type="text"
                {...register("code", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Name:</div>
            <div>
              <input
                name="name"
                type="text"
                {...register("name", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Description:</div>
            <div>
              <textarea
                name="description"
                {...register("description", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Price:</div>
            <div>
              <input
                name="name"
                type="number"
                {...register("price", { required: true })}
                className="border border-black w-full"
              />
            </div>
            <div>Category:</div>
            <div>
              <select
                name="category"
                {...register("category", { required: true })}
                className="border border-black w-full"
              >
                {category.map((c) => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
            {editMode ?
              <>
                              <input
                  type="submit"
                  value="Update"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
                {' '}
                <button
                  onClick={() => stopEditMode()}
                  className=" italic bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
                >Cancel
                </button>
              </>
              :
              <div className="col-span-2">
                <input
                  type="submit"
                  value="Add"
                  className="bg-blue-800 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                />
              </div>
            }
          </div>
        </form>
      </div>

      {/* ---------- PRODUCT LIST ---------- */}

      {/* Old Product List */}
      {/* <div className="border m-4 bg-slate-300 flex-1 w-64">
        <h1 className="text-2xl">Products ({products.length})</h1>
        <ul className="list-disc ml-8">
          {
            products.map((p) => (
              <li key={p._id}>
                <button className="border border-black p-1/2" onClick={deleteById(p._id)}>❌</button>{' '}
                <button onClick={() => startEditMode(p)}>📝</button>{' '}
                <Link href={`/product/${p._id}`} className="font-bold">
                  {p.name}
                </Link>{" "}
                - {p.description} (${p.price})
              </li>
            ))}
        </ul>
      </div> */}

      {/* ---------- MUI DATA GRID ---------- */}
      <div className="border m-4 bg-slate-300 flex-1 w-64 p-4">
        <h1 className="text-2xl mb-2">Products ({products.length})</h1>
        <div style={{ width: "100%", overflowX: "auto" }}>
          <div style={{ height: 500 }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={5}
              rowsPerPageOptions={[5, 10]}
              disableSelectionOnClick
            />
          </div>
        </div>
      </div>
    </div>
  );
}
