import { useState } from "react"
import ProductCard from "../components/Product-Card";
import { useCategoriesQuery, useSearchProductsQuery } from "../redux/api/productAPI";
import { CustomError } from "../types/api-types";
import toast from "react-hot-toast";
import { Skeleton } from "../components/Loader";
import { CartItem } from "../types/types";
import { addToCart } from "../redux/reducer/cartReducer";
import { useDispatch } from "react-redux";
import Footer from "../components/Footer";
import { useSearchParams } from "react-router-dom";


const Search = () => {

  const searchQuery = useSearchParams()[0];

  const { data:categoriesResponse , isLoading:loadingCategories, isError,error} = useCategoriesQuery("")



  const [search,setSearch] = useState<string>("");
  const [sort,setSort] = useState<string>("");
  const [maxPrice,setMaxPrice] = useState<number>(100000);
  const [category,setCategory] = useState<string>(searchQuery.get("category") || "");
  const [page,setPage] = useState<number>(1);


  const {isLoading:productLoading, data:searchData, isError: productIsError, error: productError } = useSearchProductsQuery({search,sort,category,page,price:maxPrice})

  const isNextPage = true;
  const isPrevPage = true;

 

  if (isError) {
    const err = error as CustomError;
    toast.error(err.data.message);
  }

  if (productIsError) {
    const err = productError as CustomError;
    toast.error(err.data.message);
  }

  const dispatch = useDispatch();

  const addToCartHandler= (cartItem: CartItem) => {
    if(cartItem.stock < 1) return toast.error("Out of Stock");
    dispatch(addToCart(cartItem));
    toast.success("Added to Cart");
  }
  
  return (
    <>
    <div className="product-search-page">
      <aside>
        <h2>Filters</h2>
        <div>
          <h4>Sort</h4>
          <select value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="">None</option>
            <option value="asc">Price (Low to High)</option>
            <option value="dsc">Price (High to Low)</option>
          </select>
        </div>
        <div>
          <h4>Max Price: {maxPrice || ""}</h4>
          <input type="range" min={100} max={100000} value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </div>
        <div>
          <h4>Category</h4>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">ALL</option>
            {
              !loadingCategories && categoriesResponse?.categories.map((i) => (
                <option key={i} value={i}>{i.toUpperCase()}</option>
              ))
            }
            
          </select>
        </div>
      </aside>
      <main>
        <h1>Products</h1>
        <input type="text" placeholder="Search by name..." value={search} onChange={(e) => setSearch(e.target.value)} />
        {
          productLoading ? <Skeleton length={10}/> :(
            <div className="search-product-list">
            {
              searchData?.products.map((i) => (
                <ProductCard 
                   key={i._id}
                   productId={i._id} 
                   name={i.name} 
                   price={i.price} 
                   stock={i.stock}  
                   handler={addToCartHandler}
            
                   photos={i.photos}
                  />
              ))
            }
            </div>
          )
        }
        {
          searchData && searchData.totalPage > 1 && (
            <article>
             <button disabled={!isPrevPage} onClick={()=> setPage(prev=> prev - 1)}>Prev</button>
                   <span>{page} of {searchData.totalPage}</span>
               <button disabled={!isNextPage} onClick={()=> setPage(prev=> prev + 1)}>Next</button>
            </article>
          )
        }
      </main>
      
    </div>
    <Footer />
    </>
  )
}

export default Search;


