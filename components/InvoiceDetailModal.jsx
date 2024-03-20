// InvoiceDetailModal.js


function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US');
}

const InvoiceDetailModal = ({ invoice, onClose }) => {
  const {
    invoiceId,
    invoiceDate,
    deliveryDate,
    company,
    customer,
    items,
    discount,
    total,
    discountedTotal,
    paidAmount,
    duePayment,
    paymentMethod,
    paymentDetails,
    paymentStatus
  } = invoice;

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto p-10">
  <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div className="fixed inset-0 transition-opacity">
      <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
    </div>
    <div id="invoice_print_box" className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all max-w-[900px] w-full">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Payment Invoice</h3>
      </div>
      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Invoice ID</h3>
            <p>{invoiceId}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Invoice Date</h3>
            <p>{formatDate(invoiceDate)}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Delivery Date</h3>
            <p>{formatDate(deliveryDate)}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Company Name</h3>
            <p>{company.companyName}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Creator Name</h3>
            <p>{company.creatorName}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Email</h3>
            <p>{company.brandEmail}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Phone</h3>
            <p>{company.brandPhone}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Address</h3>
            <p>{company.brandAddress}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Customer Company</h3>
            <p>{customer.company}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Customer Name</h3>
            <p>{customer.name}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Customer Email</h3>
            <p>{customer.email}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Customer Phone</h3>
            <p>{customer.phone}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Customer Address</h3>
            <p>{customer.address}</p>
          </div>
          <div className="col-span-2">
            <h3 className="text-md leading-6 font-medium text-gray-900">Items</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Serial No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {items.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-100">
                    <td className="px-6 py-4 whitespace-nowrap">{item.serialNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.productTitle}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.productDescription}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.quantity}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{item.unitPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Discount</h3>
            <p>{discount}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Total</h3>
            <p>{total}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Discounted Total</h3>
            <p>{discountedTotal}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Paid Amount</h3>
            <p>{paidAmount}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Due Payment</h3>
            <p>{duePayment}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Payment Method</h3>
            <p>{paymentMethod}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Payment Details</h3>
            <p>{paymentDetails}</p>
          </div>
          <div>
            <h3 className="text-md leading-6 font-medium text-gray-900">Payment Status</h3>
            <p className={`${paymentStatus === 'unpaid' ? 'text-red-600' : 'text-green-600'}`}>
                {paymentStatus}
              </p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button onClick={onClose} type="button" className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm">
          Close
        </button>
      </div>
    </div>
  </div>
</div>



  );
};

export default InvoiceDetailModal;
