import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { CartReducerInitialState } from "../types/ReducerTypes";
import axios from "axios";
import { server } from "../redux/store";
import toast from "react-hot-toast";
import { saveShippingInfo } from "../redux/reducer/CartReducer";
import { ShippingInfoType } from "../types/Types";

const Shipping = () => {
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoType>({
    address: "",
    city: "",
    state: "",
    country: "",
    pinCode:""
  });
  const { CartItems, total } = useSelector(
    (state: { CartReducer: CartReducerInitialState }) => state.CartReducer
  );
  const navigate = useNavigate();
  const dispatch=useDispatch();

  useEffect(() => {
    if (CartItems.length < 1) {
      return navigate("/cart");
    }
  }, [CartItems]);

  const changeHandler = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setShippingInfo((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };
  const submitHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
dispatch(saveShippingInfo(shippingInfo));
    try {
      const { data } = await axios.post(
        `${server}api/v1/payment/create`,
        {
          amount: total,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      navigate("/pay", {
        state: data.clientSecret,
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong")
    }
  };

  return (
    <div className="shipping">
      <button onClick={() => navigate("/cart")}>
        <IoChevronBackCircleSharp />
      </button>

      <form className="shipping-form" onSubmit={submitHandler}>
        <h1>
          SHIPPING <br />
          ADDRESS
        </h1>
        <input
          required
          type="text"
          placeholder="Address"
          name="address"
          value={shippingInfo.address}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="City"
          name="city"
          value={shippingInfo.city}
          onChange={changeHandler}
        />

        <input
          required
          type="text"
          placeholder="State"
          name="state"
          value={shippingInfo.state}
          onChange={changeHandler}
        />
        <select
          name="country"
          required
          value={shippingInfo.country}
          onChange={changeHandler}
        >
          <option value="">Choose Country</option>
          <option value="india">India</option>
        </select>
        <input
          required
          type="number"
          placeholder="Pin Code"
          name="PinCode"
          value={shippingInfo.pinCode}
          onChange={changeHandler}
        />

        <button type="submit">PAY NOW</button>
      </form>
    </div>
  );
};

export default Shipping;
