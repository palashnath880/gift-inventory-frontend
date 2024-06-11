import {
  Button,
  Pagination,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import PageHeader from "../components/shared/PageHeader";
import { StyledTableCell, StyledTableRow } from "../components/shared/MUITable";
import { Link } from "react-router-dom";
import SearchInput from "../components/shared/SearchInput";

export default function Customers() {
  return (
    <div className="pb-10">
      <PageHeader title="Customers" />
      <div className="mb-5">
        <SearchInput label="Search Customers by Name or Phone NO" />
      </div>
      <div>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <StyledTableCell>Name</StyledTableCell>
                <StyledTableCell>Email</StyledTableCell>
                <StyledTableCell>Phone NO</StyledTableCell>
                <StyledTableCell>Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell></StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              <StyledTableRow>
                <StyledTableCell>Palash</StyledTableCell>
                <StyledTableCell>pk@gmail.com</StyledTableCell>
                <StyledTableCell>+8801304780828</StyledTableCell>
                <StyledTableCell>Customer Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>
                  <Link to={"100"}>
                    <Button
                      variant="contained"
                      className="!py-2.5 !font-medium"
                    >
                      Gift Allocate
                    </Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Palash</StyledTableCell>
                <StyledTableCell>pk@gmail.com</StyledTableCell>
                <StyledTableCell>+8801304780828</StyledTableCell>
                <StyledTableCell>Customer Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>
                  <Link to={"100"}>
                    <Button
                      variant="contained"
                      className="!py-2.5 !font-medium"
                    >
                      Gift Allocate
                    </Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Palash</StyledTableCell>
                <StyledTableCell>pk@gmail.com</StyledTableCell>
                <StyledTableCell>+8801304780828</StyledTableCell>
                <StyledTableCell>Customer Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>
                  <Link to={"100"}>
                    <Button
                      variant="contained"
                      className="!py-2.5 !font-medium"
                    >
                      Gift Allocate
                    </Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Palash</StyledTableCell>
                <StyledTableCell>pk@gmail.com</StyledTableCell>
                <StyledTableCell>+8801304780828</StyledTableCell>
                <StyledTableCell>Customer Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>
                  <Link to={"100"}>
                    <Button
                      variant="contained"
                      className="!py-2.5 !font-medium"
                    >
                      Gift Allocate
                    </Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Palash</StyledTableCell>
                <StyledTableCell>pk@gmail.com</StyledTableCell>
                <StyledTableCell>+8801304780828</StyledTableCell>
                <StyledTableCell>Customer Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>
                  <Link to={"100"}>
                    <Button
                      variant="contained"
                      className="!py-2.5 !font-medium"
                    >
                      Gift Allocate
                    </Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Palash</StyledTableCell>
                <StyledTableCell>pk@gmail.com</StyledTableCell>
                <StyledTableCell>+8801304780828</StyledTableCell>
                <StyledTableCell>Customer Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>
                  <Link to={"100"}>
                    <Button
                      variant="contained"
                      className="!py-2.5 !font-medium"
                    >
                      Gift Allocate
                    </Button>
                  </Link>
                </StyledTableCell>
              </StyledTableRow>
              <StyledTableRow>
                <StyledTableCell>Palash</StyledTableCell>
                <StyledTableCell>pk@gmail.com</StyledTableCell>
                <StyledTableCell>+8801304780828</StyledTableCell>
                <StyledTableCell>Customer Type</StyledTableCell>
                <StyledTableCell>Project</StyledTableCell>
                <StyledTableCell>CSC</StyledTableCell>
                <StyledTableCell>
                  <span className="w-full flex justify-end gap-4">
                    <Link to={"allocate/customerId/gift"}>
                      <Button
                        variant="contained"
                        className="!py-2.5 !font-medium"
                      >
                        Gift Allocate
                      </Button>
                    </Link>
                    <Link to={"allocate/customerId/voucher"}>
                      <Button
                        variant="contained"
                        className="!py-2.5 !font-medium"
                      >
                        Voucher Allocate
                      </Button>
                    </Link>
                  </span>
                </StyledTableCell>
              </StyledTableRow>
            </TableBody>
          </Table>
        </TableContainer>
        <div className="flex justify-center mt-5">
          <Pagination />
        </div>
      </div>
    </div>
  );
}
