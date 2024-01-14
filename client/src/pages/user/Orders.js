import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import Layout from "./../../components/Layout/Layout";
import axios from "axios";
import { useAuth } from "../../context/auth";
import moment from "moment";
import toast from "react-hot-toast";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [auth, setAuth] = useAuth();
  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/order/orders", {
        headers: {
          Authorization: `Bearer ${auth.token}`
        }
      });
      setOrders(data);
    } catch (error) {
      console.log(error);
    }
  };
  console.log(orders);
  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const handleDeleteOrder = async (id, canDelete) => {
    if (canDelete) {
      let answer = window.prompt("Bạn chắc chắn muốn hủy đơn chứ ? ");
      if (!answer) return;
      const { data } = await axios.delete(
        `/api/v1/order/delete-order/${id}`
        , {
          headers: {
            Authorization: `Bearer ${auth.token}`
          }
        });
      toast.success("Product DEleted Succfully");
      getOrders();
    }
    else {
      alert("Không thể hủy đơn do đơn hàng đang vận chuyển hoặc đã hoàn thành")
    }
  }
  return (
    <Layout title={"Your Orders"}>
      {orders.length == 0 ? <h1>Loading</h1> :
        <div className="container-flui p-3 m-3 dashboard">
          <div className="row">
            <div className="col-md-3">
              <UserMenu />
            </div>
            <div className="col-md-9">
              <h1 className="text-center">Tất cả đơn hàng</h1>
              {orders?.map((o, i) => {
                return (
                  <div className="border shadow">
                    <table className="table">
                      <thead>
                        <tr>
                          <th scope="col">#</th>
                          <th scope="col">Trạng thái</th>
                          <th scope="col">Người mua</th>
                          <th scope="col">Thời gian</th>
                          <th scope="col">Số lượng</th>
                          <th scope="col">Tổng tiền</th>
                          <th scope="col">{
                            <button
                              onClick={() => handleDeleteOrder(o._id, (o.status == "Not Process" || o.status == "Processing"))}
                              style={{ backgroundColor: '#0099FF', color: 'white', borderRadius: '10px', padding: '5px' }}>Hủy đơn hàng</button>}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{i + 1}</td>
                          <td>{o?.status}</td>
                          <td>{o?.buyer?.name}</td>
                          <td>{moment(o?.createAt).fromNow()}</td>
                          <td>{o?.products?.length}</td>
                          <td>{o?.total}$</td>
                          <td></td>
                        </tr>
                      </tbody>
                    </table>
                    <div className="container">
                      {o?.products?.map((p, i) => {
                        console.log(p);
                        return (
                          <div className="row mb-2 p-3 card flex-row" key={p.product}>
                            <div className="col-md-4">
                              <img
                                src={`/api/v1/product/product-photo/${p.product._id}`}
                                className="card-img-top"
                                width="100px"
                                height={"100px"}
                              />
                              <p>Tên sản phẩm: {p.product.name}</p>
                              <p>Giá: {p.product.price}$</p>
                              <p>Số lượng: {p.quantity}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>}
    </Layout>
  );
};

export default Orders;
