import { Link } from "react-router-dom";
import { FaSearch, FaShoppingBag, FaSignInAlt,FaUser, FaSignOutAlt } from "react-icons/fa";
import { useState } from "react";
import { User } from "../types/types";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import toast from "react-hot-toast";



interface PropsType {
  user: User | null;
}


const Header = ({user}: PropsType) => {

  const [ isOpen, setIsOpen ] = useState<boolean>(false);


  const logoutHandler = async () => {
    try {

      await signOut(auth);
      toast.success("Sign Out Successfully")

      setIsOpen(false);
      
    } catch (error) {

      toast.error("Sign Out Failed")
      
    }
    
  };


  return (
    <nav className="header">
      <div className="logo">
        <h2><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAADz0lEQVR4nO2aWUwTQRjH65tP+qqPPvtifNBHTNhpYadocHchQRASTkFMaUGNWNoiqNigBIWiIgaQwxgPTCwKojHBSCBe4TJRQxAVhBA1akuiyWemukuLYq/twTq/5J/uzk6/fPPvzrVblYpCoVAoFAqFQqFQvKBJ4DYymGtAmO+NRpHcNNrEzapQoNYKyQhzToR5iHJ9J7nK2niNJnE9wtynKGicb2L5jzGssE42AxgtlycGzy0wwODQE3j89HlUieSUU6CXTFBjIUc+A1jeJAZuvtQJcuBwOKC2/jyctjWCw+mUJSbJTcyT5CybAQhzZjFwS9tlWZK91nVLSvb6TbssMUlui12BM0e1AcMjYxC/I9klcvzfGUCYmZl1SS5WnAFyE/UGTM98COlMUFVd625ASyzeyYhCCcKGiBrw9NkwaBKSIrY2YFjuRyzmtoXEgPmFb/Dy85yHSJk7re1XIr5AYlihLCQG2KfGYd+jGx4iZcv1z5TUdNAV5ksi5+K1tPRUKCnOkk0kXtDjApLZgDqrEd4Otksi5+K1izY9LEzVyCYSjxqAV+gd8GXiJAz3V7g+ffm1J58ddynsd8DA7CTUjvZ7iJQFa4Ben+UqKzZkeW38YK8FNAmCS0N9lvAa4AuBGKDWCr92dlree19vMCzGaDAowwDkNoX5M9i5x6AG2OgdACHvAvM+rAQV3QXsIZoGyYguljsmT/3TgMa6Iqlu81mDMgxISkmRyieeeM7vS1Vp2SPV7eo4qAwDjIdypfLzZ4qWbfzsmBV2cMlS3fFHFcow4N7NxfL47QI8uFX2R+M/vqwGgyFTqpeTk66claDzzSnQ6RYbRxZER0x7oOd6KTzsNkHbhWJISdvlcX2gxxx+A3wh0N3g9OgJ2J3hvqX9u8iqseNiSWR2g74QzHZ47oUVLGV50tJ4qchgeffG4chth31BjucB4wOV0FRfBGZjHhzcnw1VlQVw+2opfHq1/G5RUQYsROsDEUUZwDDCWsRyTUvevb8Wg+zOLIADpeV+KyN7bzQYcMy7AZjXeRtxg1UEDej2akAsyxcq1QAG83avBqixsMV9bj127jLYrt2D6uYul8hxINKZrBE3ALE7z3k1QKVSrUKYHxK/tD0pA8rPtEL91b6AG0+0z1glJWI6pIc7nTWSyLl47eiRfNdqTi6ReH7PAogVNjGY+xrqrhB++TENIpbbymBuIvJJyycywKv8ISYmfTVihQzypjXov7Gx/H3E8u8QFubDI/49YvkRNRb6fv+FrjEubtcavwygUCgUCoVCoVAoKqXyE4p8BlO0/2k0AAAAAElFTkSuQmCC" />Shoppy</h2>
      </div>

      <div className="nav-links">
      <Link onClick={() => setIsOpen(false)} to={"/"}>HOME</Link>
      <Link onClick={() => setIsOpen(false)} to={"/search"}><FaSearch/></Link>
      <Link onClick={() => setIsOpen(false)} to={"/cart"}><FaShoppingBag /></Link>
      {
        user?._id ? (
          <>
            <button onClick={() => setIsOpen((prev) => !prev)}>
              <FaUser />
            </button>
             <dialog open={isOpen}>
              <div>
              {user.role === "admin" && (
                <Link onClick={() => setIsOpen(false)} to="/admin/dashboard">
                  Admin
                </Link>
              )}

              <Link onClick={() => setIsOpen(false)} to="/orders">
                Orders
              </Link>
              <button onClick={logoutHandler}>
                <FaSignOutAlt />
              </button>
            </div>
          </dialog>
        </>
      ) : (
        <Link to={"/login"}>
          <FaSignInAlt />
        </Link>
      )}
      </div>
      
      
    </nav>
  )
}

export default Header