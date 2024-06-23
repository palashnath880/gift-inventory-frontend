import { Button } from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment, { Moment } from "moment";
import { useEffect, useState } from "react";

interface DateState {
  fromDate: null | Moment;
  toDate: null | Moment;
}

interface ReportDateFormProps {
  loading: boolean;
  values: {
    fromDate: null | undefined | string;
    toDate: null | undefined | string;
  };
  onSearch: (fromDate: string, toDate: string) => void;
}

export default function ReportDateForm({
  loading,
  onSearch,
  values,
}: ReportDateFormProps) {
  // states
  const [date, setDate] = useState<DateState>({ fromDate: null, toDate: null });

  const handleSearch = () => {
    if (!date.toDate || !date.fromDate) {
      return;
    }
    const searchDate: any = { ...date };
    searchDate.fromDate = moment(date.fromDate).format("y-MM-DD") || "";
    searchDate.toDate = moment(date.toDate).format("y-MM-DD") || "";
    onSearch(searchDate.fromDate, searchDate.toDate);
  };

  useEffect(() => {
    const momentDate: any = {};

    if (values?.fromDate) {
      momentDate.fromDate = moment(values?.fromDate);
    }
    if (values?.toDate) {
      momentDate.toDate = moment(values?.toDate);
    }

    setDate(momentDate);
  }, [values]);

  return (
    <div className="flex justify-center pb-5">
      <div className="sm:w-[500px] flex gap-3">
        <LocalizationProvider dateAdapter={AdapterMoment}>
          <DatePicker
            label="Select From Date"
            value={date.fromDate}
            onChange={(val) =>
              setDate({ ...date, fromDate: val ? moment(val) : null })
            }
          />
          <DatePicker
            label="Select To Date"
            value={date.toDate}
            onChange={(val) =>
              setDate({ ...date, toDate: val ? moment(val) : null })
            }
          />
          <Button
            disabled={Boolean(!date.fromDate || !date.toDate) || loading}
            variant="contained"
            className="!px-5 !capitalize !text-sm"
            onClick={handleSearch}
          >
            Search
          </Button>
        </LocalizationProvider>
      </div>
    </div>
  );
}
