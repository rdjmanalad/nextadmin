import TransactionGBW from "@/app/ui/dashboard/transaction/transactionGBW";

const Transactions = () => {
  const emptyObj = {
    id: "",
    codeNo: "",
    inventoryNo: "",
    transactDate: "",
    description: "",
    karat: "",
    weight: "",
    capital: "0",
    sellingPrice: "0",
    discountedPrice: "0",
    customerName: "",
    receiverName: "",
    address: "",
    contactNo: "",
    paymentTerm: "",
    paymentMode: "",
    cashPaymentDate: "",
    cashPayment: "0",
    referenceNo: "",
    user: "",
    timeStamped: "",
  };

  return (
    <div>
      <TransactionGBW emptyObj={emptyObj} />
    </div>
  );
};
export default Transactions;
