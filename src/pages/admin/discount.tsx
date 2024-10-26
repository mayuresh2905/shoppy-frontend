import { ReactElement, useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { Column } from 'react-table';
import AdminSidebar from '../../components/admin/AdminSidebar';
import TableHOC from '../../components/admin/TableHOC';
import { Skeleton } from '../../components/Loader';
import { useFetchData } from '6pp';
import { RootState, server } from '../../redux/store';
import toast from 'react-hot-toast';
import { AllDiscountResponse } from '../../types/api-types';
import { useSelector } from 'react-redux';


interface DataType {  
    code: string;
    amount: number;
    _id: string;
    action: ReactElement;
}

const columns: Column<DataType>[] = [
    {
        Header: "Id",
        accessor: "_id",
    },
    {
      Header: "Code",
      accessor: "code",
    },
    {
      Header: "Amount",
      accessor: "amount",
    },
     
    {
      Header: "Action",
      accessor: "action",
    },
  ];

const Discount = () => {


  const { user } = useSelector((state: RootState) => state.userReducer);

  const { data,loading,error} = useFetchData<AllDiscountResponse>(`${server}/api/v1/payment/coupon/all?id=${user?._id}`,"discount-code")

    const [rows, setRows] = useState<DataType[]>([]);

    if (error) {  
      toast.error(error);
    }
  
    useEffect(() => {
  
      if (data)
        setRows(
          data.coupons.map((i) => ({
            _id: i._id,
            code: i.code,
            amount: i.amount,
            action: <Link to={`/admin/discount/${i._id}`}>Manage</Link>,
          }))
        );
      
    
     
    }, [data])

    const Table = TableHOC<DataType>(
        columns,
        rows,
        "dashboard-product-box",
        "Discounts",
        rows.length > 6
      )();



    return (
        <div className="admin-container">
          <AdminSidebar />
          <main>{loading? <Skeleton length={20}/> : Table}</main>
          <Link to="/admin/discount/new" className="create-product-btn">
            <FaPlus />
          </Link>
        </div>
      );
}

export default Discount