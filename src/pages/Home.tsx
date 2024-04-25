import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import SkeletonLoader from "../components/SkeletonLoader";
import { useLatestProductsQuery } from "../redux/api/ProductApi";
import { addToCart } from "../redux/reducer/CartReducer";
import { server } from "../redux/store";
import { CartItemType } from "../types/Types";

const Home = () => {
const dispatch=useDispatch();

  const addToCartHandler = (cartItem: CartItemType) => {
    if (cartItem.stock < 1) {
      return toast.error("Product Out Of Stock :(");
    }
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart")
  };
  const { data, isLoading, isError } = useLatestProductsQuery("");
  console.log(data);
  if (isError) {
    toast.error("Cannot Fetch the Products");
  }
  return (
    <div className="home">
      <section></section>
      <div className="heads">
        <h1>Latest Product</h1>

        <Link to={"/search"} className="findmore">
          More
        </Link>
      </div>

      <div className="main">
        {isLoading ? (
          <SkeletonLoader />
        ) : (
          data?.product.map((i) => (
            <ProductCard
              key={i._id}
              productId={i._id}
              name={i.name}
              photo={`${server}/${i.photo}`}
              price={i.price}
              stock={i.stock}
              handler={addToCartHandler}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Home;
