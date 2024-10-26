import { useRef, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom'
import { useAllReviewsProductsQuery, useDeleteReviewMutation, useNewReviewMutation, useProductDetailsQuery } from '../redux/api/productAPI';
import { Skeleton } from '../components/Loader';
import { Slider, MyntraCarousel, CarouselButtonType, useRating } from '6pp';
import { FaArrowLeftLong, FaArrowRightLong, FaRegStar, FaStar, FaTrash } from 'react-icons/fa6';
import RatingsComponent from '../components/Ratings';
import { useDispatch, useSelector } from 'react-redux';
import { CartItem, Review } from '../types/types';
import toast from 'react-hot-toast';
import { addToCart } from '../redux/reducer/cartReducer';
import { RootState } from '../redux/store';
import { FiEdit } from 'react-icons/fi';
import { responseToast } from '../utils/features';
import Footer from '../components/Footer';

const Product_Details = () => {

    const params = useParams();
    const dispatch = useDispatch();

    const { user } = useSelector((state: RootState) => state.userReducer);

    const [carouselOpen,setCarouselOpen] = useState(false);
    const [quantity,setQuantity] = useState(1);
    const [reviewComment, setReviewComment] = useState("");
    const [reviewSubmitLoading, setReviewSubmitLoading] = useState(false);
   
    const reviewDialogRef = useRef<HTMLDialogElement>(null);

    const {isLoading,isError,data} = useProductDetailsQuery(params.id!);
    const reviewResponse = useAllReviewsProductsQuery(params.id!);
    const [createReview] = useNewReviewMutation();
    const [deleteReview] = useDeleteReviewMutation();

    const addToCartHandler= (cartItem: CartItem) => {
      if(cartItem.stock < 1) return toast.error("Out of Stock");
      if(cartItem.stock < cartItem.quantity) return toast.error("Exceeds available stock");
      dispatch(addToCart(cartItem));
      toast.success("Added to Cart");
    }

    const increment = () => {
      if (data?.product?.stock === quantity)
        return toast.error(`${data?.product?.stock} available only`);
      setQuantity((prev) => prev + 1);
    };
    const decrement = () => setQuantity(prev => prev - 1);

    if (isError) return <Navigate to="/404" />;

    const showDialog = () => {
      reviewDialogRef.current?.showModal();
    };

    

    const { Ratings:RatingsEditable,rating,setRating} = useRating({
      IconFilled: <FaStar />, 
        IconOutline: <FaRegStar />,
        value:0,
        selectable:true,
        styles: {
            fontSize: "3rem",
            color: "coral",
            justifyContent: "flex-start",
        }
    });

    const reviewCloseHandler = () => {
      reviewDialogRef.current?.close();
      setRating(0); 
      setReviewComment("");
    };

    const submitReview = async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setReviewSubmitLoading(true);
      reviewCloseHandler();

      const res = await createReview({
        comment: reviewComment,
        rating,
        userId: user?._id,
        productId: params.id!
      });

      setReviewSubmitLoading(false);

      responseToast(res,null, "");
    }

    const handleDeleteReview = async (reviewId: string) => {
      const res = await deleteReview({ reviewId, userId: user?._id });
      responseToast(res, null, "");
    };

  return (
    <>
    <div className='product-details'>
        { isLoading ? (
            <ProductLoader />
        ):(
            <>
             <main>
               <section>
                <Slider
                  showThumbnails
                  showNav={false}
                  onClick={() => setCarouselOpen(true)}
                  images={data?.product?.photos.map((i) => i.url) || []} 
                />
                {carouselOpen && (
                <MyntraCarousel
                  NextButton={NextButton}
                  PrevButton={PrevButton}
                  setIsOpen={setCarouselOpen}
                  images={data?.product?.photos.map((i) => i.url) || []}
                />
               )}
               </section>
               <section>
                <h1>{data?.product?.name}</h1>
                <code>{data?.product?.category}</code>
                <em style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <RatingsComponent value={data?.product?.ratings || 0} />
                ({data?.product?.numOfReviews} reviews)
                </em>
                <h3>₹{data?.product?.price}</h3>
                <article>
                  <div>
                     <button onClick={decrement}>-</button>
                     <span>{quantity}</span>
                     <button onClick={increment}>+</button>
                  </div>
                  <button onClick={() => addToCartHandler({
                    productId: data?.product?._id!,
                    name: data?.product?.name!,
                    price: data?.product?.price!,
                    stock: data?.product?.stock!,
                    quantity,
                    photo: data?.product?.photos[0].url || "",
                  })}>
                     Add to Cart
                  </button>
                </article>
                <p>{data?.product?.description}</p>
               </section>
             </main>
            </>
        )}
        <dialog ref={reviewDialogRef} className='review-dialog'>
        <button onClick={reviewCloseHandler}>X</button>
          <h2>Write a Review</h2>
          <form onSubmit={submitReview}>
            <textarea value={reviewComment} onChange={(e) => setReviewComment(e.target.value)} placeholder='Review...'></textarea>
            <RatingsEditable  />
            <button type='submit'>Submit</button>
          </form>
        </dialog>
        <section>
          <article>
            <h2>Reviews</h2>
            <button disabled={reviewSubmitLoading} onClick={showDialog}>
              <FiEdit />
            </button>
          </article>
          <div style={{
            display: "flex",
            gap: "2rem",
            overflowX: "auto",
            padding: "2rem",
          }}>
          {
            reviewResponse.isLoading ? (
              <Skeleton width='100%' length={5} />
            ) : (
              reviewResponse.data?.reviews.map((review) => (
                <ReviewCard
                handleDeleteReview={handleDeleteReview}
                userId={user?._id}
                key={review._id}
                review={review}
              />
              ))
            )
          }
          </div>
        </section>
    </div>
    <Footer />
    </>
  )
};

const ReviewCard = ({
  review,
  userId,
  handleDeleteReview,
}: {
  userId?: string;
  review: Review;
  handleDeleteReview: (reviewId: string) => void;
}) => (
  <div className="review">
    <RatingsComponent value={review.rating} />
    <p>{review.comment}</p>
    <div>
      <img src={review.user.photo} alt="User" />
      <small>{review.user.name}</small>
    </div>
    {userId === review.user._id && (
      <button onClick={() => handleDeleteReview(review._id)}>
        <FaTrash />
      </button>
    )}
  </div>
);

const ProductLoader = () => {
    return (
      <div
        style={{
          display: "flex",
          gap: "2rem",
          border: "1px solid #f1f1f1",
          height: "80vh",
        }}
      >
        <section style={{ width: "100%", height: "100%" }}>
          <Skeleton
            width="100%"
            containerHeight="100%"
            height="100%"
            length={1}
          />
        </section>
        <section
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "4rem",
            padding: "2rem",
          }}
        >
          <Skeleton width="40%" length={3} />
          <Skeleton width="50%" length={4} />
          <Skeleton width="100%" length={2} />
          <Skeleton width="100%" length={10} />
        </section>
      </div>
    );
  };

  const NextButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
      <FaArrowRightLong />
    </button>
  );
  const PrevButton: CarouselButtonType = ({ onClick }) => (
    <button onClick={onClick} className="carousel-btn">
      <FaArrowLeftLong />
    </button>
  );

export default Product_Details