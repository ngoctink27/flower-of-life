import React, { useState, useEffect } from "react";
import Layout from "./../components/Layout/Layout";
import { useCart } from "../context/cart";
import { useAuth } from "../context/auth";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import "../styles/CartStyles.css";

const CartPage = () => {
  const [auth, setAuth] = useAuth();
  const [cart, setCart] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getAllItems = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/cart", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      if (!response.ok) {
        throw new Error("Mạng không ổn định.");
      }

      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllItems();
  }, [auth?.token]);
  //handle payments
  console.log(cart);
  const handlePayment = async () => {
    try {
      const res = await axios.post("/api/v1/order/create-order", {
        products: cart.items.map(product => ({
          product: product.product._id,
          quantity: product.quantity
        }))
        ,
        total: cart.total
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setCart([]);
      toast.success("Order Completed Successfully ");
      const deleteAll = await axios.delete("/api/v1/cart/deleteAll", {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });

      navigate("/dashboard/user/orders");
    } catch (error) {
      console.log(error);
    }
  };

  const addOneMoreItem = async (p) => {
    try {
      const { data } = await axios.post("/api/v1/cart/add", {
        product: p
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      getAllItems()
    } catch (error) {
      alert('Error adding item');
    }
  }

  const removeOneItem = async (p) => {
    try {
      const { data } = await axios.put(`/api/v1/cart/update/${p}`, {
        action: "decrease"
      }, {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      })
      getAllItems()
    } catch (error) {
      alert('Error adding item');
    }
  }

  return (
    <Layout>
      {!cart.items ? <h1>Loading....</h1> :
        <div className=" cart-page">
          <div className="row">
            <div className="col-md-12">
              <h1 className="text-center bg-light p-2 mb-1">
                {!auth?.user
                  ? "Hello Guest"
                  : `Hello  ${auth?.token && auth?.user?.name}`}
                <p className="text-center">
                  {cart?.items.length
                    ? `Bạn có ${cart?.items.length} sản phẩm trong giỏ hàng ${auth?.token ? "" : "hãy đăng nhập !"
                    }`
                    : " Giỏ hàng trống"}
                </p>
              </h1>
            </div>
          </div>
          <div className="container ">
            <div className="row ">
              {console.log(cart)}
              <div className="col-md-7  p-0 m-0">
                {cart?.items.map((p) => {

                  return (
                    <div className="row card flex-row" key={p.product._id}>
                      <div className="col-md-4">
                        <img
                          src={`/api/v1/product/product-photo/${p.product._id}`}
                          className="card-img-top"
                          alt={p.product.name}
                          width="100%"
                          height={"130px"}
                        />
                      </div>
                      <div className="col-md-4">
                        <p>{p.product.name}</p>
                        <p>{p.product.description.substring(0, 30)}</p>
                        <p>Giá : {p.product.price}</p>
                      </div>
                      <div className="col-md-4 cart-remove-btn">
                        <div>
                          <p>Số lượng</p>
                          <div style={{ display: 'flex' }}>
                            <button onClick={() => removeOneItem(p.product._id)} style={{ margin: '5px', padding: '10px', border: '0px' }}>-</button>
                            <p style={{ margin: '5px', padding: '10px' }}>{p.quantity}</p>
                            <button onClick={() => addOneMoreItem(p.product._id)} style={{ margin: '5px', padding: '10px', border: '0px' }}>+</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
              <div className="col-md-5 cart-summary ">
                <h2>Giỏ hàng</h2>

                <hr />
                <h4>Tổng tiền : ${cart.total} </h4>
                {auth?.user?.address ? (
                  <>
                    <div className="mb-3">
                      <h4>Địa chỉ hiện tại</h4>
                      <h5>{auth?.user?.address}</h5>
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Cập nhật địa chỉ
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="mb-3">
                    {auth?.token ? (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() => navigate("/dashboard/user/profile")}
                      >
                        Cập nhật địa chỉ
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-warning"
                        onClick={() =>
                          navigate("/login", {
                            state: "/cart",
                          })
                        }
                      >
                        Vui lòng đăng nhập để thanh toán
                      </button>
                    )}
                  </div>
                )}
                <div className="mt-2">
                  {!auth?.token || !cart?.items.length ? (
                    ""
                  ) : (
                    <>
                      <button
                        className="btn btn-primary"
                        onClick={handlePayment}
                        disabled={loading || !auth?.user?.address}
                      >
                        {loading ? "Processing ...." : "Đặt hàng"}
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>}
    </Layout>
  );
};

export default CartPage;
