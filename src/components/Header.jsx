import React, { useEffect, useState } from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Badge from "@mui/material/Badge";
import Nav from "react-bootstrap/Nav";
import Menu from "@mui/material/Menu";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Table from "react-bootstrap/esm/Table";
import Button from "react-bootstrap/Button";
import { DLT } from "../redux/actions/action";
import "./style.css";

const Header = () => {
  const [data, setData] = useState([]);

  const getdata = useSelector((state) => state.cartreducer.carts);

  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState(null);

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const dlt = (id) => {
    dispatch(DLT(id));
  };

  const loadScript = (src, callback) => {
    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.onload = callback;
    document.head.appendChild(script);
  };
  const handlePayment = async () => {
    const options = {
      key: "rzp_test_N7JAloi8EO00qI",
      amount: data[0].price * 100,
      currency: "INR",
      name: data[0].name,
      description: "Payment for your service",
      handler: async (response) => {
        setPaymentStatus("Payment successful: " + response.razorpay_payment_id);
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    if (getdata.length) {
      const newData = getdata.map((el) => ({
        price: el.price * el.qnty,
        name: el.rname,
      }));

      setData(newData);
    }
  }, [getdata]);
  useEffect(() => {
    loadScript("https://checkout.razorpay.com/v1/checkout.js", () => {});
  }, []);

  useEffect(() => {
    if (paymentStatus) {
      getdata([]);
    }
  }, [paymentStatus]);
  return (
    <>
      <Navbar bg="dark" variant="dark" id="great">
        <Container>
          <NavLink to="/" className="text-decoration-none text-light mx-3">
            Add to Cart
          </NavLink>
          <Nav className="me-auto">
            <NavLink to="/" className="text-decoration-none text-light">
              Home
            </NavLink>
          </Nav>

          <Badge
            badgeContent={getdata.length}
            color="primary"
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
          >
            <i
              class="fa-solid fa-cart-shopping text-light"
              style={{ fontSize: 25, cursor: "pointer" }}
            ></i>
          </Badge>
        </Container>

        <Menu
          id="basic-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleClose}
          MenuListProps={{
            "aria-labelledby": "basic-button",
          }}
        >
          {getdata.length ? (
            <div
              className="card_details tara"
              style={{ width: "24rem", padding: 10 }}
            >
              <Table>
                <thead>
                  <tr>
                    {/* <h1> this is headerjs page</h1> */}

                    <th>Photo</th>
                    <th>Restaurant Name</th>
                  </tr>
                </thead>
                <tbody>
                  {getdata.map((e) => {
                    return (
                      <>
                        <tr>
                          <td>
                            <NavLink to={`/cart/${e.id}`} onClick={handleClose}>
                              <img
                                src={e.imgdata}
                                style={{ width: "5rem", height: "5rem" }}
                                alt=""
                              />
                            </NavLink>
                          </td>
                          <td>
                            <p>{e.rname}</p>
                            <p>Price : ₹{e.price}</p>
                            <p>Quantity : {e.qnty}</p>
                            <p
                              style={{
                                color: "red",
                                fontSize: 20,
                                cursor: "pointer",
                              }}
                              onClick={() => dlt(e.id)}
                            >
                              <i className="fas fa-trash smalltrash"></i>
                            </p>
                          </td>

                          <td
                            className="mt-5"
                            style={{
                              color: "red",
                              fontSize: 20,
                              cursor: "pointer",
                            }}
                            onClick={() => dlt(e.id)}
                          >
                            <i className="fas fa-trash largetrash"></i>
                          </td>
                        </tr>
                      </>
                    );
                  })}
                  <p className="text-center">Total :₹ {data[0]?.price}</p>
                  <Button
                    style={{
                      backgroundColor: "black",
                    }}
                    onClick={handlePayment}
                    className="btn proceed"
                  >
                    Proceed to checkout
                  </Button>
                </tbody>
              </Table>
            </div>
          ) : (
            <div
              className="card_details d-flex justify-content-center align-items-center"
              style={{ width: "24rem", padding: 10, position: "relative" }}
            >
              <i
                className="fas fa-close smallclose"
                onClick={handleClose}
                style={{
                  position: "absolute",
                  top: 2,
                  right: 20,
                  fontSize: 23,
                  cursor: "pointer",
                }}
              ></i>
              <p style={{ fontSize: 22 }}>Your carts is empty</p>
              <img
                src="./cart.gif"
                alt=""
                className="emptycart_img"
                style={{ width: "5rem", padding: 10 }}
              />
            </div>
          )}
        </Menu>
      </Navbar>
    </>
  );
};

export default Header;
