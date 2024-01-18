import Transaction from "@/app/ui/dashboard/transaction/transaction";

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
    totalPayment: "0",
    balance: "0",
    fullPaymentDate: "",
    forfeitedAmt: "0",
    forfeitedDate: "",
    user: "",
    timeStamped: "",
  };
  return (
    <div>
      <Transaction emptyObj={emptyObj} />
    </div>
  );
};
export default Transactions;
