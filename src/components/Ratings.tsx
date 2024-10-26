import { useRating } from '6pp';
import { FaRegStar, FaStar } from 'react-icons/fa6';


const RatingsComponent = ({value = 0}:{value:number}) => {
    const { Ratings } = useRating({
        IconFilled: <FaStar />, 
        IconOutline: <FaRegStar />,
        value,
        styles: {
            fontSize: "3rem",
            color: "coral",
            justifyContent: "flex-start",
            marginTop:"1rem"
        }
    });
  return <Ratings />;
}

export default RatingsComponent;