import { useState,useEffect } from "react";
import { VscError } from "react-icons/vsc";
import CartItemCard from "../components/Cart-item";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { CartReducerInitialState } from "../types/reducer-types";
import { CartItem } from "../types/types";
import { useDispatch } from "react-redux";
import { addToCart, calculatePrice, discountApplied, removeCartItem, saveCoupon } from "../redux/reducer/cartReducer";
import toast from "react-hot-toast";
import axios from "axios";
import { server } from "../redux/store";






const Cart = () => {

  const { cartItems,subtotal, tax, total, shippingCharges, discount } = useSelector(
    (state:{ cartReducer: CartReducerInitialState}) => state.cartReducer
  );

  const dispatch = useDispatch();



  const [couponCode, setCouponCode] = useState<string>("");
  const [isValidCouponCode, setIsValidCouponCode] = useState<boolean>(false);

  const incrementHandler= (cartItem: CartItem) => {
    if (cartItem.quantity >= cartItem.stock) return toast.error("Stock Overloaded");
    dispatch(addToCart( {...cartItem, quantity: cartItem.quantity + 1 } ));
  }
  const decrementHandler= (cartItem: CartItem) => {
    if (cartItem.quantity <= 1) return ;
    dispatch(addToCart( {...cartItem, quantity: cartItem.quantity - 1 } ));
  }
  const removeHandler= (productId:string) => {
    dispatch(removeCartItem(productId));
  }

  useEffect(() => {

    const {token:cancelToken ,cancel} = axios.CancelToken.source();


    const timeOutid = setTimeout(() => {
       
      axios
      .get(`${server}/api/v1/payment/discount?coupon=${couponCode}`,
        {
          cancelToken,
        }
      )
      .then((res) => {
        dispatch(discountApplied(res.data.discount));
        dispatch(calculatePrice());
        setIsValidCouponCode(true)
      })
      .catch(() => {
        dispatch(discountApplied(0));
        dispatch(saveCoupon(couponCode));
        dispatch(calculatePrice());
        setIsValidCouponCode(false);
      });


       
    },1000);

    return () => {
      clearTimeout(timeOutid);
      cancel();
      setIsValidCouponCode(false);
    }
  }, [couponCode])

  useEffect(() => {
    dispatch(calculatePrice());
  }, [cartItems])
  
  

  return (
    <div className="cart">
      <main>
        {cartItems.length > 0 ? (
          cartItems.map((i, index)=> 
             <CartItemCard 
              key={index} 
              cartItem={i}
              incrementHandler={incrementHandler}
              decrementHandler={decrementHandler}
              removeHandler={removeHandler}
             />
          )
        ) : (
          <h1>No Items Added</h1>
        )
        }
      </main>
      <aside>
        <p>Subtotal: ₹{subtotal}</p>
        <p>Tax: ₹{tax}</p>
        <p>Shipping Charges: ₹{shippingCharges}</p>
        
        <p>
          Discount: <em className="red">
          -₹{discount}
          </em>
        </p>
        <p>
          <b>
          Total: ₹{total}
          </b>
        </p>
        <input type="text" placeholder="Coupon Code" value={couponCode} onChange={(e) => setCouponCode(e.target.value)}/>  
        {
          couponCode && (
            isValidCouponCode ?
          <span className="green">₹{discount} off using the <code>{couponCode}</code></span>
          : <span className="red">Invalid Coupon <VscError /></span>
        )}

        {
          cartItems.length > 0 && <Link to={"/shipping"}>Checkout</Link>
        }       
      </aside>
    </div>
  )
}

export default Cart