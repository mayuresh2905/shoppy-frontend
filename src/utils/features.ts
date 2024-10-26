import { MessageResponse } from "../types/api-types";
import { FetchBaseQueryError } from "@reduxjs/toolkit/query/react";
import { SerializedError } from "@reduxjs/toolkit";
import { NavigateFunction } from "react-router-dom";
import toast from "react-hot-toast";
import moment from "moment";

type ResType = {
    data: MessageResponse;
    error?: undefined;
} | {
    data?: undefined;
    error: FetchBaseQueryError | SerializedError;
}

export const responseToast = (res: ResType, navigate: NavigateFunction | null, url: string) => {
    if("data" in res) {
        toast.success(res.data!.message);
        if (navigate) navigate(url)
    } else {
           const error = res.error as FetchBaseQueryError;
           const messageResponse =  error.data as MessageResponse;
           toast.error(messageResponse.message);
    }
} 

export const getLastMonths = () => {

    const currentDate = moment();

    currentDate.date(1);

    const last6Months : string[] = [];
    const last12Months : string[] = [];

    for (let index = 0; index < 6; index++) {
        const monthDate = currentDate.clone().subtract(index,"months");
        const monthName = monthDate.format("MMMM");
        last6Months.unshift(monthName);
        
    }

    for (let index = 0; index < 12; index++) {
        const monthDate = currentDate.clone().subtract(index,"months");
        const monthName = monthDate.format("MMMM");
        last12Months.unshift(monthName);
        
    }

    return {
        last12Months,
        last6Months
    }
};

export const transformImage = (url: string, width = 200) => {
    const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);
    return newUrl;
};